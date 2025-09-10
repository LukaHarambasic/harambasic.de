import type { BaseEntry } from './entry';

export interface Snippet extends BaseEntry {
	html: string;
	// No toc field - snippets are simple
}
