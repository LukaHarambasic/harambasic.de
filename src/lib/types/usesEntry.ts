import type { Entry } from './entry';
import type { UsesEntryStatus } from './enums';

export interface UsesEntry extends Entry {
	url: string;
	status: UsesEntryStatus;
	openSource: boolean;
}
