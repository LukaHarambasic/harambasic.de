export type EntryType = 'post' | 'project' | 'uses' | 'shareable' | 'snippet';

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
export const PROJECT_SORT_PROPERTIES = [...BASE_SORT_PROPERTIES, 'priority'] as const;

// Base sort properties
type BaseSortProperty = 'title' | 'published' | 'updated';

// Specific types with extensions
export type PostSortProperty = BaseSortProperty;
export type ProjectSortProperty = BaseSortProperty | 'priority';
export type UsesEntrySortProperty = BaseSortProperty;
export type ShareableSortProperty = BaseSortProperty;
export type SnippetSortProperty = BaseSortProperty;

// Centralized default configuration
export const SORT_DEFAULTS = {
	POST: 'published' as const,
	PROJECT: 'priority' as const,
	USES_ENTRY: 'published' as const,
	SHAREABLE: 'published' as const,
	SNIPPET: 'published' as const
} as const;

// Single status type for all content
export type ContentStatus = 'active' | 'inactive' | 'all';

// Aliases for specific content types (for backward compatibility)
export type ProjectStatus = ContentStatus;
export type UsesEntryStatus = ContentStatus;
