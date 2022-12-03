import type { Entry } from './entry';
import { BookmarkStatus } from './enums';

export interface Bookmark extends Entry {
	url: string;
	status: BookmarkStatus;
	openSource: boolean;
}
