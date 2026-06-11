import { getCollection } from 'astro:content';
import type { Post } from '$lib/types/post';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { ExperienceEntry, Position } from '$lib/types/experienceEntry';
import type { Tag } from '$lib/types/tag';
import type { EntryType } from '$lib/types/enums';
import { getDate, getTag } from '$lib/util/entries';
import { getSlug } from '$lib/util/helper';
import { renderPositionContent } from '$lib/markdown';

const BASE_URL = 'https://harambasic.de';

// The old FileSystemContentService yielded entries in filename order. Astro's glob
// loader order differs, which changes stable-sort tie-breaks in the feeds (uses
// shares published dates). Sort by id (filename stem) in code-point order to match.
function byId<T extends { id: string }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function relativePathFor(type: EntryType, slug: string): string {
	const segment = type === 'uses' ? 'uses' : type === 'experience' ? 'experience' : `${type}s`;
	return `/${segment}/${slug}`;
}

function tags(values: string[], type: EntryType): Tag[] {
	return values.map((value) => getTag(value, type));
}

/**
 * Typed accessors over Astro content collections. The routed slug is always
 * derived from the frontmatter title via getSlug() (never the file id) - see
 * AM-002. `html`/`toc` are populated by `render()` at the page/feed level, not
 * here, so they default to empty in the view models.
 */

export async function getPosts(): Promise<Post[]> {
	const entries = byId(await getCollection('posts'));
	return entries.map((entry) => {
		const slug = getSlug(entry.data.title);
		return {
			type: 'post',
			slug,
			relativePath: relativePathFor('post', slug),
			fullPath: `${BASE_URL}${relativePathFor('post', slug)}`,
			title: entry.data.title,
			description: entry.data.description,
			image: entry.data.image,
			tags: tags(entry.data.tags, 'post'),
			published: getDate(entry.data.published),
			updated: getDate(entry.data.updated),
			tldr: entry.data.tldr ?? '',
			discussion: entry.data.discussion ?? '',
			toc: [],
			html: ''
		};
	});
}

export async function getUses(): Promise<UsesEntry[]> {
	const entries = byId(await getCollection('uses'));
	return entries.map((entry) => {
		const slug = getSlug(entry.data.title);
		return {
			type: 'uses',
			slug,
			relativePath: relativePathFor('uses', slug),
			fullPath: `${BASE_URL}${relativePathFor('uses', slug)}`,
			title: entry.data.title,
			description: entry.data.description,
			image: entry.data.image,
			tags: tags(entry.data.tags, 'uses'),
			published: getDate(entry.data.published),
			updated: getDate(entry.data.updated),
			url: entry.data.url,
			status: entry.data.status,
			openSource: entry.data.openSource
		};
	});
}

export async function getExperience(): Promise<ExperienceEntry[]> {
	const entries = byId(await getCollection('experience'));
	return Promise.all(
		entries.map(async (entry) => {
			const slug = getSlug(entry.data.title);
			const positions: Position[] = await Promise.all(
				entry.data.positions.map(async (position) => ({
					title: position.title,
					startDate: position.startDate,
					endDate: position.endDate,
					content: await renderPositionContent(position.content),
					employmentType: position.employmentType ?? entry.data.employmentType
				}))
			);
			return {
				type: 'experience',
				slug,
				relativePath: relativePathFor('experience', slug),
				fullPath: `${BASE_URL}${relativePathFor('experience', slug)}`,
				title: entry.data.title,
				description: entry.data.description,
				image: entry.data.image,
				tags: tags(entry.data.tags, 'experience'),
				published: getDate(entry.data.published),
				updated: getDate(entry.data.updated),
				location: entry.data.location,
				employmentType: entry.data.employmentType,
				positions,
				html: ''
			};
		})
	);
}

// Re-export the tag aggregation so pages import everything entry-related from one place.
export { getUniqueTags, findBySlug, getTagBySlug, filterByTag } from '$lib/util/entries';
