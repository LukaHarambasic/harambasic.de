import { readFileSync, readdirSync } from 'fs';
import fm from 'front-matter';
import { chromium } from 'playwright';
import { ROOT_PATH, doesImageAlreadyExist, generateImage } from './util.js';

// All content types with detail pages / og:image references.
const CONTENT_TYPES = ['posts', 'projects', 'uses', 'work'];

// Copied verbatim from src/lib/util/helper.ts - must run outside the toolchain.
export function getSlug(str) {
	if (!str) return '';
	return (
		str
			.trim()
			.toLowerCase()
			// remove all chars which aren't characters, numbers or spaces
			.replace(/[^a-zA-Z0-9\s]+/g, '')
			// replace all spaces with dashes
			.replace(/\s+/g, '-')
	);
}

const generateSocialMediaPreview = async () => {
	console.log('>> GENERATE SOCIAL MEDIA PREVIEWS <<');
	console.log('🆕 newly generated, 🛑 already exists');
	console.log('-------------------------------------');
	const browser = await chromium.launch();
	const page = await browser.newPage();
	for (const type of CONTENT_TYPES) {
		const dir = `${ROOT_PATH}/src/content/${type}`;
		const files = readdirSync(dir).filter((name) => name.endsWith('.md'));
		for (const name of files) {
			const { attributes } = fm(readFileSync(`${dir}/${name}`, 'utf8'));
			const title = attributes.title;
			// og:image is keyed by the routed slug, which derives from the TITLE,
			// never the filename - see scripts/audit-slugs.js (AM-002).
			const slug = getSlug(title);
			if (!doesImageAlreadyExist(slug)) {
				console.log(`🆕 ${type}:`, title);
				await generateImage(page, title, slug);
			} else {
				console.log(`🛑 ${type}:`, title);
			}
		}
	}
	await browser.close();
};

(async () => {
	try {
		await generateSocialMediaPreview();
	} catch (error) {
		console.log('Error:', error);
	}
})();
