import type { BaseEntry } from './entry';
import type { UsesEntryStatus } from './enums';

export interface UsesEntry extends BaseEntry {
	url: string;
	status: UsesEntryStatus;
	openSource: boolean;
}
