#!/usr/bin/env node
/**
 * AM-002 — Slug parity audit.
 *
 * Entry slugs (and therefore every URL and RSS <guid>) derive from the
 * frontmatter TITLE via getSlug(title), never from the filename. Astro content
 * collections derive their internal id from the filename, but the migration's
 * accessor layer (src/lib/entries.ts) computes the routed slug from the title —
 * so the filename and the title-slug are allowed to diverge.
 *
 * This script is a permanent guard for the things that actually break URLs and
 * feeds:
 *   - title-slug collisions within a content type (FATAL — two entries fight
 *     for the same URL)
 *   - relatedProjects / relatedWork cross-references that don't resolve (FATAL)
 *   - missing social images for posts/uses (WARN — og:image would 404)
 *
 * Filename-vs-title divergence is reported as INFO only: it is expected and
 * handled by deriving slugs from the title. Run standalone (no Vite/TS).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import fm from 'front-matter';

// Copied verbatim from src/lib/util/helper.ts — must run outside the toolchain.
function getSlug(str) {
	if (!str) return '';
	return str
		.trim()
		.toLowerCase()
		.replace(/[^a-zA-Z0-9\s]+/g, '')
		.replace(/\s+/g, '-');
}

const CONTENT = join(process.cwd(), 'src', 'content');
const SOCIAL = join(process.cwd(), 'static', 'social');
const TYPES = ['posts', 'projects', 'uses', 'work'];

function loadEntries(type) {
	const dir = join(CONTENT, type);
	return readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.map((file) => {
			const { attributes } = fm(readFileSync(join(dir, file), 'utf-8'));
			return { file, stem: file.replace(/\.md$/, ''), data: attributes };
		});
}

let fatal = 0;
let warn = 0;
const all = {};

for (const type of TYPES) {
	const entries = loadEntries(type);
	all[type] = entries.map((e) => ({ ...e, slug: getSlug(e.data.title) }));

	// 1. title-slug collisions
	const seen = new Map();
	for (const e of all[type]) {
		if (seen.has(e.slug)) {
			console.error(
				`FATAL: duplicate slug "${e.slug}" in ${type}: ${seen.get(e.slug)} and ${e.file}`
			);
			fatal++;
		}
		seen.set(e.slug, e.file);
	}

	// 2. filename-vs-title divergence (informational)
	for (const e of all[type]) {
		if (e.stem === e.slug) {
			console.log(`OK    ${type}/${e.file}`);
		} else {
			console.log(
				`INFO  ${type}/${e.file}: filename-slug="${e.stem}" title-slug="${e.slug}" (routed by title-slug)`
			);
		}
	}
}

// 3. cross-references resolve (against title-slugs)
const projectSlugs = new Set(all.projects.map((e) => e.slug));
const workSlugs = new Set(all.work.map((e) => e.slug));

for (const e of all.work) {
	for (const ref of e.data.relatedProjects ?? []) {
		if (!projectSlugs.has(ref)) {
			console.error(`FATAL: work/${e.file} relatedProjects "${ref}" does not resolve to a project`);
			fatal++;
		}
	}
}
for (const e of all.projects) {
	for (const ref of e.data.relatedWork ?? []) {
		if (!workSlugs.has(ref)) {
			console.error(
				`FATAL: projects/${e.file} relatedWork "${ref}" does not resolve to a work entry`
			);
			fatal++;
		}
	}
}

// 4. social images for posts + uses
for (const type of ['posts', 'uses']) {
	for (const e of all[type]) {
		const png = join(SOCIAL, `${e.slug}.png`);
		if (!existsSync(png)) {
			console.warn(`WARN  missing social image: static/social/${e.slug}.png (${type}/${e.file})`);
			warn++;
		}
	}
}

console.log(`\nAudit complete: ${fatal} fatal, ${warn} warnings.`);
process.exit(fatal > 0 ? 1 : 0);
