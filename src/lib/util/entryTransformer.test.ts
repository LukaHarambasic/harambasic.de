import { describe, it, expect } from 'vitest';
import type { RawEntry } from '$lib/types/entry';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { Shareable } from '$lib/types/shareable';
import type { Snippet } from '$lib/types/snippet';
import { getContentPath, createBaseEntryFields, transformEntry } from './entryTransformer';

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

describe('Entry Transformer', () => {
	describe('getContentPath', () => {
		it('should generate correct path for post type', () => {
			expect(getContentPath('post', 'test-post')).toBe('/posts/test-post');
		});

		it('should generate correct path for project type', () => {
			expect(getContentPath('project', 'test-project')).toBe('/projects/test-project');
		});

		it('should generate correct path for snippet type', () => {
			expect(getContentPath('snippet', 'test-snippet')).toBe('/snippets/test-snippet');
		});

		it('should generate correct path for shareable type', () => {
			expect(getContentPath('shareable', 'test-shareable')).toBe('/shareables/test-shareable');
		});

		it('should handle special case for uses type', () => {
			expect(getContentPath('uses', 'test-uses')).toBe('/uses/test-uses');
		});

		it('should handle slug with special characters', () => {
			expect(getContentPath('post', 'test-post-123')).toBe('/posts/test-post-123');
		});
	});

	describe('createBaseEntryFields', () => {
		it('should create base fields from valid raw entry', () => {
			const rawEntry = createMockRawEntry();
			const result = createBaseEntryFields(rawEntry, 'post');

			expect(result.type).toBe('post');
			expect(result.slug).toBe('test-entry');
			expect(result.relativePath).toBe('/posts/test-entry');
			expect(result.fullPath).toBe('https://harambasic.de/posts/test-entry');
			expect(result.title).toBe('Test Entry');
			expect(result.description).toBe('A test entry for unit testing purposes');
			expect(result.image).toBe('test-image.jpg');
			expect(result.tags).toHaveLength(2);
			expect(result.tags[0].display).toBe('javascript');
			expect(result.tags[0].type).toBe('post');
			expect(result.published.raw).toBeInstanceOf(Date);
			expect(result.updated.raw).toBeInstanceOf(Date);
		});

		it('should use default baseUrl when not provided', () => {
			const rawEntry = createMockRawEntry();
			const result = createBaseEntryFields(rawEntry, 'post');

			expect(result.fullPath).toBe('https://harambasic.de/posts/test-entry');
		});

		it('should use custom baseUrl when provided', () => {
			const rawEntry = createMockRawEntry();
			const result = createBaseEntryFields(rawEntry, 'post', 'https://example.com');

			expect(result.fullPath).toBe('https://example.com/posts/test-entry');
		});

		it('should handle empty image field', () => {
			const rawEntry = createMockRawEntry({ image: '' });
			const result = createBaseEntryFields(rawEntry, 'post');

			expect(result.image).toBe('');
		});

		it('should handle missing tags array', () => {
			const rawEntry = createMockRawEntry({ tags: [] });
			const result = createBaseEntryFields(rawEntry, 'post');

			expect(result.tags).toEqual([]);
		});

		it('should generate correct slug from title', () => {
			const rawEntry = createMockRawEntry({ title: 'My Awesome Post!' });
			const result = createBaseEntryFields(rawEntry, 'post');

			expect(result.slug).toBe('my-awesome-post');
		});

		it('should parse dates correctly', () => {
			const rawEntry = createMockRawEntry({
				published: '2024-01-01',
				updated: '2024-02-15'
			});
			const result = createBaseEntryFields(rawEntry, 'post');

			expect(result.published.raw).toEqual(new Date('2024-01-01'));
			expect(result.updated.raw).toEqual(new Date('2024-02-15'));
			expect(result.published.display).toBe('2024-01-01');
			expect(result.updated.display).toBe('2024-02-15');
		});

		it('should handle uses type with special path', () => {
			const rawEntry = createMockRawEntry();
			const result = createBaseEntryFields(rawEntry, 'uses');

			expect(result.type).toBe('uses');
			expect(result.relativePath).toBe('/uses/test-entry');
			expect(result.fullPath).toBe('https://harambasic.de/uses/test-entry');
		});
	});

	describe('transformEntry - Post', () => {
		it('should transform RawEntry to Post', () => {
			const rawEntry = createMockRawEntry({
				tldr: 'This is a TLDR',
				discussion: 'https://example.com/discussion',
				toc: [{ depth: 1, slug: 'heading', value: 'Heading' }]
			});

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.type).toBe('post');
			expect(post.title).toBe('Test Entry');
			expect(post.tldr).toBe('This is a TLDR');
			expect(post.discussion).toBe('https://example.com/discussion');
			expect(post.toc).toHaveLength(1);
			expect(post.html).toBe('<p>Test content</p>');
			expect(post.slug).toBe('test-entry');
			expect(post.relativePath).toBe('/posts/test-entry');
		});

		it('should handle missing optional Post fields', () => {
			const rawEntry = createMockRawEntry({
				tldr: undefined,
				discussion: undefined,
				toc: []
			});

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.tldr).toBe('');
			expect(post.discussion).toBe('');
			expect(post.toc).toEqual([]);
		});
	});

	describe('transformEntry - Project', () => {
		it('should transform RawEntry to Project', () => {
			const rawEntry = createMockRawEntry({
				links: [{ url: 'https://example.com', label: 'Example' }],
				prio: 500,
				status: 'active',
				imageAlt: 'Test image alt text'
			});

			const project = transformEntry<Project>(rawEntry, {
				entryType: 'project',
				transform: (base, raw) => ({
					...base,
					links: raw.links || [],
					prio: raw.prio || 0,
					status: (raw.status as Project['status']) || 'active',
					html: raw.html || '',
					imageAlt: raw.imageAlt || ''
				})
			});

			expect(project.type).toBe('project');
			expect(project.title).toBe('Test Entry');
			expect(project.links).toHaveLength(1);
			expect(project.prio).toBe(500);
			expect(project.status).toBe('active');
			expect(project.imageAlt).toBe('Test image alt text');
			expect(project.html).toBe('<p>Test content</p>');
			expect(project.relativePath).toBe('/projects/test-entry');
		});

		it('should handle missing optional Project fields', () => {
			const rawEntry = createMockRawEntry({
				links: undefined,
				prio: undefined,
				imageAlt: undefined
			});

			const project = transformEntry<Project>(rawEntry, {
				entryType: 'project',
				transform: (base, raw) => ({
					...base,
					links: raw.links || [],
					prio: raw.prio || 0,
					status: (raw.status as Project['status']) || 'active',
					html: raw.html || '',
					imageAlt: raw.imageAlt || ''
				})
			});

			expect(project.links).toEqual([]);
			expect(project.prio).toBe(0);
			expect(project.imageAlt).toBe('');
		});
	});

	describe('transformEntry - UsesEntry', () => {
		it('should transform RawEntry to UsesEntry', () => {
			const rawEntry = createMockRawEntry({
				url: 'https://example.com/tool',
				status: 'active',
				openSource: true
			});

			const usesEntry = transformEntry<UsesEntry>(rawEntry, {
				entryType: 'uses',
				transform: (base, raw) => ({
					...base,
					url: raw.url || '',
					status: (raw.status as UsesEntry['status']) || 'active',
					openSource: raw.openSource || false
				})
			});

			expect(usesEntry.type).toBe('uses');
			expect(usesEntry.title).toBe('Test Entry');
			expect(usesEntry.url).toBe('https://example.com/tool');
			expect(usesEntry.status).toBe('active');
			expect(usesEntry.openSource).toBe(true);
			expect(usesEntry.relativePath).toBe('/uses/test-entry');
		});

		it('should handle missing optional UsesEntry fields', () => {
			const rawEntry = createMockRawEntry({
				url: undefined,
				status: undefined,
				openSource: undefined
			});

			const usesEntry = transformEntry<UsesEntry>(rawEntry, {
				entryType: 'uses',
				transform: (base, raw) => ({
					...base,
					url: raw.url || '',
					status: (raw.status as UsesEntry['status']) || 'active',
					openSource: raw.openSource || false
				})
			});

			expect(usesEntry.url).toBe('');
			expect(usesEntry.status).toBe('active');
			expect(usesEntry.openSource).toBe(false);
		});
	});

	describe('transformEntry - Shareable', () => {
		it('should transform RawEntry to Shareable', () => {
			const rawEntry = createMockRawEntry({
				url: 'https://example.com/shareable',
				tldr: 'This is a comment'
			});

			const shareable = transformEntry<Shareable>(rawEntry, {
				entryType: 'shareable',
				transform: (base, raw) => {
					// Shareable extends Omit<BaseEntry, 'image'>, so we need to exclude image
					const { image, ...baseWithoutImage } = base;
					return {
						...baseWithoutImage,
						url: raw.url || '',
						comment: raw.tldr || ''
					};
				}
			});

			expect(shareable.type).toBe('shareable');
			expect(shareable.title).toBe('Test Entry');
			expect(shareable.url).toBe('https://example.com/shareable');
			expect(shareable.comment).toBe('This is a comment');
			// Shareable extends Omit<BaseEntry, 'image'>, so it should not have image
			expect('image' in shareable).toBe(false);
			expect(shareable.relativePath).toBe('/shareables/test-entry');
		});

		it('should handle missing optional Shareable fields', () => {
			const rawEntry = createMockRawEntry({
				url: undefined,
				tldr: undefined
			});

			const shareable = transformEntry<Shareable>(rawEntry, {
				entryType: 'shareable',
				transform: (base, raw) => {
					// Shareable extends Omit<BaseEntry, 'image'>, so we need to exclude image
					const { image, ...baseWithoutImage } = base;
					return {
						...baseWithoutImage,
						url: raw.url || '',
						comment: raw.tldr || ''
					};
				}
			});

			expect(shareable.url).toBe('');
			expect(shareable.comment).toBe('');
			// Verify image is not present
			expect('image' in shareable).toBe(false);
		});
	});

	describe('transformEntry - Snippet', () => {
		it('should transform RawEntry to Snippet', () => {
			const rawEntry = createMockRawEntry({
				html: '<pre><code>console.log("test");</code></pre>'
			});

			const snippet = transformEntry<Snippet>(rawEntry, {
				entryType: 'snippet',
				transform: (base, raw) => ({
					...base,
					html: raw.html || ''
				})
			});

			expect(snippet.type).toBe('snippet');
			expect(snippet.title).toBe('Test Entry');
			expect(snippet.html).toBe('<pre><code>console.log("test");</code></pre>');
			expect(snippet.relativePath).toBe('/snippets/test-entry');
		});

		it('should handle missing html field', () => {
			const rawEntry = createMockRawEntry({
				html: ''
			});

			const snippet = transformEntry<Snippet>(rawEntry, {
				entryType: 'snippet',
				transform: (base, raw) => ({
					...base,
					html: raw.html || ''
				})
			});

			expect(snippet.html).toBe('');
		});
	});

	describe('transformEntry - Validation', () => {
		it('should run validation function when provided', () => {
			const rawEntry = createMockRawEntry();
			let validationCalled = false;

			transformEntry<Post>(rawEntry, {
				entryType: 'post',
				validate: (raw) => {
					validationCalled = true;
					expect(raw.title).toBe('Test Entry');
				},
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(validationCalled).toBe(true);
		});

		it('should throw error when validation fails', () => {
			const rawEntry = createMockRawEntry({ title: '' });

			expect(() => {
				transformEntry<Post>(rawEntry, {
					entryType: 'post',
					validate: (raw) => {
						if (!raw.title) {
							throw new Error('Title is required');
						}
					},
					transform: (base, raw) => ({
						...base,
						tldr: raw.tldr || '',
						discussion: raw.discussion || '',
						toc: raw.toc || [],
						html: raw.html || ''
					})
				});
			}).toThrow('Title is required');
		});

		it('should not run validation when not provided', () => {
			const rawEntry = createMockRawEntry();

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post).toBeDefined();
		});
	});

	describe('transformEntry - Custom baseUrl', () => {
		it('should use custom baseUrl from config', () => {
			const rawEntry = createMockRawEntry();

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				baseUrl: 'https://example.com',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.fullPath).toBe('https://example.com/posts/test-entry');
		});

		it('should use default baseUrl when not provided in config', () => {
			const rawEntry = createMockRawEntry();

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.fullPath).toBe('https://harambasic.de/posts/test-entry');
		});
	});

	describe('transformEntry - Error Handling', () => {
		it('should throw error when date parsing fails', () => {
			const rawEntry = createMockRawEntry({
				published: 'invalid-date',
				updated: '2024-01-01'
			});

			expect(() => {
				transformEntry<Post>(rawEntry, {
					entryType: 'post',
					transform: (base, raw) => ({
						...base,
						tldr: raw.tldr || '',
						discussion: raw.discussion || '',
						toc: raw.toc || [],
						html: raw.html || ''
					})
				});
			}).toThrow();
		});

		it('should throw error when transform function throws', () => {
			const rawEntry = createMockRawEntry();

			expect(() => {
				transformEntry<Post>(rawEntry, {
					entryType: 'post',
					transform: () => {
						throw new Error('Transform error');
					}
				});
			}).toThrow('Transform error');
		});
	});

	describe('transformEntry - Edge Cases', () => {
		it('should handle entry with many tags', () => {
			const rawEntry = createMockRawEntry({
				tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
			});

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.tags).toHaveLength(5);
		});

		it('should handle entry with complex title', () => {
			const rawEntry = createMockRawEntry({
				title: 'My Awesome Post #1: How to Use TypeScript!'
			});

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.slug).toBe('my-awesome-post-1-how-to-use-typescript');
		});

		it('should handle entry with ISO datetime format', () => {
			const rawEntry = createMockRawEntry({
				published: '2024-01-01T00:00:00Z',
				updated: '2024-01-15T12:30:45Z'
			});

			const post = transformEntry<Post>(rawEntry, {
				entryType: 'post',
				transform: (base, raw) => ({
					...base,
					tldr: raw.tldr || '',
					discussion: raw.discussion || '',
					toc: raw.toc || [],
					html: raw.html || ''
				})
			});

			expect(post.published.raw).toBeInstanceOf(Date);
			expect(post.updated.raw).toBeInstanceOf(Date);
		});
	});
});

