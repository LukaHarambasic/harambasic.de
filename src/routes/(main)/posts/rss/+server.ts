import { getPost, sortByProperty } from '$lib/data/posts/helper';
import type { Post } from '$lib/types/post';
import { getRawEntries } from '$lib/util/cachedConverter.server';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getRawEntries('post');
	const entries: Post[] = rawEntries.map(getPost).sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, 'post');
	return new Response(body, options);
}
