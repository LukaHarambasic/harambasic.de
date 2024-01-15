import { getPost } from '$lib/data/posts/helper';
import { EntryType } from '$lib/types/enums';
import type { Post } from '$lib/types/post';
import { getRawEntries } from '$lib/util/converter.server';

export const prerender = true;

export async function GET() {
	console.log('GET');
	const rawEntries = await getRawEntries(EntryType.Post);
	const posts: Post[] = rawEntries.map(getPost);
	const body = generateXml(posts);
	return new Response(body, {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`,
			'Content-Type': 'application/xml'
		}
	});
}

function generateXml(posts: Post[]) {
	const body = posts
		.map(
			(post) =>
				`<item>
					<guid>https://harambasic.de/posts/${post.slug}</guid>
					<title>${escapeXml(post.title)}</title>
					<link>https://harambasic.de/posts/${post.slug}</link>
					<description>${escapeXml(post.description)}</description>
					<pubDate>${new Date(post.published.raw).toUTCString()}</pubDate>
				</item>`
		)
		.join('');
	const xml = `
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
                <atom:link href="http://harambasic.de/rss/posts" rel="self" type="application/rss+xml" />
                <title>Luka Harambasic | Posts</title>
                <link>https://harambasic.de</link>
                <description>My private playground, publishing my thoughts and ideas. Showing of what I did and playing around with new technologies.</description>
					${body}
				</channel>
        </rss>`;
	return xml;
}

function escapeXml(unsafe: string) {
	return unsafe
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
