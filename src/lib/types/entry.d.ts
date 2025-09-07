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

export interface RawEntry {
	html: string;
	meta: RawEntryMeta;
	toc: TocNode[];
}

export interface RawEntryMeta {
	title: string;
	description: string;
	image: string;
	tags: string[];
	published: string;
	updated: string;
	url?: string;
	status?: StatusFilter;
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

export interface Entry {
	type: EntryType;
	title: string;
	description: string;
	image: string;
	tags: Tag[];
	published: EntryDate;
	updated: EntryDate;
	slug: string;
	relativePath: string;
	fullPath: string;
}

export type SortProperty =
	| PostSortProperty
	| ProjectSortProperty
	| UsesEntrySortProperty
	| ShareableSortProperty;

export type StatusFilter = ProjectStatus | UsesEntryStatus;
