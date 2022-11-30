import { AstroComponentFactory } from 'astro/dist/runtime/server/render';

import type { Category } from './category';
import { Filterable } from './generic';

export interface TocNode {
	depth: number;
	slug: string;
	text: string;
	children: TocNode[] | null;
}

export type Category = Filterable;

// TODO should have slug - is than file even needed?
export interface Post {
	title: string;
	description: string;
	publishDate: Date;
	publishDateFormatted: string;
	categories: Category[];
	tldr: string;
	discussion: string;
	Content: AstroComponentFactory;
	file: string;
	path: string;
	permalink: string;
	toc: TocNode[];
}