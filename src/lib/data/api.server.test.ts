import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import type { ValidationResult } from '$lib/schemas';
import type { ContentService } from '$lib/services';
import { setContentService, resetContentService } from '$lib/services/serviceInstance';
import { requestPosts, requestProjects, requestUses } from './api.server';

/**
 * Mock ContentService implementation for testing
 */
class MockContentService implements ContentService {
	private mockData: Partial<Record<EntryType, RawEntry[]>>;

	constructor(mockData: Partial<Record<EntryType, RawEntry[]>> = {}) {
		this.mockData = mockData;
	}

	async getEntries(entryType: EntryType): Promise<RawEntry[]> {
		return this.mockData[entryType] || [];
	}

	async getEntry(_entryType: EntryType, _slug: string): Promise<RawEntry | null> {
		return null;
	}

	async getEntryMetadata(
		_entryType: EntryType,

		_slug: string
	): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null> {
		return null;
	}

	async validateContent(_entryType: EntryType) {
		return [];
	}

	async validateAllContent() {
		return {
			overall: { total: 0, passed: 0, failed: 0, successRate: 100 },
			byType: {} as Record<EntryType, ValidationResult[]>,
			errors: []
		};
	}

	async validateEntryWithQuality(_entryType: EntryType, _slug: string) {
		return null;
	}
}

/** Assert that an array has exactly one element and return it */
function expectSingle<T>(arr: T[], label: string): T {
	expect(arr).toHaveLength(1);
	const item = arr[0];
	if (item === undefined) throw new Error(`Expected single ${label}`);
	return item;
}

const createMockRawEntry = (overrides: Partial<RawEntry> = {}): RawEntry => ({
	title: 'Test Entry',
	description: 'A test entry for unit testing purposes',
	image: 'test-image.jpg',
	tags: ['javascript', 'testing'],
	published: '2024-01-01',
	updated: '2024-01-15',
	html: '<p>Test content</p>',
	toc: [],
	...overrides
});

