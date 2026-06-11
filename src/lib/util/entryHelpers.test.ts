import { describe, it, expect } from 'vitest';
import { SortDirection } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { UsesEntry } from '$lib/types/usesEntry';
import { filterByStatus, sortByProperty, filterAndSort } from './entryHelpers';

const createMockPost = (overrides: Partial<Post> = {}): Post => ({
	type: 'post',
	title: 'Test Post',
	description: 'A test post',
	image: '',
	tags: [],
	published: { raw: new Date('2024-01-01'), display: '2024-01-01' },
	updated: { raw: new Date('2024-01-01'), display: '2024-01-01' },
	slug: 'test-post',
	relativePath: '/posts/test-post',
	fullPath: 'https://harambasic.de/posts/test-post',
	tldr: '',
	discussion: '',
	toc: [],
	html: '',
	...overrides
});

const createMockUsesEntry = (overrides: Partial<UsesEntry> = {}): UsesEntry => ({
	type: 'uses',
	title: 'Test Uses',
	description: 'A test uses entry',
	image: '',
	tags: [],
	published: { raw: new Date('2024-01-01'), display: '2024-01-01' },
	updated: { raw: new Date('2024-01-01'), display: '2024-01-01' },
	slug: 'test-uses',
	relativePath: '/uses/test-uses',
	fullPath: 'https://harambasic.de/uses/test-uses',
	url: '',
	status: 'active',
	openSource: false,
	...overrides
});

