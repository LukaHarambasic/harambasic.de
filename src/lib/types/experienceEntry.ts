import type { BaseEntry } from './entry';

export interface Position {
	title: string;
	startDate: string;
	endDate: string | null;
	content: string; // Markdown content that will be processed to HTML
	employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export interface ExperienceEntry extends BaseEntry {
	location: string;
	employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
	url?: string; // Card link override; falls back to the entry's detail page.
	positions: Position[];
	html: string; // Optional general company information from markdown body
}
