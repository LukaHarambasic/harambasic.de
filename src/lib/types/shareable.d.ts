import type { BaseEntry } from './entry';

export interface Shareable extends Omit<BaseEntry, 'image'> {
	url: string;
	comment: string;
}
