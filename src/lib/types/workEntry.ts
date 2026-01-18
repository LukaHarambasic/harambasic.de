import type { BaseEntry } from './entry';

export interface Position {
	title: string;
	startDate: string;
	endDate: string | null;
	content: string; // Markdown content that will be processed to HTML
}

export interface WorkEntry extends BaseEntry {
	location: string;
	employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
	positions: Position[];
	relatedProjects?: string[];
	html: string; // Optional general company information from markdown body
}

