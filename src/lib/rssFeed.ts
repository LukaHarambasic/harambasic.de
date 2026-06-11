import { getCollection } from 'astro:content';
import type { RSSFeedItem } from '@astrojs/rss';
import { getPosts, getProjects, getUses, getWork } from '$lib/content';
import { renderEntryHtml } from '$lib/markdown';
import { workEntryToFullHtml } from '$lib/util/workEntry';
import { getSlug } from '$lib/util/helper';

/**
 * RSS item builders for the @astrojs/rss endpoints. All file access goes
 * through Astro content collections; this module only maps view models to
 * RSSFeedItem and renders `content:encoded` HTML where a body exists.
 * Every feed is sorted published DESC (newest first).
 */

export type FeedSection = 'posts' | 'projects' | 'uses' | 'work';

const CHANNEL_DESCRIPTION_BASE =
	'My private playground, publishing my thoughts and ideas. Showing of what I did and playing around with new technologies.';

export function sectionChannel(section: FeedSection): { title: string; description: string } {
	const label = section.charAt(0).toUpperCase() + section.slice(1);
	return {
		title: `Luka Harambasic | ${label}`,
		description: `${CHANNEL_DESCRIPTION_BASE} In this feed you will stay up to date with my ${section}.`
	};
}

export const mergedChannel = {
	title: 'Luka Harambasic | All',
	description: 'All posts, projects, uses, and work in one feed, ordered by date.'
};

type FeedEntry = {
	title: string;
	description: string;
	relativePath: string;
	published: { raw: Date };
};

function toItem(entry: FeedEntry, extra: Partial<RSSFeedItem> = {}): RSSFeedItem {
	return {
		title: entry.title,
		description: entry.description,
		link: entry.relativePath,
		pubDate: entry.published.raw,
		...extra
	};
}

function byPubDateDesc(a: RSSFeedItem, b: RSSFeedItem): number {
	return (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0);
}

// Map title-slug -> raw markdown body so we can render content:encoded HTML.
async function bodyMap(collection: 'posts' | 'projects'): Promise<Map<string, string>> {
	const entries = await getCollection(collection);
	const map = new Map<string, string>();
	for (const entry of entries) map.set(getSlug(entry.data.title), entry.body ?? '');
	return map;
}

export async function buildPostsItems(): Promise<RSSFeedItem[]> {
	const [bodies, posts] = await Promise.all([bodyMap('posts'), getPosts()]);
	const items = await Promise.all(
		posts.map(async (post) =>
			toItem(post, { content: await renderEntryHtml(bodies.get(post.slug) ?? '') })
		)
	);
	return items.sort(byPubDateDesc);
}

export async function buildProjectsItems(): Promise<RSSFeedItem[]> {
	const [bodies, projects] = await Promise.all([bodyMap('projects'), getProjects()]);
	const items = await Promise.all(
		projects.map(async (project) =>
			toItem(project, { content: await renderEntryHtml(bodies.get(project.slug) ?? '') })
		)
	);
	return items.sort(byPubDateDesc);
}

export async function buildUsesItems(): Promise<RSSFeedItem[]> {
	const uses = await getUses();
	return uses.map((entry) => toItem(entry)).sort(byPubDateDesc);
}

export async function buildWorkItems(): Promise<RSSFeedItem[]> {
	const work = await getWork();
	return work
		.map((entry) => toItem(entry, { content: workEntryToFullHtml(entry) }))
		.sort(byPubDateDesc);
}

/** Merged feed: posts + projects + uses + work, each item tagged with its section. */
export async function buildMergedItems(): Promise<RSSFeedItem[]> {
	const [posts, projects, uses, work] = await Promise.all([
		buildPostsItems(),
		buildProjectsItems(),
		buildUsesItems(),
		buildWorkItems()
	]);
	const withCategory = (items: RSSFeedItem[], category: string) =>
		items.map((item) => ({ ...item, categories: [category] }));
	return [
		...withCategory(posts, 'Posts'),
		...withCategory(projects, 'Projects'),
		...withCategory(uses, 'Uses'),
		...withCategory(work, 'Work')
	].sort(byPubDateDesc);
}

/** atom:link rel="self" - @astrojs/rss doesn't emit it; validators expect it. */
export function selfLink(path: string): { xmlns: Record<string, string>; customData: string } {
	return {
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		customData: `<atom:link href="https://harambasic.de${path}" rel="self" type="application/rss+xml"/>`
	};
}
