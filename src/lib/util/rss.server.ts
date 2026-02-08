import type { EntryType } from '$lib/types/enums';
import type { Entry } from '$lib/types/entry';
import type { EntryDate } from '$lib/types/entry';

type RssEntry = Entry & { html?: string };

/** Unified shape for merged feed items; category is emitted as RSS <category>. */
export type MergedRssEntry = {
	title: string;
	description: string;
	slug: string;
	published: EntryDate;
	relativePath: string;
	category: 'Posts' | 'Projects' | 'Uses' | 'Work';
	html?: string;
};

export function generateXml(entries: RssEntry[], entryType: EntryType) {
	const folderName = entryType === 'uses' || entryType === 'work' ? entryType : `${entryType}s`;
	const type = folderName.charAt(0).toUpperCase() + folderName.slice(1);
	const body = entries
		.map((entry) => {
			const contentEncoded =
				'html' in entry && entry.html
					? `<content:encoded><![CDATA[${entry.html}]]></content:encoded>`
					: '';
			return `<item>
					<guid isPermaLink="true">https://harambasic.de/${folderName}/${entry.slug}</guid>
					<title>${escapeXml(entry.title)}</title>
					<link>https://harambasic.de/${folderName}/${entry.slug}</link>
					<description>${escapeXml(entry.description)}</description>
					<pubDate>${new Date(entry.published.raw).toUTCString()}</pubDate>
					${contentEncoded}
				</item>`;
		})
		.join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
                <atom:link href="https://harambasic.de/${folderName}/rss" rel="self" type="application/rss+xml" />
                <title>Luka Harambasic | ${type}</title>
                <link>https://harambasic.de</link>
                <description>My private playground, publishing my thoughts and ideas. Showing of what I did and playing around with new technologies. In this feed you will stay up to date with my ${folderName}.</description>
                <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
					${body}
				</channel>
        </rss>`;
	return xml;
}

export function generateMergedXml(entries: MergedRssEntry[]) {
	const baseUrl = 'https://harambasic.de';
	const body = entries
		.map((entry) => {
			const link = `${baseUrl}${entry.relativePath}`;
			const contentEncoded =
				entry.html != null && entry.html !== ''
					? `<content:encoded><![CDATA[${entry.html}]]></content:encoded>`
					: '';
			return `<item>
					<guid isPermaLink="true">${link}</guid>
					<title>${escapeXml(entry.title)}</title>
					<link>${link}</link>
					<description>${escapeXml(entry.description)}</description>
					<pubDate>${new Date(entry.published.raw).toUTCString()}</pubDate>
					<category>${escapeXml(entry.category)}</category>
					${contentEncoded}
				</item>`;
		})
		.join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
                <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
                <title>Luka Harambasic | All</title>
                <link>${baseUrl}</link>
                <description>All posts, projects, uses, and work in one feed, ordered by date.</description>
                <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
					${body}
				</channel>
        </rss>`;
	return xml;
}

export const options = {
	headers: {
		'Cache-Control': `max-age=0, s-max-age=600`,
		'Content-Type': 'application/xml; charset=UTF-8'
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
