import type { RawEntry } from '$lib/types/entry';
import type { ShareableSortProperty, SortDirection } from '$lib/types/enums';
import type { ContentRepository } from './ContentRepository';

/**
 * Repository interface for Shareable content
 * Extends base repository with shareable-specific operations
 */
export interface ShareableRepository extends ContentRepository<RawEntry> {
	// Shareable-specific queries
	findByUrl(url: string): Promise<RawEntry[]>;
	findWithUrls(): Promise<RawEntry[]>;

	// Sorting operations
	findByTagSorted(
		tagSlug: string,
		sortBy: ShareableSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]>;

	findAllSorted(sortBy: ShareableSortProperty, direction: SortDirection): Promise<RawEntry[]>;
}
