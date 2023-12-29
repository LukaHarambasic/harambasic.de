import type { Entry } from './entry';

export interface TocNode {
	depth: number;
	slug: string;
	value: string;
	children?: TocNode[] | [];
}

export interface Post extends Entry {
	toc: TocNode[];
	tldr: string;
	discussion: string;
	html: string; // type html?
}
