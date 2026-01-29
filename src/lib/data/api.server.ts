import type { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { Shareable } from '$lib/types/shareable';
import type { WorkEntry } from '$lib/types/workEntry';
import type { Tag } from '$lib/types/tag';
import type { RawEntry } from '$lib/types/entry';
import { getContentService } from '$lib/services';
import { getUniqueTags } from '$lib/util/entries';
import { transformEntry } from '$lib/util/entryTransformer';
import { ENTRY_CONFIGS } from './entryConfigs';

type EntryTypeMap = {
	post: Post;
	project: Project;
	uses: UsesEntry;
	shareable: Shareable;
	work: WorkEntry;
};

async function getEntries<T extends EntryType>(entryType: T): Promise<[EntryTypeMap[T][], Tag[]]> {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries(entryType);
	const config = ENTRY_CONFIGS[entryType];

	const entries = rawEntries
		.map((raw: RawEntry) => {
			try {
				if (entryType === 'post' && (!raw || !raw.title || !raw.description)) {
					console.warn(`Invalid ${entryType} entry:`, raw);
					return null;
				}

				return transformEntry(raw, config);
			} catch (error) {
				if (entryType === 'post') {
					console.error(`Error processing ${entryType} entry:`, raw, error);
					return null;
				}
				console.error(`Error processing ${entryType} entry:`, {
					entryType,
					title: raw?.title,
					error: error instanceof Error ? error.message : String(error),
					stack: error instanceof Error ? error.stack : undefined,
					raw: JSON.stringify(raw, null, 2)
				});
				throw error;
			}
		})
		.filter((entry): entry is EntryTypeMap[T] => entry != null);

	const tags = getUniqueTags(
		entries as Post[] | Project[] | UsesEntry[] | Shareable[] | WorkEntry[]
	);
	return [entries, tags];
}
export async function requestPosts(): Promise<[Post[], Tag[]]> {
	return getEntries('post');
}

export async function requestProjects(): Promise<[Project[], Tag[]]> {
	return getEntries('project');
}

export async function requestUses(): Promise<[UsesEntry[], Tag[]]> {
	return getEntries('uses');
}

export async function requestShareables(): Promise<[Shareable[], Tag[]]> {
	try {
		return await getEntries('shareable');
	} catch {
		console.warn('Shareables directory not found, returning empty arrays');
		return [[], []];
	}
}

export async function requestWork(): Promise<[WorkEntry[], Tag[]]> {
	return getEntries('work');
}
