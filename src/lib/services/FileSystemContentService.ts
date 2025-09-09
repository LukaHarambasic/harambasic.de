import { getRawEntries } from '$lib/util/converter.server';
import { getSlug } from '$lib/util/helper';
import type { RawEntry } from '$lib/types/entry';
import type { EntryType } from '$lib/types/enums';
import type { ContentService } from './ContentService';

/**
 * FileSystem implementation of ContentService
 * Wraps the existing converter functionality until issue #196 is implemented
 */
export class FileSystemContentService implements ContentService {
	private cache = new Map<EntryType, RawEntry[]>();
	private lastCacheTime = new Map<EntryType, number>();
	private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes in development

	async getEntries(entryType: EntryType): Promise<RawEntry[]> {
		// Simple caching for development performance
		const now = Date.now();
		const lastCache = this.lastCacheTime.get(entryType) || 0;

		if (this.cache.has(entryType) && now - lastCache < this.cacheTimeout) {
			return this.cache.get(entryType)!;
		}

		const entries = await getRawEntries(entryType);
		this.cache.set(entryType, entries);
		this.lastCacheTime.set(entryType, now);
		return entries;
	}

	async getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null> {
		const entries = await this.getEntries(entryType);
		return entries.find((entry) => getSlug(entry.meta.title) === slug) || null;
	}

	clearCache(entryType?: EntryType): void {
		if (entryType) {
			this.cache.delete(entryType);
			this.lastCacheTime.delete(entryType);
		} else {
			this.cache.clear();
			this.lastCacheTime.clear();
		}
	}
}
