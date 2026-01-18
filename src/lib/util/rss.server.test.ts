import { describe, it, expect } from 'vitest';
import { generateXml, options } from './rss.server';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { Snippet } from '$lib/types/snippet';
import { getDate } from './entries';

function createMockPost(overrides?: Partial<Post>): Post {
	return {
		type: 'post',
		title: 'Test Post',
		description: 'A test post description',
		image: 'test.jpg',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-01-02'),
		slug: 'test-post',
		relativePath: '/posts/test-post',
		fullPath: 'https://harambasic.de/posts/test-post',
		tldr: '',
		discussion: '',
		toc: [],
		html: '<p>Content</p>',
		...overrides
	};
}

function createMockProject(overrides?: Partial<Project>): Project {
	return {
		type: 'project',
		title: 'Test Project',
		description: 'A test project description',
		image: 'test.jpg',
		imageAlt: '',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-01-02'),
		slug: 'test-project',
		relativePath: '/projects/test-project',
		fullPath: 'https://harambasic.de/projects/test-project',
		links: [],
		prio: 0,
		status: 'active',
		html: '<p>Content</p>',
		...overrides
	};
}

function createMockUsesEntry(overrides?: Partial<UsesEntry>): UsesEntry {
	return {
		type: 'uses',
		title: 'Test Uses',
		description: 'A test uses description',
		image: 'test.jpg',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-01-02'),
		slug: 'test-uses',
		relativePath: '/uses/test-uses',
		fullPath: 'https://harambasic.de/uses/test-uses',
		url: '',
		status: 'active',
		openSource: false,
		...overrides
	};
}

function createMockSnippet(overrides?: Partial<Snippet>): Snippet {
	return {
		type: 'snippet',
		title: 'Test Snippet',
		description: 'A test snippet description',
		image: 'test.jpg',
		tags: [],
		published: getDate('2024-01-01'),
		updated: getDate('2024-01-02'),
		slug: 'test-snippet',
		relativePath: '/snippets/test-snippet',
		fullPath: 'https://harambasic.de/snippets/test-snippet',
		html: '<p>Content</p>',
		...overrides
	};
}

