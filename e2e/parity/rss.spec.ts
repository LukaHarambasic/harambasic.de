import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RSS_FEEDS, rssKey } from './helpers';

const FIXTURE_DIR = join(process.cwd(), 'e2e', 'fixtures', 'rss');

/** Remove the per-build timestamp so fixtures stay stable across builds. */
function stripLastBuildDate(xml: string): string {
	return xml.replace(
		/<lastBuildDate>.*?<\/lastBuildDate>/g,
		'<lastBuildDate>STRIPPED</lastBuildDate>'
	);
}

/**
 * Code-block markup inside <content:encoded> intentionally differs between the
 * SvelteKit build (rehype-highlight, .hljs) and the Astro build (Shiki,
 * .astro-code). Normalize <pre>…</pre> internals so the comparison covers
 * everything else (item order, guids, links, categories, structure).
 */
function normalizeCodeBlocks(xml: string): string {
	return xml.replace(/<pre[\s\S]*?<\/pre>/g, '<pre>CODE</pre>');
}

function normalize(xml: string): string {
	return normalizeCodeBlocks(stripLastBuildDate(xml));
}

for (const feed of RSS_FEEDS) {
	test(`rss parity: ${feed}`, async ({ request }) => {
		const res = await request.get(feed);
		expect(res.status(), `status for ${feed}`).toBe(200);

		const body = normalize(await res.text());
		const fixturePath = join(FIXTURE_DIR, `${rssKey(feed)}.xml`);

		if (process.env.UPDATE_FIXTURES || !existsSync(fixturePath)) {
			mkdirSync(FIXTURE_DIR, { recursive: true });
			writeFileSync(fixturePath, body);
			test.info().annotations.push({ type: 'fixture-written', description: fixturePath });
			return;
		}

		expect(body).toBe(readFileSync(fixturePath, 'utf-8'));
	});
}
