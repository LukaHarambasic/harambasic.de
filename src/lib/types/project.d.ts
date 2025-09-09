import type { BaseEntry } from './entry';
import { ProjectStatus } from './enums';
import type { Link } from './generic';

export interface Project extends BaseEntry {
	links: Link[];
	prio: number;
	status: ProjectStatus;
	html: string;
	imageAlt: string;
}
