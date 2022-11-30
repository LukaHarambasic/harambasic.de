import { AstroComponentFactory } from 'astro/dist/runtime/server/render';

import { ProjectStatus } from './enums';
import { Filterable } from './generic';

export interface Link {
	display: string;
	href: string;
}

export type Responsibility = Filterable;

export interface Project {
	title: string;
	img: string;
	alt: string;
	prio: number;
	status: ProjectStatus;
	links: Link[];
	responsibilities: Responsibility[];
	Content: AstroComponentFactory;
	file: string;
	slug: string;
}
