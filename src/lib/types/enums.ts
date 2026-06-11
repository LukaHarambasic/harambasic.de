export type EntryType = 'post' | 'uses' | 'experience';

// Sort direction constants and types
export const SORT_DIRECTIONS = ['ASC', 'DESC'] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];
export const SortDirection = {
	Desc: 'DESC' as const,
	Asc: 'ASC' as const
};

export enum TagSortProperty {
	Title = 'TITLE',
	Count = 'COUNT'
}

// Sort property constants
export const BASE_SORT_PROPERTIES = ['title', 'published', 'updated'] as const;

// Base sort properties
type BaseSortProperty = 'title' | 'published' | 'updated';

// Specific types with extensions
export type PostSortProperty = BaseSortProperty;
export type UsesEntrySortProperty = BaseSortProperty;
export type ExperienceEntrySortProperty = BaseSortProperty;

// Centralized default configuration
export const SORT_DEFAULTS = {
	POST: 'published' as const,
	USES_ENTRY: 'published' as const,
	EXPERIENCE_ENTRY: 'published' as const
} as const;

// Single status type for all content
export type ContentStatus = 'active' | 'inactive' | 'all';

// Alias for specific content types (for backward compatibility)
export type UsesEntryStatus = ContentStatus;
