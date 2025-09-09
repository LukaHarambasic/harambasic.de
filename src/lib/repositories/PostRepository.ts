import type { RawEntry } from '$lib/types/entry';
import type { PostSortProperty, SortDirection } from '$lib/types/enums';
import type { ContentRepository } from './ContentRepository';

/**
 * Repository interface for Post content
 * Extends base repository with post-specific operations
 */
export interface PostRepository extends ContentRepository<RawEntry> {
	// Post-specific queries
	findPublishedAfter(date: Date): Promise<RawEntry[]>;
	findByDiscussion(hasDiscussion: boolean): Promise<RawEntry[]>;
	findWithTldr(): Promise<RawEntry[]>;

	// Sorting and filtering operations
	findByTagSorted(
		tagSlug: string,
		sortBy: PostSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]>;

	findAllSorted(sortBy: PostSortProperty, direction: SortDirection): Promise<RawEntry[]>;

	// Related content
	findRelatedPosts(post: RawEntry, limit?: number): Promise<RawEntry[]>;
}
