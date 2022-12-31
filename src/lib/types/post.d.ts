import type { Entry } from './entry';

export interface TocNode {
	depth: number;
	slug: string;
	text: string;
	children: TocNode[] | null;
}

export interface Post extends Entry {
	toc: TocNode[];
	tldr: string;
	discussion: string;
	html: string; // type html?
}
