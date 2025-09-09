import type { BaseEntry } from './entry';

export interface TocNode {
	depth: number;
	slug: string;
	value: string;
	children?: TocNode[] | [];
}

export interface Post extends BaseEntry {
	toc: TocNode[];
	tldr: string;
	discussion: string;
	html: string; // type html?
}
