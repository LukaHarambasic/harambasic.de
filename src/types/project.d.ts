import { AstroComponentFactory } from 'astro/dist/runtime/server/render';

import { ProjectStatus } from './enums';

export interface Link {
	display: string;
	href: string;
}

export interface Project {
	title: string;
	img: string;
	alt: string;
	prio: number;
	status: ProjectStatus;
	links: Link[];
	responsibilities: string[];
	Content: AstroComponentFactory;
	file: string;
	slug: string;
}
