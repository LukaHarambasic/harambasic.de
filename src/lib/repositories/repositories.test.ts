import { expect, test, describe, beforeEach } from 'vitest';
import type { RawEntry } from '$lib/types/entry';
import type { ContentService } from '$lib/services/ContentService';
import { FileSystemPostRepository } from './impl/FileSystemPostRepository';
import { FileSystemProjectRepository } from './impl/FileSystemProjectRepository';
import { FileSystemUsesRepository } from './impl/FileSystemUsesRepository';
import { FileSystemShareableRepository } from './impl/FileSystemShareableRepository';
import { RepositoryFactory } from './RepositoryFactory';

// Mock data for testing
const mockPostEntry: RawEntry = {
	html: '<h1>Test Post</h1><p>Content here</p>',
	meta: {
		title: 'Test Post Title',
		description: 'Test post description',
		image: '/test-image.jpg',
		tags: ['typescript', 'testing'],
		published: '2024-01-01',
		updated: '2024-01-02',
		tldr: 'Test TLDR',
		discussion: 'https://example.com/discussion'
	},
	toc: []
};

const mockProjectEntry: RawEntry = {
	html: '<h1>Test Project</h1><p>Project content</p>',
	meta: {
		title: 'Test Project Title',
		description: 'Test project description',
		image: '/project-image.jpg',
		tags: ['svelte', 'typescript'],
		published: '2024-01-01',
		updated: '2024-01-02',
		status: 'active',
		prio: 5,
		openSource: true,
		links: [{ text: 'GitHub', url: 'https://github.com/test/repo' }]
	},
	toc: []
};

const mockUsesEntry: RawEntry = {
	html: '<h1>VS Code</h1><p>Editor description</p>',
	meta: {
		title: 'VS Code',
		description: 'Code editor',
		image: '/vscode.png',
		tags: ['editor', 'development'],
		published: '2024-01-01',
		updated: '2024-01-02',
		status: 'active'
	},
	toc: []
};

const mockShareableEntry: RawEntry = {
	html: '<h1>Interesting Article</h1><p>Shared content</p>',
	meta: {
		title: 'Interesting Article',
		description: 'Worth sharing',
		image: '/article.jpg',
		tags: ['web', 'design'],
		published: '2024-01-01',
		updated: '2024-01-02',
		url: 'https://example.com/article'
	},
	toc: []
};

// Mock ContentService
class MockContentService implements ContentService {
	private mockData = {
		post: [mockPostEntry],
		project: [mockProjectEntry],
		uses: [mockUsesEntry],
		shareable: [mockShareableEntry]
	};

	async getEntries(entryType: string): Promise<RawEntry[]> {
		return this.mockData[entryType as keyof typeof this.mockData] || [];
	}

	async getEntry(entryType: string, slug: string): Promise<RawEntry | null> {
		const entries = await this.getEntries(entryType);
		return (
			entries.find((entry) => entry.meta.title.toLowerCase().replace(/\s+/g, '-') === slug) || null
		);
	}
}

describe('PostRepository', () => {
	let repository: FileSystemPostRepository;
	let mockService: MockContentService;

	beforeEach(() => {
		mockService = new MockContentService();
		repository = new FileSystemPostRepository(mockService);
	});

	test('findAll should return all posts', async () => {
		const posts = await repository.findAll();
		expect(posts).toHaveLength(1);
		expect(posts[0].meta.title).toBe('Test Post Title');
	});

	test('findBySlug should return correct post', async () => {
		const post = await repository.findBySlug('test-post-title');
		expect(post).toBeTruthy();
		expect(post!.meta.title).toBe('Test Post Title');
	});

	test('findBySlug should return null for non-existent post', async () => {
		const post = await repository.findBySlug('non-existent');
		expect(post).toBeNull();
	});

	test('findByTag should filter by tag slug', async () => {
		const posts = await repository.findByTag('typescript');
		expect(posts).toHaveLength(1);
		expect(posts[0].meta.tags).toContain('typescript');
	});

	test('findByDiscussion should filter by discussion presence', async () => {
		const withDiscussion = await repository.findByDiscussion(true);
		expect(withDiscussion).toHaveLength(1);

		const withoutDiscussion = await repository.findByDiscussion(false);
		expect(withoutDiscussion).toHaveLength(0);
	});

	test('findWithTldr should return posts with TLDR', async () => {
		const postsWithTldr = await repository.findWithTldr();
		expect(postsWithTldr).toHaveLength(1);
		expect(postsWithTldr[0].meta.tldr).toBe('Test TLDR');
	});

	test('findAllSorted should sort posts correctly', async () => {
		const posts = await repository.findAllSorted('title', 'ASC');
		expect(posts).toHaveLength(1);
		expect(posts[0].meta.title).toBe('Test Post Title');
	});

	test('exists should check post existence', async () => {
		const exists = await repository.exists('test-post-title');
		expect(exists).toBe(true);

		const notExists = await repository.exists('non-existent');
		expect(notExists).toBe(false);
	});

	test('count should return correct number', async () => {
		const count = await repository.count();
		expect(count).toBe(1);
	});
});

