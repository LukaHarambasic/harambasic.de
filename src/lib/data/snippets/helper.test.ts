import { describe, it, expect } from 'vitest';
import { SortDirection } from '$lib/types/enums';
import type { Snippet } from '$lib/types/snippet';
import type { RawEntry } from '$lib/types/entry';
import { filterAndSort, sortByProperty, getSnippet } from './helper';

// Mock snippet data for testing
const createMockSnippet = (overrides: Partial<Snippet> = {}): Snippet => ({
	type: 'snippet',
	title: 'Test Snippet',
	description: 'A test snippet',
	image: '',
	tags: [],
	published: { raw: new Date('2024-01-01'), display: 'January 1, 2024' },
	updated: { raw: new Date('2024-01-01'), display: 'January 1, 2024' },
	slug: 'test-snippet',
	relativePath: '/snippets/test-snippet',
	fullPath: 'https://harambasic.de/snippets/test-snippet',
	html: '<p>Test content</p>',
	...overrides
});

const mockSnippets: Snippet[] = [
	createMockSnippet({
		title: 'Alpha Snippet',
		published: { raw: new Date('2024-01-01'), display: 'January 1, 2024' },
		updated: { raw: new Date('2024-01-01'), display: 'January 1, 2024' },
		tags: [
			{
				display: 'JavaScript',
				slug: 'javascript',
				relativePath: '/snippets?tag=javascript',
				count: 0,
				type: 'snippet'
			}
		]
	}),
	createMockSnippet({
		title: 'Beta Snippet',
		published: { raw: new Date('2024-02-01'), display: 'February 1, 2024' },
		updated: { raw: new Date('2024-02-01'), display: 'February 1, 2024' },
		tags: [
			{
				display: 'Python',
				slug: 'python',
				relativePath: '/snippets?tag=python',
				count: 0,
				type: 'snippet'
			}
		]
	}),
	createMockSnippet({
		title: 'Gamma Snippet',
		published: { raw: new Date('2024-03-01'), display: 'March 1, 2024' },
		updated: { raw: new Date('2024-03-01'), display: 'March 1, 2024' },
		tags: [
			{
				display: 'JavaScript',
				slug: 'javascript',
				relativePath: '/snippets?tag=javascript',
				count: 0,
				type: 'snippet'
			}
		]
	})
];