describe('RSS XML Generation', () => {
	describe('generateXml', () => {
		it('should generate valid RSS XML for posts', () => {
			const post = createMockPost({
				title: 'My Test Post',
				description: 'This is a test description',
				slug: 'my-test-post'
			});
			const xml = generateXml([post], 'post');

			expect(xml).toContain('<rss version="2.0"');
			expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
			expect(xml).toContain('<title>Luka Harambasic | Posts</title>');
			expect(xml).toContain('<link>https://harambasic.de</link>');
			expect(xml).toContain('My private playground');
			expect(xml).toContain('<item>');
			expect(xml).toContain('<guid>https://harambasic.de/posts/my-test-post</guid>');
			expect(xml).toContain('<title>My Test Post</title>');
			expect(xml).toContain('<link>https://harambasic.de/posts/my-test-post</link>');
			expect(xml).toContain('<description>This is a test description</description>');
			expect(xml).toContain('<pubDate>');
		});

		it('should generate valid RSS XML for projects', () => {
			const project = createMockProject({
				title: 'My Test Project',
				description: 'This is a project description',
				slug: 'my-test-project'
			});
			const xml = generateXml([project], 'project');

			expect(xml).toContain('<title>Luka Harambasic | Projects</title>');
			expect(xml).toContain('<guid>https://harambasic.de/projects/my-test-project</guid>');
			expect(xml).toContain('<title>My Test Project</title>');
			expect(xml).toContain('<link>https://harambasic.de/projects/my-test-project</link>');
		});

		it('should generate valid RSS XML for uses', () => {
			const uses = createMockUsesEntry({
				title: 'My Test Uses',
				description: 'This is a uses description',
				slug: 'my-test-uses'
			});
			const xml = generateXml([uses], 'uses');

			expect(xml).toContain('<title>Luka Harambasic | Uses</title>');
			expect(xml).toContain('<guid>https://harambasic.de/uses/my-test-uses</guid>');
			expect(xml).toContain('<title>My Test Uses</title>');
			expect(xml).toContain('<link>https://harambasic.de/uses/my-test-uses</link>');
		});

		it('should generate valid RSS XML for snippets', () => {
			const snippet = createMockSnippet({
				title: 'My Test Snippet',
				description: 'This is a snippet description',
				slug: 'my-test-snippet'
			});
			const xml = generateXml([snippet], 'snippet');

			expect(xml).toContain('<title>Luka Harambasic | Snippets</title>');
			expect(xml).toContain('<guid>https://harambasic.de/snippets/my-test-snippet</guid>');
			expect(xml).toContain('<title>My Test Snippet</title>');
			expect(xml).toContain('<link>https://harambasic.de/snippets/my-test-snippet</link>');
		});

		it('should handle multiple entries', () => {
			const post1 = createMockPost({ title: 'Post 1', slug: 'post-1' });
			const post2 = createMockPost({ title: 'Post 2', slug: 'post-2' });
			const xml = generateXml([post1, post2], 'post');

			expect(xml).toContain('<guid>https://harambasic.de/posts/post-1</guid>');
			expect(xml).toContain('<guid>https://harambasic.de/posts/post-2</guid>');
			expect(xml).toContain('<title>Post 1</title>');
			expect(xml).toContain('<title>Post 2</title>');
		});

		it('should handle empty entries array', () => {
			const xml = generateXml([], 'post');

			expect(xml).toContain('<rss version="2.0"');
			expect(xml).toContain('<channel>');
			expect(xml).not.toContain('<item>');
		});

		it('should escape XML special characters in title', () => {
			const post = createMockPost({
				title: 'Post with <tags> & "quotes"',
				slug: 'test'
			});
			const xml = generateXml([post], 'post');

			expect(xml).toContain('<title>Post with &lt;tags&gt; &amp; &quot;quotes&quot;</title>');
			expect(xml).not.toContain('<tags>');
			expect(xml).not.toContain(' & ');
			expect(xml).toContain(' &amp; ');
		});

		it('should escape XML special characters in description', () => {
			const post = createMockPost({
				description: 'Description with <tags> & "quotes"',
				slug: 'test'
			});
			const xml = generateXml([post], 'post');

			expect(xml).toContain(
				'<description>Description with &lt;tags&gt; &amp; &quot;quotes&quot;</description>'
			);
		});

		it('should format pubDate correctly', () => {
			const post = createMockPost({
				published: getDate('2024-01-15'),
				slug: 'test'
			});
			const xml = generateXml([post], 'post');

			expect(xml).toContain('<pubDate>');
			const pubDateMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/);
			expect(pubDateMatch).toBeTruthy();
			if (pubDateMatch) {
				const date = new Date(pubDateMatch[1]);
				expect(date.getTime()).toBeGreaterThan(0);
			}
		});

		it('should include atom:link with correct href', () => {
			const post = createMockPost();
			const xml = generateXml([post], 'post');

			expect(xml).toContain(
				'<atom:link href="http://harambasic.de/posts/rss" rel="self" type="application/rss+xml" />'
			);
		});

		it('should include correct description for each entry type', () => {
			const post = createMockPost();
			const postXml = generateXml([post], 'post');
			expect(postXml).toContain('stay up to date with my posts');

			const project = createMockProject();
			const projectXml = generateXml([project], 'project');
			expect(projectXml).toContain('stay up to date with my projects');

			const uses = createMockUsesEntry();
			const usesXml = generateXml([uses], 'uses');
			expect(usesXml).toContain('stay up to date with my uses');

			const snippet = createMockSnippet();
			const snippetXml = generateXml([snippet], 'snippet');
			expect(snippetXml).toContain('stay up to date with my snippets');
		});
	});

	describe('options', () => {
		it('should have correct headers', () => {
			expect(options.headers['Content-Type']).toBe('application/xml');
			expect(options.headers['Cache-Control']).toBe('max-age=0, s-max-age=600');
		});
	});
});
