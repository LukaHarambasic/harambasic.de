import { getCollection } from 'astro:content';
import { getPosts, getProjects, getUses, getWork } from '$lib/content';
import { renderEntryHtml } from '$lib/markdown';
import { workEntryToFullHtml } from '$lib/util/workEntry';
import { sortByProperty } from '$lib/util/entryHelpers';
import { getSlug } from '$lib/util/helper';
import type { MergedRssEntry } from '$lib/rss';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { WorkEntry } from '$lib/types/workEntry';

// Map title-slug -> raw markdown body so we can render content:encoded HTML.
async function bodyMap(collection: 'posts' | 'projects'): Promise<Map<string, string>> {
	const entries = await getCollection(collection);
	const map = new Map<string, string>();
	for (const entry of entries) map.set(getSlug(entry.data.title), entry.body ?? '');
	return map;
}

async function postsWithHtml(): Promise<Post[]> {
	const bodies = await bodyMap('posts');
	const posts = await getPosts();
	return Promise.all(
		posts.map(async (post) => ({
			...post,
			html: await renderEntryHtml(bodies.get(post.slug) ?? '')
		}))
	);
}

async function projectsWithHtml(): Promise<Project[]> {
	const bodies = await bodyMap('projects');
	const projects = await getProjects();
	return Promise.all(
		projects.map(async (project) => ({
			...project,
			html: await renderEntryHtml(bodies.get(project.slug) ?? '')
		}))
	);
}

function toMerged<
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

/** Merged feed: posts + projects + uses + work, sorted published DESC. */
export async function buildMergedEntries(): Promise<MergedRssEntry[]> {
	const [posts, projects, uses, work] = await Promise.all([
		postsWithHtml(),
		projectsWithHtml(),
		getUses(),
		getWork()
	]);

	const merged: MergedRssEntry[] = [
		...posts.map((e) => toMerged(e, 'Posts')),
		...projects.map((e) => toMerged(e, 'Projects')),
		...uses.map((e) => toMerged(e, 'Uses')),
		...work.map((e) => toMerged({ ...e, html: workEntryToFullHtml(e) }, 'Work'))
	];

	merged.sort((a, b) => b.published.raw.getTime() - a.published.raw.getTime());
	return merged;
}

// Section feeds: sorted published ASC (sortByProperty ascending). Preserve this quirk.
export async function buildPostsFeed(): Promise<Post[]> {
	return (await postsWithHtml()).sort((a, b) => sortByProperty(a, b, 'published'));
}

export async function buildProjectsFeed(): Promise<Project[]> {
	return (await projectsWithHtml()).sort((a, b) => sortByProperty(a, b, 'published'));
}

export async function buildUsesFeed(): Promise<UsesEntry[]> {
	return (await getUses()).sort((a, b) => sortByProperty(a, b, 'published'));
}

export async function buildWorkFeed(): Promise<Array<WorkEntry & { html: string }>> {
	const work = await getWork();
	return work
		.map((e) => ({ ...e, html: workEntryToFullHtml(e) }))
		.sort((a, b) => sortByProperty(a, b, 'published'));
}
