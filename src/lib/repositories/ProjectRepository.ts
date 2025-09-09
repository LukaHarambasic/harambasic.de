import type { RawEntry } from '$lib/types/entry';
import type { ProjectSortProperty, SortDirection, ContentStatus } from '$lib/types/enums';
import type { ContentRepository } from './ContentRepository';

/**
 * Repository interface for Project content
 * Extends base repository with project-specific operations
 */
export interface ProjectRepository extends ContentRepository<RawEntry> {
	// Project-specific queries
	findByOpenSource(isOpenSource: boolean): Promise<RawEntry[]>;
	findByPriority(minPriority: number): Promise<RawEntry[]>;
	findWithLinks(): Promise<RawEntry[]>;

	// Combined filtering and sorting
	findFilteredAndSorted(
		tagSlug: string,
		status: ContentStatus,
		sortBy: ProjectSortProperty,
		direction: SortDirection
	): Promise<RawEntry[]>;

	findAllSorted(sortBy: ProjectSortProperty, direction: SortDirection): Promise<RawEntry[]>;

	// Priority-based queries
	findHighPriorityProjects(limit?: number): Promise<RawEntry[]>;
}
