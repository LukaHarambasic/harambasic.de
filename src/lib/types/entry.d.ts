import {
	EntryType,
	PostSortProperty,
	ProjectSortProperty,
	ProjectStatus,
	ShareableSortProperty,
	UsesEntrySortProperty,
	UsesEntryStatus
} from './enums';
import type { Tag } from './tag';
import type { Link } from './generic';
import type { TocNode } from './post';

// Flattened raw entry structure - no nested meta
export interface RawEntry {
	// Content
	html: string;
	toc: TocNode[];

	// Frontmatter (flattened, no nested meta)
	title: string;
	description: string;
	image: string;
	tags: string[];
	published: string;
	updated: string;

	// Optional fields
	url?: string;
	status?: ContentStatus;
	openSource?: boolean;
	tldr?: string;
	discussion?: string;
	links?: Link[];
	prio?: number;
	imageAlt?: string;
}

export interface EntryDate {
	raw: Date;
	display: string;
}

// Base processed entry interface
export interface BaseEntry {
	type: EntryType;
	slug: string;
	relativePath: string;
	fullPath: string;
	title: string;
	description: string;
	image: string;
	tags: Tag[];
	published: EntryDate;
	updated: EntryDate;
}

// Legacy Entry interface for backward compatibility - maps to BaseEntry
export type Entry = BaseEntry;

export type SortProperty =
	| PostSortProperty
	| ProjectSortProperty
	| UsesEntrySortProperty
	| ShareableSortProperty;

export type ContentStatus = ProjectStatus | UsesEntryStatus;

// Legacy type alias for backward compatibility
export type StatusFilter = ContentStatus;
