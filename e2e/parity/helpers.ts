import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import fm from 'front-matter';

/**
 * Slug derivation - copied verbatim from src/lib/util/helper.ts getSlug().
 * The parity harness must run framework-independently (against the SvelteKit
 * build now and the Astro build later), so it cannot import from $lib.
 */
export function getSlug(str: string): string {
	if (!str) return '';
	return str
		.trim()
		.toLowerCase()
		.replace(/[^a-zA-Z0-9\s]+/g, '')
		.replace(/\s+/g, '-');
}

const CONTENT_ROOT = join(process.cwd(), 'src', 'content');

type FrontmatterAttrs = { title?: string };

/** Read every markdown file's title-derived slug for a content type. */
export function slugsFor(type: 'posts' | 'uses' | 'experience'): string[] {
	const dir = join(CONTENT_ROOT, type);
	return readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => {
			const raw = readFileSync(join(dir, f), 'utf-8');
			const { attributes } = fm<FrontmatterAttrs>(raw);
			if (!attributes.title) throw new Error(`Missing title in ${type}/${f}`);
			return getSlug(attributes.title);
		})
		.sort();
}

/** The full HTML URL inventory, derived from content titles (never hardcoded slugs). */
export function htmlUrlInventory(): string[] {
	const urls: string[] = ['/'];
	urls.push('/posts', ...slugsFor('posts').map((s) => `/posts/${s}`));
	urls.push('/experience', ...slugsFor('experience').map((s) => `/experience/${s}`));
	urls.push('/uses');
	urls.push('/consulting', '/feeds', '/imprint', '/data-privacy');
	return urls;
}

/** A filesystem-safe key for a URL, used as the snapshot filename. */
export function urlKey(url: string): string {
	if (url === '/') return 'home';
	return url.replace(/^\//, '').replace(/\//g, '__');
}

export const RSS_FEEDS = [
	'/rss',
	'/feeds/rss',
	'/posts/rss',
	'/experience/rss',
	'/uses/rss'
] as const;

export function rssKey(url: string): string {
	if (url === '/rss') return 'merged';
	return (
		url
			.replace(/^\//, '')
			.replace(/\/rss$/, '')
			.replace(/\//g, '__') || 'merged'
	);
}
