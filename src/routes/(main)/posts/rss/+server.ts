import { getPost, sortByProperty } from '$lib/data/posts/helper';
import type { Post } from '$lib/types/post';
import { getContentService } from '$lib/services';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const contentService = getContentService();
	const rawEntries = await contentService.getEntries('post');
	const entries: Post[] = rawEntries
		.map(getPost)
		.filter((post): post is Post => post !== null)
		.sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, 'post');
	return new Response(body, options);
}
