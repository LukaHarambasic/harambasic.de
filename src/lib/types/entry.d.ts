import {
	ContentStatus,
	EntryType,
	PostSortProperty,
	ProjectSortProperty,
	ShareableSortProperty,
	UsesEntrySortProperty
} from './enums';
import type { Tag } from './tag';
import type { Link } from './generic';
import type { TocNode } from './post';

// Frontmatter metadata structure
export interface RawEntryMeta {
	title: string;
	description: string;
	image: string;
	tags: string[];
	published: string;
	updated: string;
	url?: string;
	status?: ContentStatus;
	openSource?: boolean;
	tldr?: string;
	discussion?: string;
	links?: Link[];
	prio?: number;
	imageAlt?: string;
}

// Raw entry structure with nested meta
export interface RawEntry {
	// Content
	html: string;
	meta: RawEntryMeta;
	toc: TocNode[];
}

export interface EntryDate {
	raw: Date;
	display: string;
}

/**
 * Base processed entry interface that serves as the foundation for all content types.
 *
 * This interface represents the core structure after raw content has been processed,
 * with computed fields like slug and paths, and transformed data like parsed dates and tags.
 *
 * @interface BaseEntry
 * @property {EntryType} type - The type of content (post, project, uses, shareable)
 * @property {string} slug - URL-friendly version of the title
 * @property {string} relativePath - Relative path for routing (e.g., "/posts/my-post")
 * @property {string} fullPath - Complete URL including domain
 * @property {string} title - Content title
 * @property {string} description - Content description/summary
 * @property {string} image - Main image URL or path
 * @property {Tag[]} tags - Processed tag objects with metadata
 * @property {EntryDate} published - Parsed publication date with display format
 * @property {EntryDate} updated - Parsed update date with display format
 */
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

export type StatusFilter = ContentStatus;

// Re-export ContentStatus for compatibility
export type { ContentStatus };