describe('Generic API Server', () => {
	let mockService: MockContentService;

	beforeEach(() => {
		mockService = new MockContentService();
		setContentService(mockService);
	});

	afterEach(() => {
		resetContentService();
		vi.clearAllMocks();
	});

	describe('requestPosts', () => {
		it('should transform and return posts with tags', async () => {
			const mockPost = createMockRawEntry({
				title: 'Test Post',
				description: 'A test post',
				tldr: 'TLDR text',
				discussion: 'Discussion link'
			});

			mockService = new MockContentService({ post: [mockPost] });
			setContentService(mockService);

			const [posts, tags] = await requestPosts();

			const post = expectSingle(posts, 'post');
			expect(post.type).toBe('post');
			expect(post.title).toBe('Test Post');
			expect(post.tldr).toBe('TLDR text');
			expect(post.discussion).toBe('Discussion link');
			expect(post.html).toBe('<p>Test content</p>');
			expect(post.slug).toBe('test-post');
			expect(post.relativePath).toBe('/posts/test-post');
			expect(post.fullPath).toBe('https://harambasic.de/posts/test-post');

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
			const firstTag = expectSingle(tags.slice(0, 1), 'tag');
			expect(firstTag.display).toBe('All');
			expect(firstTag.count).toBe(1);
		});

		it('should filter out invalid posts (missing title)', async () => {
			const validPost = createMockRawEntry({ title: 'Valid Post' });
			const invalidPost = createMockRawEntry({ title: '' });

			mockService = new MockContentService({ post: [validPost, invalidPost] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(expectSingle(posts, 'post').title).toBe('Valid Post');
		});

		it('should filter out invalid posts (missing description)', async () => {
			const validPost = createMockRawEntry({ title: 'Valid Post', description: 'Description' });
			const invalidPost = createMockRawEntry({ title: 'Invalid Post', description: '' });

			mockService = new MockContentService({ post: [validPost, invalidPost] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(expectSingle(posts, 'post').title).toBe('Valid Post');
		});

		it('should handle transformation errors gracefully', async () => {
			const invalidPost = createMockRawEntry({
				title: 'Invalid Post',
				published: 'invalid-date'
			});

			mockService = new MockContentService({ post: [invalidPost] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(posts).toHaveLength(0);
		});

		it('should return empty arrays when no posts exist', async () => {
			mockService = new MockContentService({ post: [] });
			setContentService(mockService);

			const [posts, tags] = await requestPosts();

			expect(posts).toHaveLength(0);
			expect(tags).toHaveLength(1); // 'All' tag
			expect(expectSingle(tags, 'tag').display).toBe('All');
		});
	});

	describe('requestProjects', () => {
		it('should transform and return projects with tags', async () => {
			const mockProject = createMockRawEntry({
				title: 'Test Project',
				description: 'A test project',
				links: [{ url: 'https://example.com', title: 'Example' }],
				prio: 5,
				status: 'active',
				imageAlt: 'Alt text'
			});

			mockService = new MockContentService({ project: [mockProject] });
			setContentService(mockService);

			const [projects, tags] = await requestProjects();

			const project = expectSingle(projects, 'project');
			expect(project.type).toBe('project');
			expect(project.title).toBe('Test Project');
			expect(project.links).toHaveLength(1);
			expect(project.prio).toBe(5);
			expect(project.status).toBe('active');
			expect(project.imageAlt).toBe('Alt text');
			expect(project.slug).toBe('test-project');
			expect(project.relativePath).toBe('/projects/test-project');

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
		});

		it('should throw error on missing published date', async () => {
			type RawEntryWithOptionalDates = Omit<RawEntry, 'published' | 'updated'> & {
				published?: string;
				updated?: string;
			};
			const invalidProject = createMockRawEntry({
				title: 'Invalid Project',
				published: undefined
			} as RawEntryWithOptionalDates);

			mockService = new MockContentService({ project: [invalidProject] });
			setContentService(mockService);

			await expect(requestProjects()).rejects.toThrow(/Missing 'published' date/);
		});

		it('should throw error on missing updated date', async () => {
			type RawEntryWithOptionalDates = Omit<RawEntry, 'published' | 'updated'> & {
				published?: string;
				updated?: string;
			};
			const invalidProject = createMockRawEntry({
				title: 'Invalid Project',
				updated: undefined
			} as RawEntryWithOptionalDates);

			mockService = new MockContentService({ project: [invalidProject] });
			setContentService(mockService);

			await expect(requestProjects()).rejects.toThrow(/Missing 'updated' date/);
		});

		it('should throw error on invalid published date format', async () => {
			const invalidProject = createMockRawEntry({
				title: 'Invalid Project',
				published: 'invalid-date'
			});

			mockService = new MockContentService({ project: [invalidProject] });
			setContentService(mockService);

			await expect(requestProjects()).rejects.toThrow(/Invalid 'published' date/);
		});
	});

	describe('requestUses', () => {
		it('should transform and return uses entries with tags', async () => {
			const mockUses = createMockRawEntry({
				title: 'Test Tool',
				description: 'A test tool',
				url: 'https://example.com',
				status: 'active',
				openSource: true
			});

			mockService = new MockContentService({ uses: [mockUses] });
			setContentService(mockService);

			const [uses, tags] = await requestUses();

			const usesEntry = expectSingle(uses, 'uses entry');
			expect(usesEntry.type).toBe('uses');
			expect(usesEntry.title).toBe('Test Tool');
			expect(usesEntry.url).toBe('https://example.com');
			expect(usesEntry.status).toBe('active');
			expect(usesEntry.openSource).toBe(true);
			expect(usesEntry.slug).toBe('test-tool');
			expect(usesEntry.relativePath).toBe('/uses/test-tool');

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
		});

		it('should throw error on missing required fields', async () => {
			const invalidUses = createMockRawEntry({
				title: '',
				description: 'Description'
			});

			mockService = new MockContentService({ uses: [invalidUses] });
			setContentService(mockService);

			await expect(requestUses()).rejects.toThrow(/Missing required fields/);
		});

		it('should use default values for optional fields', async () => {
			const mockUses = createMockRawEntry({
				title: 'Test Tool',
				description: 'Description',
				url: undefined,
				status: undefined,
				openSource: undefined
			});

			mockService = new MockContentService({ uses: [mockUses] });
			setContentService(mockService);

			const [uses] = await requestUses();

			const usesEntry = expectSingle(uses, 'uses entry');
			expect(usesEntry.url).toBe('');
			expect(usesEntry.status).toBe('active');
			expect(usesEntry.openSource).toBe(false);
		});
	});

	describe('Tag generation', () => {
		it('should generate unique tags across multiple entries', async () => {
			const post1 = createMockRawEntry({
				title: 'Post 1',
				tags: ['javascript', 'testing']
			});
			const post2 = createMockRawEntry({
				title: 'Post 2',
				tags: ['javascript', 'typescript']
			});

			mockService = new MockContentService({ post: [post1, post2] });
			setContentService(mockService);

			const [, tags] = await requestPosts();

			// Should have 'All' tag + 3 unique tags (javascript, testing, typescript)
			expect(tags.length).toBeGreaterThanOrEqual(4);
			const tagDisplays = tags.map((t) => t.display);
			expect(tagDisplays).toContain('All');
			expect(tagDisplays).toContain('javascript');
			expect(tagDisplays).toContain('testing');
			expect(tagDisplays).toContain('typescript');

			// JavaScript tag should have count of 2
			const jsTag = tags.find((t) => t.display === 'javascript');
			expect(jsTag).toBeDefined();
			if (jsTag) expect(jsTag.count).toBe(2);
		});

		it('should handle entries with no tags', async () => {
			const post = createMockRawEntry({
				title: 'Post',
				tags: []
			});

			mockService = new MockContentService({ post: [post] });
			setContentService(mockService);

			const [, tags] = await requestPosts();

			expect(tags).toHaveLength(1); // Only 'All' tag
			const allTag = expectSingle(tags, 'tag');
			expect(allTag.display).toBe('All');
			expect(allTag.count).toBe(1);
		});
	});

	describe('Edge cases', () => {
		it('should handle empty entry arrays', async () => {
			mockService = new MockContentService({
				post: [],
				project: [],
				uses: []
			});
			setContentService(mockService);

			const [posts] = await requestPosts();
			const [projects] = await requestProjects();
			const [uses] = await requestUses();

			expect(posts).toHaveLength(0);
			expect(projects).toHaveLength(0);
			expect(uses).toHaveLength(0);
		});

		it('should handle mixed valid and invalid entries', async () => {
			const validPost = createMockRawEntry({ title: 'Valid Post' });
			const invalidPost1 = createMockRawEntry({ title: '' });
			const invalidPost2 = createMockRawEntry({ title: 'Invalid', description: '' });

			mockService = new MockContentService({ post: [validPost, invalidPost1, invalidPost2] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(expectSingle(posts, 'post').title).toBe('Valid Post');
		});
	});
});
