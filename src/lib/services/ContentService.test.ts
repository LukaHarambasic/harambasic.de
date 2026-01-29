import { expect, test, describe, beforeEach } from 'vitest';
import type { EntryType } from '$lib/types/enums';
import type { RawEntry } from '$lib/types/entry';
import type { ContentService } from './ContentService';
import type { ValidationResult } from '$lib/schemas';
import { ContentServiceError } from './ContentService';

/**
 * Mock ContentService implementation for testing
 */
class MockContentService implements ContentService {
	private mockData: Record<EntryType, RawEntry[]>;

	constructor(mockData: Record<EntryType, RawEntry[]> = {} as Record<EntryType, RawEntry[]>) {
		this.mockData = mockData;
	}

	async getEntries(entryType: EntryType): Promise<RawEntry[]> {
		if (entryType === ('error' as EntryType)) {
			throw new ContentServiceError('Mock error', entryType);
		}
		return this.mockData[entryType] || [];
	}

	async getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null> {
		const entries = await this.getEntries(entryType);
		return entries.find((entry) => this.generateSlug(entry.title) === slug) || null;
	}

	async getEntryMetadata(
		entryType: EntryType,
		slug: string
	): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null> {
		const entry = await this.getEntry(entryType, slug);
		if (!entry) return null;

		return {
			title: entry.title,
			description: entry.description,
			published: entry.published
		};
	}

	async validateContent(entryType: EntryType): Promise<ValidationResult[]> {
		return [
			{
				entryType: entryType as any,
				isValid: true,
				message: 'Mock validation passed'
			}
		];
	}

	async validateAllContent() {
		return {
			overall: { total: 1, passed: 1, failed: 0, successRate: 100 },
			byType: { post: [], project: [], uses: [], work: [] } as Record<
				EntryType,
				ValidationResult[]
			>,
			errors: [] as ValidationResult[]
		};
	}

	async validateEntryWithQuality(entryType: EntryType, _slug: string) {
		return {
			validation: {
				entryType: entryType as any, // Cast to any to avoid the strict type check for the mock
				isValid: true,
				message: 'Mock validation'
			},
			qualityIssues: []
		};
	}

	private generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}
}

describe('ContentService Interface', () => {
	let mockService: MockContentService;

	const mockPost: RawEntry = {
		html: '<h1>Test Post</h1><p>This is a test post.</p>',
		title: 'Test Post',
		description: 'A test post for unit testing',
		image: '/images/test.jpg',
		tags: ['testing', 'unit-test'],
		published: '2023-01-01',
		updated: '2023-01-02',
		toc: [
			{
				depth: 1,
				slug: 'test-post',
				value: 'Test Post',
				children: []
			}
		]
	};

	const mockProject: RawEntry = {
		html: '<h1>Test Project</h1><p>A sample project.</p>',
		title: 'Test Project',
		description: 'A test project for unit testing',
		image: '/images/project.jpg',
		tags: ['project', 'testing'],
		published: '2023-02-01',
		updated: '2023-02-02',
		prio: 1,
		toc: []
	};

	beforeEach(() => {
		mockService = new MockContentService({
			post: [mockPost],
			project: [mockProject],
			uses: [],
			work: []
		});
	});

	test('getEntries - should return all entries for a given type', async () => {
		const posts = await mockService.getEntries('post');
		expect(posts).toHaveLength(1);
		expect(posts[0]).toEqual(mockPost);

		const projects = await mockService.getEntries('project');
		expect(projects).toHaveLength(1);
		expect(projects[0]).toEqual(mockProject);

		const uses = await mockService.getEntries('uses');
		expect(uses).toHaveLength(0);
	});

	test('getEntries - should handle errors appropriately', async () => {
		await expect(mockService.getEntries('error' as EntryType)).rejects.toThrow(ContentServiceError);
	});

	test('getEntry - should return single entry by slug', async () => {
		const post = await mockService.getEntry('post', 'test-post');
		expect(post).toEqual(mockPost);

		const project = await mockService.getEntry('project', 'test-project');
		expect(project).toEqual(mockProject);
	});

	test('getEntry - should return null for non-existent slug', async () => {
		const post = await mockService.getEntry('post', 'non-existent');
		expect(post).toBeNull();
	});

	test('getEntryMetadata - should return metadata subset', async () => {
		const metadata = await mockService.getEntryMetadata('post', 'test-post');
		expect(metadata).toEqual({
			title: 'Test Post',
			description: 'A test post for unit testing',
			published: '2023-01-01'
		});
	});

	test('getEntryMetadata - should return null for non-existent entry', async () => {
		const metadata = await mockService.getEntryMetadata('post', 'non-existent');
		expect(metadata).toBeNull();
	});

	test('validateContent - should return validation results', async () => {
		const results = await mockService.validateContent('post');
		expect(results).toHaveLength(1);
		expect(results[0].isValid).toBe(true);
		expect(results[0].entryType).toBe('post');
	});
});

describe('ContentServiceError', () => {
	test('should create error with correct properties', () => {
		const error = new ContentServiceError('Test error', 'post', 'test-slug');

		expect(error.message).toBe('Test error');
		expect(error.entryType).toBe('post');
		expect(error.slug).toBe('test-slug');
		expect(error.name).toBe('ContentServiceError');
		expect(error instanceof Error).toBe(true);
	});

	test('should create error without slug', () => {
		const error = new ContentServiceError('Test error', 'project');

		expect(error.message).toBe('Test error');
		expect(error.entryType).toBe('project');
		expect(error.slug).toBeUndefined();
	});

	test('should create error with cause', () => {
		const cause = new Error('Original error');
		const error = new ContentServiceError('Test error', 'post', undefined, cause);

		expect(error.cause).toBe(cause);
	});
});
