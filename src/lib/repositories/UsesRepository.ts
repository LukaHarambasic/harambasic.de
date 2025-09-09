import type { RawEntry } from '$lib/types/entry';
import type { UsesEntrySortProperty, SortDirection, ContentStatus } from '$lib/types/enums';
import type { ContentRepository } from './ContentRepository';

/**
 * Repository interface for Uses Entry content
 * Extends base repository with uses-specific operations
 */
export interface UsesRepository extends ContentRepository<RawEntry> {
	// Uses-specific queries
	findRecommended(): Promise<RawEntry[]>;
	findByCategory(category: string): Promise<RawEntry[]>;

	// Combined filtering and sorting
	findFilteredAndSorted(
		tagSlug: string,
		status: ContentStatus,
		sortBy: UsesEntrySortProperty,
		direction: SortDirection
	): Promise<RawEntry[]>;

	findAllSorted(sortBy: UsesEntrySortProperty, direction: SortDirection): Promise<RawEntry[]>;
}
