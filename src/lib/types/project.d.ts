import type { Entry } from './entry';
import { ProjectStatus } from './enums';
import type { Link } from './generic';

export interface Project extends Entry {
	links: Link[];
	prio: number;
	status: ProjectStatus;
	html: string;
	imageAlt: string;
}
