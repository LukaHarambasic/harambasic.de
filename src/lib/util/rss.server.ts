import { EntryType } from '$lib/types/enums';
import type { Entry } from '$lib/types/entry';

export function generateXml(entries: Entry[], entryType: EntryType) {
	const folderName =
		entryType.toLowerCase() === 'stack_entry' ? 'stack' : `${entryType.toLowerCase()}s`;
	const type = folderName.charAt(0).toUpperCase() + folderName.slice(1);
	const body = entries
		.map(
			(entry) =>
				`<item>
					<guid>https://harambasic.de/${folderName}/${entry.slug}</guid>
					<title>${escapeXml(entry.title)}</title>
					<link>https://harambasic.de/${folderName}/${entry.slug}</link>
					<description>${escapeXml(entry.description)}</description>
					<pubDate>${new Date(entry.published.raw).toUTCString()}</pubDate>
				</item>`
		)
		.join('');
	const xml = `
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
                <atom:link href="http://harambasic.de/${folderName}/rss" rel="self" type="application/rss+xml" />
                <title>Luka Harambasic | ${type}</title>
                <link>https://harambasic.de</link>
                <description>My private playground, publishing my thoughts and ideas. Showing of what I did and playing around with new technologies. In this feed you will stay up to date with my ${folderName}.</description>
					${body}
				</channel>
        </rss>`;
	return xml;
}

export const options = {
	headers: {
		'Cache-Control': `max-age=0, s-max-age=600`,
		'Content-Type': 'application/xml'
	}
};

function escapeXml(unsafe: string) {
	return unsafe
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