describe('Entry Helpers', () => {
	describe('filterByStatus', () => {
		it('should return true when filterStatus is "all"', () => {
			const entry = createMockUsesEntry({ status: 'active' });
			expect(filterByStatus(entry, 'all')).toBe(true);
		});

		it('should filter by status correctly for active', () => {
			const activeEntry = createMockUsesEntry({ status: 'active' });
			const inactiveEntry = createMockUsesEntry({ status: 'inactive' });
			expect(filterByStatus(activeEntry, 'active')).toBe(true);
			expect(filterByStatus(inactiveEntry, 'active')).toBe(false);
		});

		it('should filter by status correctly for inactive', () => {
			const activeEntry = createMockUsesEntry({ status: 'active' });
			const inactiveEntry = createMockUsesEntry({ status: 'inactive' });
			expect(filterByStatus(activeEntry, 'inactive')).toBe(false);
			expect(filterByStatus(inactiveEntry, 'inactive')).toBe(true);
		});
	});

	describe('sortByProperty', () => {
		describe('title sorting', () => {
			it('should sort by title correctly (alphabetical)', () => {
				const postA = createMockPost({ title: 'Alpha' });
				const postB = createMockPost({ title: 'Beta' });
				expect(sortByProperty(postA, postB, 'title')).toBeLessThan(0);
				expect(sortByProperty(postB, postA, 'title')).toBeGreaterThan(0);
			});

			it('should work with all entry types', () => {
				const usesA = createMockUsesEntry({ title: 'Alpha' });
				const usesB = createMockUsesEntry({ title: 'Beta' });
				expect(sortByProperty(usesA, usesB, 'title')).toBeLessThan(0);
			});
		});

		describe('published date sorting', () => {
			it('should sort by published date correctly (older first)', () => {
				const postA = createMockPost({
					published: { raw: new Date('2024-01-01'), display: '2024-01-01' }
				});
				const postB = createMockPost({
					published: { raw: new Date('2024-02-01'), display: '2024-02-01' }
				});
				expect(sortByProperty(postA, postB, 'published')).toBeLessThan(0);
				expect(sortByProperty(postB, postA, 'published')).toBeGreaterThan(0);
			});
		});

		describe('updated date sorting', () => {
			it('should sort by updated date correctly (older first)', () => {
				const postA = createMockPost({
					updated: { raw: new Date('2024-01-01'), display: '2024-01-01' }
				});
				const postB = createMockPost({
					updated: { raw: new Date('2024-02-01'), display: '2024-02-01' }
				});
				expect(sortByProperty(postA, postB, 'updated')).toBeLessThan(0);
				expect(sortByProperty(postB, postA, 'updated')).toBeGreaterThan(0);
			});
		});

		it('should return 0 for invalid property', () => {
			const postA = createMockPost();
			const postB = createMockPost();
			expect(sortByProperty(postA, postB, 'invalid' as 'title' | 'published' | 'updated')).toBe(0);
		});
	});

	describe('filterAndSort', () => {
		const mockPosts: Post[] = [
			createMockPost({
				title: 'Alpha Post',
				published: { raw: new Date('2024-01-01'), display: '2024-01-01' },
				tags: [
					{
						display: 'JavaScript',
						slug: 'javascript',
						relativePath: '/posts?tag=javascript',
						count: 0,
						type: 'post'
					}
				]
			}),
			createMockPost({
				title: 'Beta Post',
				published: { raw: new Date('2024-02-01'), display: '2024-02-01' },
				tags: [
					{
						display: 'Python',
						slug: 'python',
						relativePath: '/posts?tag=python',
						count: 0,
						type: 'post'
					}
				]
			}),
			createMockPost({
				title: 'Gamma Post',
				published: { raw: new Date('2024-03-01'), display: '2024-03-01' },
				tags: [
					{
						display: 'JavaScript',
						slug: 'javascript',
						relativePath: '/posts?tag=javascript',
						count: 0,
						type: 'post'
					}
				]
			})
		];

		const mockUsesEntries: UsesEntry[] = [
			createMockUsesEntry({
				title: 'Alpha Tool',
				status: 'active',
				published: { raw: new Date('2024-01-01'), display: '2024-01-01' },
				tags: [
					{
						display: 'JavaScript',
						slug: 'javascript',
						relativePath: '/uses?tag=javascript',
						count: 0,
						type: 'uses'
					}
				]
			}),
			createMockUsesEntry({
				title: 'Beta Tool',
				status: 'inactive',
				published: { raw: new Date('2024-02-01'), display: '2024-02-01' },
				tags: [
					{
						display: 'Python',
						slug: 'python',
						relativePath: '/uses?tag=python',
						count: 0,
						type: 'uses'
					}
				]
			}),
			createMockUsesEntry({
				title: 'Gamma Tool',
				status: 'active',
				published: { raw: new Date('2024-03-01'), display: '2024-03-01' },
				tags: [
					{
						display: 'JavaScript',
						slug: 'javascript',
						relativePath: '/uses?tag=javascript',
						count: 0,
						type: 'uses'
					}
				]
			})
		];

		describe('filtering by tag', () => {
			it('should filter by tag slug correctly', () => {
				const result = filterAndSort(mockPosts, {
					filterTagSlug: 'javascript',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(2);
				expect(result.every((p) => p.tags.some((t) => t.slug === 'javascript'))).toBe(true);
			});

			it('should return all entries when filterTagSlug is "all"', () => {
				const result = filterAndSort(mockPosts, {
					filterTagSlug: 'all',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(3);
			});

			it('should return empty array when no matches', () => {
				const result = filterAndSort(mockPosts, {
					filterTagSlug: 'nonexistent',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(0);
			});
		});

		describe('filtering by status', () => {
			it('should filter by status correctly', () => {
				const result = filterAndSort(mockUsesEntries, {
					filterStatus: 'active',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(2);
				expect(result.every((u) => u.status === 'active')).toBe(true);
			});

			it('should return all entries when filterStatus is "all"', () => {
				const result = filterAndSort(mockUsesEntries, {
					filterStatus: 'all',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(3);
			});

			it('should not filter entries without status field', () => {
				const result = filterAndSort(mockPosts, {
					filterStatus: 'active',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(3);
			});
		});

		describe('sorting', () => {
			it('should sort by title in ascending order', () => {
				const result = filterAndSort(mockPosts, {
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(3);
				expect(result[0]?.title).toBe('Alpha Post');
				expect(result[1]?.title).toBe('Beta Post');
				expect(result[2]?.title).toBe('Gamma Post');
			});

			it('should sort by title in descending order', () => {
				const result = filterAndSort(mockPosts, {
					sortProperty: 'title',
					sortDirection: SortDirection.Desc
				});
				expect(result).toHaveLength(3);
				expect(result[0]?.title).toBe('Gamma Post');
				expect(result[1]?.title).toBe('Beta Post');
				expect(result[2]?.title).toBe('Alpha Post');
			});

			it('should sort by published date in ascending order', () => {
				const result = filterAndSort(mockPosts, {
					sortProperty: 'published',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(3);
				expect(result[0]?.title).toBe('Alpha Post');
				expect(result[1]?.title).toBe('Beta Post');
				expect(result[2]?.title).toBe('Gamma Post');
			});

			it('should sort by published date in descending order', () => {
				const result = filterAndSort(mockPosts, {
					sortProperty: 'published',
					sortDirection: SortDirection.Desc
				});
				expect(result).toHaveLength(3);
				expect(result[0]?.title).toBe('Gamma Post');
				expect(result[1]?.title).toBe('Beta Post');
				expect(result[2]?.title).toBe('Alpha Post');
			});
		});

		describe('combined filtering and sorting', () => {
			it('should combine tag filter and sorting', () => {
				const result = filterAndSort(mockPosts, {
					filterTagSlug: 'javascript',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(2);
				expect(result[0]?.title).toBe('Alpha Post');
				expect(result[1]?.title).toBe('Gamma Post');
			});

			it('should combine tag filter, status filter, and sorting', () => {
				const result = filterAndSort(mockUsesEntries, {
					filterTagSlug: 'javascript',
					filterStatus: 'active',
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toHaveLength(2);
				expect(result.every((u) => u.status === 'active')).toBe(true);
				expect(result.every((u) => u.tags.some((t) => t.slug === 'javascript'))).toBe(true);
			});
		});

		describe('edge cases', () => {
			it('should handle empty array', () => {
				const result = filterAndSort([], {
					sortProperty: 'title',
					sortDirection: SortDirection.Asc
				});
				expect(result).toEqual([]);
			});
		});

		describe('overloaded function signatures with positional parameters', () => {
			it('should work with Posts using positional parameters', () => {
				const result = filterAndSort(mockPosts, 'javascript', 'title', SortDirection.Asc);
				expect(result).toHaveLength(2);
				expect(result[0]?.title).toBe('Alpha Post');
				expect(result[1]?.title).toBe('Gamma Post');
			});

			it('should work with UsesEntries using positional parameters with status filter', () => {
				const usesEntries: UsesEntry[] = [
					createMockUsesEntry({ title: 'Active Use', status: 'active' }),
					createMockUsesEntry({ title: 'Inactive Use', status: 'inactive' }),
					createMockUsesEntry({ title: 'Another Active', status: 'active' })
				];
				const result = filterAndSort(usesEntries, 'all', 'active', 'title', SortDirection.Asc);
				expect(result).toHaveLength(2);
				expect(result.every((u) => u.status === 'active')).toBe(true);
				expect(result[0]?.title).toBe('Active Use');
			});
		});
	});
});
