export enum EntryType {
	UsesEntry = 'USES_ENTRY',
	Shareable = 'SHAREABLE',
	Post = 'POST',
	Project = 'PROJECT'
}

export enum SortDirection {
	Desc = 'DESC',
	Asc = 'ASC'
}

export enum TagSortProperty {
	Title = 'TITLE',
	Count = 'COUNT'
}

// Base sort properties
type BaseSortProperty = 'title' | 'published' | 'updated';

// Specific types with extensions
export type PostSortProperty = BaseSortProperty;
export type ProjectSortProperty = BaseSortProperty | 'priority';
export type UsesEntrySortProperty = BaseSortProperty;
export type ShareableSortProperty = BaseSortProperty;

export enum ProjectStatus {
	All = 'ALL',
	Active = 'ACTIVE',
	Inactive = 'INACTIVE'
}

export enum UsesEntryStatus {
	All = 'ALL',
	Active = 'ACTIVE',
	Inactive = 'INACTIVE'
}
