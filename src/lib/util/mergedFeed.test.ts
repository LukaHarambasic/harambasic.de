import { describe, it, expect } from 'vitest';
import { getMergedFeedEntries } from './mergedFeed';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { WorkEntry } from '$lib/types/workEntry';
import { getDate } from './entries';

function createPost(overrides?: Partial<Post>): Post {
	return {
		type: 'post',
		title: 'Post A',
		description: 'Desc',
		image: '',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-01-15'),
		slug: 'post-a',
		relativePath: '/posts/post-a',
		fullPath: 'https://example.com/posts/post-a',
		tldr: '',
		discussion: '',
		toc: [],
		html: '',
		...overrides
	};
}

function createProject(overrides?: Partial<Project>): Project {
	return {
		type: 'project',
		title: 'Project B',
		description: 'Desc',
		image: '',
		imageAlt: '',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-02-01'),
		slug: 'project-b',
		relativePath: '/projects/project-b',
		fullPath: 'https://example.com/projects/project-b',
		links: [],
		prio: 0,
		status: 'active',
		html: '',
		...overrides
	};
}

function createUses(overrides?: Partial<UsesEntry>): UsesEntry {
	return {
		type: 'uses',
		title: 'Uses C',
		description: 'Desc',
		image: '',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-03-01'),
		slug: 'uses-c',
		relativePath: '/uses/uses-c',
		fullPath: 'https://example.com/uses/uses-c',
		url: 'https://external.com/tool',
		status: 'active',
		openSource: false,
		...overrides
	};
}

function createWork(overrides?: Partial<WorkEntry>): WorkEntry {
	return {
		type: 'work',
		title: 'Work D',
		description: 'Desc',
		image: '',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-01-10'),
		slug: 'work-d',
		relativePath: '/work/work-d',
		fullPath: 'https://example.com/work/work-d',
		location: 'Copenhagen',
		positions: [],
		html: '',
		...overrides
	};
}

describe('getMergedFeedEntries', () => {
	it('should merge all entry types and sort by updated date descending', () => {
		const posts = [createPost()];
		const projects = [createProject()];
		const uses = [createUses()];
		const work = [createWork()];

		const result = getMergedFeedEntries(posts, projects, uses, work);

		expect(result).toHaveLength(4);
		expect(result[0]?.category).toBe('Uses');
		expect(result[0]?.title).toBe('Uses C');
		expect(result[1]?.category).toBe('Projects');
		expect(result[2]?.category).toBe('Posts');
		expect(result[3]?.category).toBe('Work');
	});

	it('should set href and isExternal correctly for Uses with external url', () => {
		const uses = [createUses({ url: 'https://github.com/repo' })];
		const result = getMergedFeedEntries([], [], uses, []);

		expect(result[0]?.href).toBe('https://github.com/repo');
		expect(result[0]?.isExternal).toBe(true);
	});

	it('should set href and isExternal correctly for Uses with relative path', () => {
		const uses = [createUses({ url: '/uses/some-tool' })];
		const result = getMergedFeedEntries([], [], uses, []);

		expect(result[0]?.href).toBe('/uses/some-tool');
		expect(result[0]?.isExternal).toBe(false);
	});

	it('should set isExternal to false for Posts, Projects, Work', () => {
		const posts = [createPost()];
		const projects = [createProject()];
		const work = [createWork()];
		const result = getMergedFeedEntries(posts, projects, [], work);

		expect(result.every((e) => !e.isExternal)).toBe(true);
		expect(result.find((e) => e.category === 'Posts')?.href).toBe('/posts/post-a');
		expect(result.find((e) => e.category === 'Projects')?.href).toBe('/projects/project-b');
		expect(result.find((e) => e.category === 'Work')?.href).toBe('/work/work-d');
	});

	it('should fallback to published when updated is missing', () => {
		const post = createPost({
			updated: { raw: new Date(0), display: '' }
		});
		const result = getMergedFeedEntries([post], [], [], []);

		expect(result[0]?.updated.raw.getTime()).toBe(0);
	});
});
