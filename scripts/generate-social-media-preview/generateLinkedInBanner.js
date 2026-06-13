import path from 'path';
import { chromium } from 'playwright';
import { ROOT_PATH, SOCIAL_PATH } from './util.js';

// LinkedIn profile cover image: 1584 x 396 (4:1). Output lands in public/social/
// alongside the other previews so it ships with the static build.
const DEFAULT_SLUG = 'linkedin-banner';

const generateBanner = async (page, title, slug) => {
	const URL = `file:///${path.join(
		ROOT_PATH,
		'/scripts/generate-social-media-preview/template-linkedin.html'
	)}`;
	const SCREENSHOT_PATH = `${SOCIAL_PATH}/${slug}.png`;
	await page.goto(URL);
	// Only override the headline when a --title is passed, so the template's default
	// markup (with its italic accent) is kept otherwise. Plain text replacement, like
	// the other previews - no inner italics for custom titles.
	if (title) {
		await page.$eval('.title', (el, title) => (el.textContent = title), title);
	}
	const cardHandle = await page.$('.container');
	await cardHandle.screenshot({ type: 'png', path: SCREENSHOT_PATH });
};

// node scripts/generate-social-media-preview/generateLinkedInBanner.js
// node scripts/generate-social-media-preview/generateLinkedInBanner.js --title="Custom headline"
const linkedInBannerGeneration = async (title, slug) => {
	const browser = await chromium.launch();
	// 2x device scale renders the 1584x396 layout at 3168x792 for a crisp,
	// high-res banner.
	const context = await browser.newContext({ deviceScaleFactor: 2 });
	const page = await context.newPage();
	await generateBanner(page, title, slug);
	console.log('🆕 LinkedIn banner:', `${slug}.png`, title ? `(${title})` : '(default)');
	await browser.close();
};

(async () => {
	try {
		const titleArg = process.argv.find((arg) => arg.startsWith('--title='));
		const title = titleArg ? titleArg.replace('--title=', '') : '';
		await linkedInBannerGeneration(title, DEFAULT_SLUG);
	} catch (error) {
		console.log('Error:', error);
	}
})();
