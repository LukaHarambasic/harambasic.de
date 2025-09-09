import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';

/**
 * Minimal ContentService interface for repository dependency
 * This is a simplified version pending full implementation in issue #196
 */
export interface ContentService {
	getEntries(entryType: EntryType): Promise<RawEntry[]>;
	getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null>;
}
