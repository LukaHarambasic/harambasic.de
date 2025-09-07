import { getPost, sortByProperty } from '$lib/data/posts/helper';
import { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import { getRawEntries } from '$lib/util/converter.server';
import { generateXml, options } from '$lib/util/rss.server';

export const prerender = true;

export async function GET() {
	const rawEntries = await getRawEntries(EntryType.Post);
	const entries: Post[] = rawEntries.map(getPost).sort((a, b) => sortByProperty(a, b, 'published'));
	const body = generateXml(entries, EntryType.Post);
	return new Response(body, options);
}
