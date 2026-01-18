import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import type { ContentService } from '$lib/services';
import { ContentServiceError } from '$lib/services';
import { setContentService, resetContentService } from '$lib/services/serviceInstance';
import {
	requestPosts,
	requestProjects,
	requestUses,
	requestSnippets,
	requestShareables
} from './api.server';

/**
 * Mock ContentService implementation for testing
 */
class MockContentService implements ContentService {
	private mockData: Partial<Record<EntryType, RawEntry[]>>;
	private shouldThrowError: boolean = false;

	constructor(mockData: Partial<Record<EntryType, RawEntry[]>> = {}) {
		this.mockData = mockData;
	}

	setShouldThrowError(value: boolean): void {
		this.shouldThrowError = value;
	}

	async getEntries(entryType: EntryType): Promise<RawEntry[]> {
		if (this.shouldThrowError && entryType === 'shareable') {
			throw new ContentServiceError('Directory not found', entryType);
		}
		return this.mockData[entryType] || [];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getEntry(_entryType: EntryType, _slug: string): Promise<RawEntry | null> {
		return null;
	}

	async getEntryMetadata(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_entryType: EntryType,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_slug: string
	): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null> {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async validateContent(_entryType: EntryType) {
		return [];
	}

	async validateAllContent() {
		return {
			overall: { total: 0, passed: 0, failed: 0, successRate: 100 },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			byType: {} as Record<EntryType, any[]>,
			errors: []
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async validateEntryWithQuality(_entryType: EntryType, _slug: string) {
		return null;
	}
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

			expect(posts).toHaveLength(1);
			expect(posts[0].type).toBe('post');
			expect(posts[0].title).toBe('Test Post');
			expect(posts[0].tldr).toBe('TLDR text');
			expect(posts[0].discussion).toBe('Discussion link');
			expect(posts[0].html).toBe('<p>Test content</p>');
			expect(posts[0].slug).toBe('test-post');
			expect(posts[0].relativePath).toBe('/posts/test-post');
			expect(posts[0].fullPath).toBe('https://harambasic.de/posts/test-post');

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
			expect(tags[0].display).toBe('All');
			expect(tags[0].count).toBe(1);
		});

		it('should filter out invalid posts (missing title)', async () => {
			const validPost = createMockRawEntry({ title: 'Valid Post' });
			const invalidPost = createMockRawEntry({ title: '' });

			mockService = new MockContentService({ post: [validPost, invalidPost] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(posts).toHaveLength(1);
			expect(posts[0].title).toBe('Valid Post');
		});

		it('should filter out invalid posts (missing description)', async () => {
			const validPost = createMockRawEntry({ title: 'Valid Post', description: 'Description' });
			const invalidPost = createMockRawEntry({ title: 'Invalid Post', description: '' });

			mockService = new MockContentService({ post: [validPost, invalidPost] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(posts).toHaveLength(1);
			expect(posts[0].title).toBe('Valid Post');
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
			expect(tags[0].display).toBe('All');
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

			expect(projects).toHaveLength(1);
			expect(projects[0].type).toBe('project');
			expect(projects[0].title).toBe('Test Project');
			expect(projects[0].links).toHaveLength(1);
			expect(projects[0].prio).toBe(5);
			expect(projects[0].status).toBe('active');
			expect(projects[0].imageAlt).toBe('Alt text');
			expect(projects[0].slug).toBe('test-project');
			expect(projects[0].relativePath).toBe('/projects/test-project');

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
		});

		it('should throw error on missing published date', async () => {
			const invalidProject = createMockRawEntry({
				title: 'Invalid Project',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				published: undefined as any
			});

			mockService = new MockContentService({ project: [invalidProject] });
			setContentService(mockService);

			await expect(requestProjects()).rejects.toThrow(/Missing 'published' date/);
		});

		it('should throw error on missing updated date', async () => {
			const invalidProject = createMockRawEntry({
				title: 'Invalid Project',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				updated: undefined as any
			});

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

			expect(uses).toHaveLength(1);
			expect(uses[0].type).toBe('uses');
			expect(uses[0].title).toBe('Test Tool');
			expect(uses[0].url).toBe('https://example.com');
			expect(uses[0].status).toBe('active');
			expect(uses[0].openSource).toBe(true);
			expect(uses[0].slug).toBe('test-tool');
			expect(uses[0].relativePath).toBe('/uses/test-tool');

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

			expect(uses[0].url).toBe('');
			expect(uses[0].status).toBe('active');
			expect(uses[0].openSource).toBe(false);
		});
	});

	describe('requestSnippets', () => {
		it('should transform and return snippets with tags', async () => {
			const mockSnippet = createMockRawEntry({
				title: 'Test Snippet',
				description: 'A test snippet',
				html: '<p>Snippet content</p>'
			});

			mockService = new MockContentService({ snippet: [mockSnippet] });
			setContentService(mockService);

			const [snippets, tags] = await requestSnippets();

			expect(snippets).toHaveLength(1);
			expect(snippets[0].type).toBe('snippet');
			expect(snippets[0].title).toBe('Test Snippet');
			expect(snippets[0].html).toBe('<p>Snippet content</p>');
			expect(snippets[0].slug).toBe('test-snippet');
			expect(snippets[0].relativePath).toBe('/snippets/test-snippet');

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
		});

		it('should filter out invalid snippets (missing title)', async () => {
			const validSnippet = createMockRawEntry({ title: 'Valid Snippet' });
			const invalidSnippet = createMockRawEntry({ title: '' });

			mockService = new MockContentService({ snippet: [validSnippet, invalidSnippet] });
			setContentService(mockService);

			const [snippets] = await requestSnippets();

			expect(snippets).toHaveLength(1);
			expect(snippets[0].title).toBe('Valid Snippet');
		});

		it('should handle transformation errors gracefully', async () => {
			const invalidSnippet = createMockRawEntry({
				title: 'Invalid Snippet',
				published: 'invalid-date'
			});

			mockService = new MockContentService({ snippet: [invalidSnippet] });
			setContentService(mockService);

			const [snippets] = await requestSnippets();

			expect(snippets).toHaveLength(0);
		});
	});

	describe('requestShareables', () => {
		it('should transform and return shareables with tags', async () => {
			const mockShareable = createMockRawEntry({
				title: 'Test Shareable',
				description: 'A test shareable',
				url: 'https://example.com',
				tldr: 'Comment text'
			});

			mockService = new MockContentService({ shareable: [mockShareable] });
			setContentService(mockService);

			const [shareables, tags] = await requestShareables();

			expect(shareables).toHaveLength(1);
			expect(shareables[0].type).toBe('shareable');
			expect(shareables[0].title).toBe('Test Shareable');
			expect(shareables[0].url).toBe('https://example.com');
			expect(shareables[0].comment).toBe('Comment text');
			expect(shareables[0].slug).toBe('test-shareable');
			expect(shareables[0].relativePath).toBe('/shareables/test-shareable');
			// Shareable should not have image field
			expect('image' in shareables[0]).toBe(false);

			expect(tags).toHaveLength(3); // 'All' tag + 2 tags
		});

		it('should return empty arrays when directory is missing', async () => {
			mockService = new MockContentService();
			mockService.setShouldThrowError(true);
			setContentService(mockService);

			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const [shareables, tags] = await requestShareables();

			expect(shareables).toHaveLength(0);
			expect(tags).toHaveLength(0);
			expect(consoleSpy).toHaveBeenCalledWith(
				'Shareables directory not found, returning empty arrays'
			);

			consoleSpy.mockRestore();
		});

		it('should handle missing optional fields', async () => {
			const mockShareable = createMockRawEntry({
				title: 'Test Shareable',
				description: 'Description',
				url: undefined,
				tldr: undefined
			});

			mockService = new MockContentService({ shareable: [mockShareable] });
			setContentService(mockService);

			const [shareables] = await requestShareables();

			expect(shareables[0].url).toBe('');
			expect(shareables[0].comment).toBe('');
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
			expect(jsTag?.count).toBe(2);
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
			expect(tags[0].display).toBe('All');
			expect(tags[0].count).toBe(1);
		});
	});

	describe('Edge cases', () => {
		it('should handle empty entry arrays', async () => {
			mockService = new MockContentService({
				post: [],
				project: [],
				uses: [],
				snippet: [],
				shareable: []
			});
			setContentService(mockService);

			const [posts] = await requestPosts();
			const [projects] = await requestProjects();
			const [uses] = await requestUses();
			const [snippets] = await requestSnippets();
			const [shareables] = await requestShareables();

			expect(posts).toHaveLength(0);
			expect(projects).toHaveLength(0);
			expect(uses).toHaveLength(0);
			expect(snippets).toHaveLength(0);
			expect(shareables).toHaveLength(0);
		});

		it('should handle mixed valid and invalid entries', async () => {
			const validPost = createMockRawEntry({ title: 'Valid Post' });
			const invalidPost1 = createMockRawEntry({ title: '' });
			const invalidPost2 = createMockRawEntry({ title: 'Invalid', description: '' });

			mockService = new MockContentService({ post: [validPost, invalidPost1, invalidPost2] });
			setContentService(mockService);

			const [posts] = await requestPosts();

			expect(posts).toHaveLength(1);
			expect(posts[0].title).toBe('Valid Post');
		});
	});
});
