import type { BaseEntry } from './entry';

export interface ProjectEntry extends BaseEntry {
	status: 'active' | 'archived';
	role: string;
	url: string;
	github: string;
}