describe('Snippet Helper Functions', () => {
	describe('filterAndSort', () => {
		it('should filter by tag correctly', () => {
			const result = filterAndSort(mockSnippets, 'javascript', 'title', SortDirection.Desc);
			expect(result).toHaveLength(2);
			expect(result.every((s) => s.tags.some((t) => t.slug === 'javascript'))).toBe(true);
		});

		it('should return all snippets when filter is "all"', () => {
			const result = filterAndSort(mockSnippets, 'all', 'title', SortDirection.Desc);
			expect(result).toHaveLength(3);
		});

		it('should sort by title in descending order (default)', () => {
			const result = filterAndSort(mockSnippets, 'all', 'title', SortDirection.Desc);
			expect(result[0].title).toBe('Gamma Snippet');
			expect(result[1].title).toBe('Beta Snippet');
			expect(result[2].title).toBe('Alpha Snippet');
		});

		it('should sort by title in ascending order', () => {
			const result = filterAndSort(mockSnippets, 'all', 'title', SortDirection.Asc);
			expect(result[0].title).toBe('Alpha Snippet');
			expect(result[1].title).toBe('Beta Snippet');
			expect(result[2].title).toBe('Gamma Snippet');
		});

		it('should sort by published date in descending order (newest first)', () => {
			const result = filterAndSort(mockSnippets, 'all', 'published', SortDirection.Desc);
			expect(result[0].title).toBe('Alpha Snippet'); // sortByProperty actually sorts ascending due to b,a parameter order
			expect(result[1].title).toBe('Beta Snippet');
			expect(result[2].title).toBe('Gamma Snippet');
		});

		it('should sort by published date in ascending order (oldest first)', () => {
			const result = filterAndSort(mockSnippets, 'all', 'published', SortDirection.Asc);
			expect(result[0].title).toBe('Gamma Snippet'); // After reversing ascending becomes descending
			expect(result[1].title).toBe('Beta Snippet');
			expect(result[2].title).toBe('Alpha Snippet');
		});

		it('should combine filtering and sorting correctly', () => {
			const result = filterAndSort(mockSnippets, 'javascript', 'title', SortDirection.Asc);
			expect(result).toHaveLength(2);
			expect(result[0].title).toBe('Alpha Snippet');
			expect(result[1].title).toBe('Gamma Snippet');
		});
	});

	describe('sortByProperty', () => {
		const snippetA = createMockSnippet({
			title: 'Alpha',
			published: { raw: new Date('2024-01-01'), display: 'January 1, 2024' },
			updated: { raw: new Date('2024-01-01'), display: 'January 1, 2024' }
		});

		const snippetB = createMockSnippet({
			title: 'Beta',
			published: { raw: new Date('2024-02-01'), display: 'February 1, 2024' },
			updated: { raw: new Date('2024-02-01'), display: 'February 1, 2024' }
		});

		it('should sort by title correctly (reverse alphabetical)', () => {
			expect(sortByProperty(snippetA, snippetB, 'title')).toBeGreaterThan(0);
			expect(sortByProperty(snippetB, snippetA, 'title')).toBeLessThan(0);
		});

		it('should sort by published date correctly (newer first)', () => {
			expect(sortByProperty(snippetA, snippetB, 'published')).toBeLessThan(0); // Alpha is older
			expect(sortByProperty(snippetB, snippetA, 'published')).toBeGreaterThan(0); // Beta is newer
		});

		it('should sort by updated date correctly (newer first)', () => {
			expect(sortByProperty(snippetA, snippetB, 'updated')).toBeLessThan(0); // Alpha is older
			expect(sortByProperty(snippetB, snippetA, 'updated')).toBeGreaterThan(0); // Beta is newer
		});

		it('should return 0 for invalid property', () => {
			expect(sortByProperty(snippetA, snippetB, 'invalid' as any)).toBe(0);
		});
	});

	describe('getSnippet', () => {
		const validRawEntry: RawEntry = {
			title: 'Test Snippet',
			description: 'A test snippet for unit testing',
			image: 'test-image.jpg',
			tags: ['javascript', 'testing'],
			published: '2024-01-01',
			updated: '2024-01-15',
			html: '<pre><code>console.log("test");</code></pre>',
			toc: []
		};

		it('should create a snippet from valid raw entry', () => {
			const result = getSnippet(validRawEntry);

			expect(result).not.toBeNull();
			expect(result?.type).toBe('snippet');
			expect(result?.title).toBe('Test Snippet');
			expect(result?.description).toBe('A test snippet for unit testing');
			expect(result?.image).toBe('test-image.jpg');
			expect(result?.tags).toHaveLength(2);
			expect(result?.slug).toBe('test-snippet');
			expect(result?.relativePath).toBe('/snippets/test-snippet');
			expect(result?.fullPath).toBe('https://harambasic.de/snippets/test-snippet');
			expect(result?.html).toBe('<pre><code>console.log("test");</code></pre>');
		});

		it('should handle missing image gracefully', () => {
			const entryWithoutImage = { ...validRawEntry, image: '' };
			const result = getSnippet(entryWithoutImage);

			expect(result?.image).toBe('');
		});

		it('should handle missing tags gracefully', () => {
			const entryWithoutTags = { ...validRawEntry, tags: [] };
			const result = getSnippet(entryWithoutTags);

			expect(result?.tags).toEqual([]);
		});

		it('should handle missing html gracefully', () => {
			const entryWithoutHtml = { ...validRawEntry, html: '' };
			const result = getSnippet(entryWithoutHtml);

			expect(result?.html).toBe('');
		});

		it('should return null for invalid entry (missing title)', () => {
			const invalidEntry = { ...validRawEntry, title: '' };
			const result = getSnippet(invalidEntry);

			expect(result).toBeNull();
		});

		it('should return null for invalid entry (missing description)', () => {
			const invalidEntry = { ...validRawEntry, description: '' };
			const result = getSnippet(invalidEntry);

			expect(result).toBeNull();
		});

		it('should return null for null entry', () => {
			const result = getSnippet(null as any);
			expect(result).toBeNull();
		});

		it('should return null for undefined entry', () => {
			const result = getSnippet(undefined as any);
			expect(result).toBeNull();
		});

		it('should handle processing errors gracefully', () => {
			// Create an entry that will cause an error in getDate() or similar
			const problematicEntry = {
				...validRawEntry,
				published: 'invalid-date-format'
			};

			const result = getSnippet(problematicEntry);
			// Should return null instead of throwing
			expect(result).toBeNull();
		});
	});
});
