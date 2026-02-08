import { requestPosts, requestProjects, requestUses, requestWork } from '$lib/data/api.server';
import type { MergedRssEntry } from '$lib/util/rss.server';
import { generateMergedXml, options } from '$lib/util/rss.server';

export const prerender = true;

function toMergedEntry<
	E extends {
		relativePath: string;
		published: { raw: Date; display: string };
		title: string;
		description: string;
		slug: string;
		html?: string;
	}
>(entry: E, category: MergedRssEntry['category']): MergedRssEntry {
	return {
		title: entry.title,
		description: entry.description,
		slug: entry.slug,
		published: entry.published,
		relativePath: entry.relativePath,
		category,
		html: 'html' in entry ? entry.html : undefined
	};
}

export async function GET() {
	const [postsResult, projectsResult, usesResult, workResult] = await Promise.all([
		requestPosts(),
		requestProjects(),
		requestUses(),
		requestWork()
	]);

	const merged: MergedRssEntry[] = [
		...postsResult[0].map((e) => toMergedEntry(e, 'Posts')),
		...projectsResult[0].map((e) => toMergedEntry(e, 'Projects')),
		...usesResult[0].map((e) => toMergedEntry(e, 'Uses')),
		...workResult[0].map((e) => toMergedEntry(e, 'Work'))
	];

	merged.sort((a, b) => b.published.raw.getTime() - a.published.raw.getTime());

	const body = generateMergedXml(merged);
	return new Response(body, options);
}
