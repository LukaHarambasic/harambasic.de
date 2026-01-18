import type { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { Shareable } from '$lib/types/shareable';
import type { Tag } from '$lib/types/tag';
import type { RawEntry } from '$lib/types/entry';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { transformEntry } from '$lib/util/entryTransformer';
import { ENTRY_CONFIGS } from './entryConfigs';

// Type map for better type inference
type EntryTypeMap = {
	post: Post;
	project: Project;
	uses: UsesEntry;
	shareable: Shareable;
};

/**
 * Generic function to get entries of any type.
 * Transforms raw entries using the transformer and returns entries with tags.
 */
async function getEntries<T extends EntryType>(entryType: T): Promise<[EntryTypeMap[T][], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries(entryType);
	const config = ENTRY_CONFIGS[entryType];

	// Transform entries - handle null returns for posts
	const entries = rawEntries
		.map((raw: RawEntry) => {
			try {
				// For posts, validate basic fields before transformation
				if (entryType === 'post' && (!raw || !raw.title || !raw.description)) {
					console.warn(`Invalid ${entryType} entry:`, raw);
					return null;
				}

				return transformEntry(raw, config);
			} catch (error) {
				// For posts, return null on error (will be filtered)
				if (entryType === 'post') {
					console.error(`Error processing ${entryType} entry:`, raw, error);
					return null;
				}
				// For projects and uses, let validation errors throw
				throw error;
			}
		})
		.filter((entry): entry is EntryTypeMap[T] => entry != null);

	const tags = getUniqueTags(entries as Post[] | Project[] | UsesEntry[] | Shareable[]);
	return [entries, tags];
}

/**
 * Get posts with tags.
 * Filters out invalid entries (returns null for invalid posts).
 */
export async function requestPosts(): Promise<[Post[], Tag[]]> {
	return getEntries('post');
}

/**
 * Get projects with tags.
 * Throws on validation errors (strict validation).
 */
export async function requestProjects(): Promise<[Project[], Tag[]]> {
	return getEntries('project');
}

/**
 * Get uses entries with tags.
 * Throws on validation errors (strict validation).
 */
export async function requestUses(): Promise<[UsesEntry[], Tag[]]> {
	return getEntries('uses');
}

/**
 * Get shareables with tags.
 * Handles missing directory gracefully (returns empty arrays).
 */
export async function requestShareables(): Promise<[Shareable[], Tag[]]> {
	try {
		return await getEntries('shareable');
	} catch {
		// Handle missing shareables directory gracefully - return empty arrays
		console.warn('Shareables directory not found, returning empty arrays');
		return [[], []];
	}
}
