import { describe, it, expect } from 'vitest';
import { generateMergedXml, generateXml, options } from './rss.server';
import type { MergedRssEntry } from './rss.server';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
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

function createMockMergedEntry(overrides?: Partial<MergedRssEntry>): MergedRssEntry {
	return {
		title: 'Test Entry',
		description: 'A test description',
		slug: 'test-entry',
		published: getDate('2024-01-01'),
		relativePath: '/posts/test-entry',
		category: 'Posts',
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
			expect(xml).toContain(
				'<guid isPermaLink="true">https://harambasic.de/posts/my-test-post</guid>'
			);
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
			expect(xml).toContain(
				'<guid isPermaLink="true">https://harambasic.de/projects/my-test-project</guid>'
			);
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
			expect(xml).toContain(
				'<guid isPermaLink="true">https://harambasic.de/uses/my-test-uses</guid>'
			);
			expect(xml).toContain('<title>My Test Uses</title>');
			expect(xml).toContain('<link>https://harambasic.de/uses/my-test-uses</link>');
		});

		it('should handle multiple entries', () => {
			const post1 = createMockPost({ title: 'Post 1', slug: 'post-1' });
			const post2 = createMockPost({ title: 'Post 2', slug: 'post-2' });
			const xml = generateXml([post1, post2], 'post');

			expect(xml).toContain('<guid isPermaLink="true">https://harambasic.de/posts/post-1</guid>');
			expect(xml).toContain('<guid isPermaLink="true">https://harambasic.de/posts/post-2</guid>');
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
				const dateStr = pubDateMatch[1];
				if (dateStr) expect(new Date(dateStr).getTime()).toBeGreaterThan(0);
			}
		});

		it('should include atom:link with https and correct href', () => {
			const post = createMockPost();
			const xml = generateXml([post], 'post');

			expect(xml).toContain(
				'<atom:link href="https://harambasic.de/posts/rss" rel="self" type="application/rss+xml" />'
			);
		});

		it('should start with XML declaration', () => {
			const post = createMockPost();
			const xml = generateXml([post], 'post');

			expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		});

		it('should include lastBuildDate in channel', () => {
			const post = createMockPost();
			const xml = generateXml([post], 'post');

			expect(xml).toContain('<lastBuildDate>');
			const match = xml.match(/<lastBuildDate>(.*?)<\/lastBuildDate>/);
			expect(match).toBeTruthy();
			if (match) {
				const dateStr = match[1];
				if (dateStr) expect(new Date(dateStr).getTime()).toBeGreaterThan(0);
			}
		});

		it('should include guid with isPermaLink="true"', () => {
			const post = createMockPost({ slug: 'my-post' });
			const xml = generateXml([post], 'post');

			expect(xml).toContain('isPermaLink="true"');
			expect(xml).toContain('<guid isPermaLink="true">https://harambasic.de/posts/my-post</guid>');
		});

		it('should include content:encoded with CDATA when entry has html', () => {
			const post = createMockPost({ html: '<p>Content</p>' });
			const xml = generateXml([post], 'post');

			expect(xml).toContain('<content:encoded>');
			expect(xml).toContain('<![CDATA[');
			expect(xml).toContain('<p>Content</p>');
			expect(xml).toContain(']]></content:encoded>');
		});

		it('should not include content:encoded when entry has no html', () => {
			const uses = createMockUsesEntry();
			const xml = generateXml([uses], 'uses');

			expect(xml).not.toContain('<content:encoded>');
		});

		it('should declare content namespace on rss root', () => {
			const post = createMockPost();
			const xml = generateXml([post], 'post');

			expect(xml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
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
		});
	});

	describe('options', () => {
		it('should have correct headers', () => {
			expect(options.headers['Content-Type']).toBe('application/xml; charset=UTF-8');
			expect(options.headers['Cache-Control']).toBe('max-age=0, s-max-age=600');
		});
	});

	describe('generateMergedXml', () => {
		it('should start with XML declaration', () => {
			const entry = createMockMergedEntry();
			const xml = generateMergedXml([entry]);

			expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		});

		it('should contain RSS and namespaces', () => {
			const entry = createMockMergedEntry();
			const xml = generateMergedXml([entry]);

			expect(xml).toContain('<rss version="2.0"');
			expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
			expect(xml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
		});

		it('should include atom:link with https and /rss path', () => {
			const entry = createMockMergedEntry();
			const xml = generateMergedXml([entry]);

			expect(xml).toContain(
				'<atom:link href="https://harambasic.de/rss" rel="self" type="application/rss+xml" />'
			);
		});

		it('should include lastBuildDate in channel', () => {
			const entry = createMockMergedEntry();
			const xml = generateMergedXml([entry]);

			expect(xml).toContain('<lastBuildDate>');
			const match = xml.match(/<lastBuildDate>(.*?)<\/lastBuildDate>/);
			expect(match).toBeTruthy();
			if (match) {
				const dateStr = match[1];
				if (dateStr) expect(new Date(dateStr).getTime()).toBeGreaterThan(0);
			}
		});

		it('should include channel metadata', () => {
			const entry = createMockMergedEntry();
			const xml = generateMergedXml([entry]);

			expect(xml).toContain('<title>Luka Harambasic | All</title>');
			expect(xml).toContain('<link>https://harambasic.de</link>');
			expect(xml).toContain('All posts, projects, uses, and work in one feed, ordered by date.');
		});

		it('should include guid with isPermaLink="true" and full item URL', () => {
			const entry = createMockMergedEntry({
				slug: 'my-post',
				relativePath: '/posts/my-post'
			});
			const xml = generateMergedXml([entry]);

			expect(xml).toContain('isPermaLink="true"');
			expect(xml).toContain('<guid isPermaLink="true">https://harambasic.de/posts/my-post</guid>');
		});

		it('should include category per item', () => {
			const post = createMockMergedEntry({
				title: 'Post Title',
				category: 'Posts',
				relativePath: '/posts/post-title'
			});
			const project = createMockMergedEntry({
				title: 'Project Title',
				category: 'Projects',
				relativePath: '/projects/project-title'
			});
			const uses = createMockMergedEntry({
				title: 'Uses Title',
				category: 'Uses',
				relativePath: '/uses/uses-title'
			});
			const work = createMockMergedEntry({
				title: 'Work Title',
				category: 'Work',
				relativePath: '/work/work-title'
			});
			const xml = generateMergedXml([post, project, uses, work]);

			expect(xml).toContain('<category>Posts</category>');
			expect(xml).toContain('<category>Projects</category>');
			expect(xml).toContain('<category>Uses</category>');
			expect(xml).toContain('<category>Work</category>');
		});

		it('should include content:encoded with CDATA when entry has html', () => {
			const entry = createMockMergedEntry({ html: '<p>Body</p>' });
			const xml = generateMergedXml([entry]);

			expect(xml).toContain('<content:encoded>');
			expect(xml).toContain('<![CDATA[');
			expect(xml).toContain('<p>Body</p>');
			expect(xml).toContain(']]></content:encoded>');
		});

		it('should not include content:encoded when entry has no html', () => {
			const entry = createMockMergedEntry();
			const xml = generateMergedXml([entry]);

			expect(xml).not.toContain('<content:encoded>');
		});

		it('should not include content:encoded when entry has empty html', () => {
			const entry = createMockMergedEntry({ html: '' });
			const xml = generateMergedXml([entry]);

			expect(xml).not.toContain('<content:encoded>');
		});

		it('should handle empty entries array', () => {
			const xml = generateMergedXml([]);

			expect(xml).toContain('<rss version="2.0"');
			expect(xml).toContain('<channel>');
			expect(xml).not.toContain('<item>');
		});

		it('should include multiple items with title, link, and category', () => {
			const post = createMockMergedEntry({
				title: 'First Post',
				slug: 'first-post',
				relativePath: '/posts/first-post',
				category: 'Posts'
			});
			const project = createMockMergedEntry({
				title: 'Second Project',
				slug: 'second-project',
				relativePath: '/projects/second-project',
				category: 'Projects'
			});
			const xml = generateMergedXml([post, project]);

			expect(xml).toContain('<title>First Post</title>');
			expect(xml).toContain('<link>https://harambasic.de/posts/first-post</link>');
			expect(xml).toContain('<category>Posts</category>');
			expect(xml).toContain('<title>Second Project</title>');
			expect(xml).toContain('<link>https://harambasic.de/projects/second-project</link>');
			expect(xml).toContain('<category>Projects</category>');
		});

		it('should escape XML special characters in title and description', () => {
			const entry = createMockMergedEntry({
				title: 'Title with <tags> & "quotes"',
				description: 'Description with & and <brackets>'
			});
			const xml = generateMergedXml([entry]);

			expect(xml).toContain('<title>Title with &lt;tags&gt; &amp; &quot;quotes&quot;</title>');
			expect(xml).toContain(
				'<description>Description with &amp; and &lt;brackets&gt;</description>'
			);
		});
	});
});
