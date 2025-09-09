import type { RawEntry } from '$lib/types/entry';
import type { PostSortProperty, SortDirection, EntryType } from '$lib/types/enums';
import type { ContentService } from '$lib/services/ContentService';
import type { PostRepository } from '../PostRepository';
import { FileSystemContentRepository } from './FileSystemContentRepository';
import { sortAlphabetical, sortDate } from '$lib/util/helper';

/**
 * FileSystem implementation of PostRepository
 * Implements post-specific query operations
 */
export class FileSystemPostRepository
	extends FileSystemContentRepository
	implements PostRepository
{
	protected readonly entryType: EntryType = 'post';

	constructor(contentService: ContentService) {
		super(contentService);
	}

	async findPublishedAfter(date: Date): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => {
			const publishedDate = new Date(entry.meta.published);
			return publishedDate > date;
		});
	}

	async findByDiscussion(hasDiscussion: boolean): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => {
			const discussion = entry.meta.discussion;
			return hasDiscussion ? !!(discussion && discussion.length > 0) : !discussion;
		});
	}

	async findWithTldr(): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return entries.filter((entry) => entry.meta.tldr && entry.meta.tldr.length > 0);
	}

	async findByTagSorted(
		tagSlug: string,
		sortBy: PostSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]> {
		const entries = await this.findByTag(tagSlug);
		return this.sortEntries(entries, sortBy, direction);
	}

	async findAllSorted(sortBy: PostSortProperty, direction: SortDirection): Promise<RawEntry[]> {
		const entries = await this.findAll();
		return this.sortEntries(entries, sortBy, direction);
	}

	async findRelatedPosts(post: RawEntry, limit: number = 5): Promise<RawEntry[]> {
		const allPosts = await this.findAll();
		return allPosts
			.filter((p) => p.meta.title !== post.meta.title)
			.filter((p) => this.hasCommonTags(p, post))
			.sort((a, b) => this.calculateSimilarity(b, post) - this.calculateSimilarity(a, post))
			.slice(0, limit);
	}

	private sortEntries(
		entries: RawEntry[],
		sortBy: PostSortProperty,
		direction: SortDirection
	): RawEntry[] {
		const sorted = entries.sort((a, b) => this.sortByProperty(a, b, sortBy));
		return direction === 'DESC' ? sorted : sorted.reverse();
	}

	private sortByProperty(a: RawEntry, b: RawEntry, property: PostSortProperty): number {
		switch (property) {
			case 'title':
				return sortAlphabetical(b.meta.title, a.meta.title);
			case 'published':
				return sortDate(new Date(b.meta.published), new Date(a.meta.published));
			case 'updated':
				return sortDate(new Date(b.meta.updated), new Date(a.meta.updated));
			default:
				return 0;
		}
	}
}