describe('ProjectRepository', () => {
	let repository: FileSystemProjectRepository;
	let mockService: MockContentService;

	beforeEach(() => {
		mockService = new MockContentService();
		repository = new FileSystemProjectRepository(mockService);
	});

	test('findAll should return all projects', async () => {
		const projects = await repository.findAll();
		expect(projects).toHaveLength(1);
		expect(projects[0].meta.title).toBe('Test Project Title');
	});

	test('findByOpenSource should filter by open source status', async () => {
		const openSource = await repository.findByOpenSource(true);
		expect(openSource).toHaveLength(1);
		expect(openSource[0].meta.openSource).toBe(true);
	});

	test('findByPriority should filter by minimum priority', async () => {
		const highPriority = await repository.findByPriority(3);
		expect(highPriority).toHaveLength(1);
		expect(highPriority[0].meta.prio).toBeGreaterThanOrEqual(3);

		const veryHighPriority = await repository.findByPriority(10);
		expect(veryHighPriority).toHaveLength(0);
	});

	test('findWithLinks should return projects with links', async () => {
		const withLinks = await repository.findWithLinks();
		expect(withLinks).toHaveLength(1);
		expect(withLinks[0].meta.links).toBeTruthy();
	});

	test('findHighPriorityProjects should return sorted by priority', async () => {
		const highPriority = await repository.findHighPriorityProjects(5);
		expect(highPriority).toHaveLength(1);
		expect(highPriority[0].meta.prio).toBeGreaterThan(0);
	});

	test('findFilteredAndSorted should apply filters and sorting', async () => {
		const filtered = await repository.findFilteredAndSorted('', 'active', 'priority', 'DESC');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].meta.status).toBe('active');
	});
});

describe('UsesRepository', () => {
	let repository: FileSystemUsesRepository;
	let mockService: MockContentService;

	beforeEach(() => {
		mockService = new MockContentService();
		repository = new FileSystemUsesRepository(mockService);
	});

	test('findAll should return all uses entries', async () => {
		const uses = await repository.findAll();
		expect(uses).toHaveLength(1);
		expect(uses[0].meta.title).toBe('VS Code');
	});

	test('findRecommended should return active entries', async () => {
		const recommended = await repository.findRecommended();
		expect(recommended).toHaveLength(1);
		expect(recommended[0].meta.status).toBe('active');
	});

	test('findByCategory should filter by category tag', async () => {
		const editors = await repository.findByCategory('editor');
		expect(editors).toHaveLength(1);
		expect(editors[0].meta.tags).toContain('editor');
	});

	test('findFilteredAndSorted should apply filters and sorting', async () => {
		const filtered = await repository.findFilteredAndSorted('', 'active', 'title', 'ASC');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].meta.status).toBe('active');
	});
});

describe('ShareableRepository', () => {
	let repository: FileSystemShareableRepository;
	let mockService: MockContentService;

	beforeEach(() => {
		mockService = new MockContentService();
		repository = new FileSystemShareableRepository(mockService);
	});

	test('findAll should return all shareable entries', async () => {
		const shareables = await repository.findAll();
		expect(shareables).toHaveLength(1);
		expect(shareables[0].meta.title).toBe('Interesting Article');
	});

	test('findByUrl should filter by URL content', async () => {
		const byUrl = await repository.findByUrl('example.com');
		expect(byUrl).toHaveLength(1);
		expect(byUrl[0].meta.url).toContain('example.com');
	});

	test('findWithUrls should return entries with URLs', async () => {
		const withUrls = await repository.findWithUrls();
		expect(withUrls).toHaveLength(1);
		expect(withUrls[0].meta.url).toBeTruthy();
	});

	test('findByTagSorted should filter and sort by tag', async () => {
		const tagged = await repository.findByTagSorted('web', 'title', 'ASC');
		expect(tagged).toHaveLength(1);
		expect(tagged[0].meta.tags).toContain('web');
	});
});

describe('RepositoryFactory', () => {
	test('createPostRepository should return PostRepository instance', () => {
		const repository = RepositoryFactory.createPostRepository();
		expect(repository).toBeInstanceOf(FileSystemPostRepository);
	});

	test('createProjectRepository should return ProjectRepository instance', () => {
		const repository = RepositoryFactory.createProjectRepository();
		expect(repository).toBeInstanceOf(FileSystemProjectRepository);
	});

	test('createUsesRepository should return UsesRepository instance', () => {
		const repository = RepositoryFactory.createUsesRepository();
		expect(repository).toBeInstanceOf(FileSystemUsesRepository);
	});

	test('createShareableRepository should return ShareableRepository instance', () => {
		const repository = RepositoryFactory.createShareableRepository();
		expect(repository).toBeInstanceOf(FileSystemShareableRepository);
	});

	test('should use provided ContentService', () => {
		const mockService = new MockContentService();
		const repository = RepositoryFactory.createPostRepository(mockService);
		expect(repository).toBeInstanceOf(FileSystemPostRepository);
	});

	test('resetContentService should clear singleton', () => {
		RepositoryFactory.getContentService(); // Create singleton
		RepositoryFactory.resetContentService();
		// Should create a new service on next call
		const service = RepositoryFactory.getContentService();
		expect(service).toBeTruthy();
	});
});
