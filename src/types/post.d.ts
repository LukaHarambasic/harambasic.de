import { AstroComponentFactory } from 'astro/dist/runtime/server/render';
import type { Category } from './category';

export interface Post {
	title: string;
	description: string;
	publishDate: Date;
	categories: Category[];
	tldr: string;
	discussion: string;
	Content: AstroComponentFactory;
	file: string;
}