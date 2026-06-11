/**
 * Build-time site origin for absolute URLs in meta tags (og:image, og:url).
 * Netlify sets DEPLOY_PRIME_URL on every build - including production, where it
 * points at the branch permalink (main--*.netlify.app) - so production must use
 * the canonical URL (process.env.URL) instead. CONTEXT distinguishes the two;
 * local/CI builds fall back to the canonical domain.
 */
export function getPermalink(): string {
	const fromEnv =
		process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL;
	return fromEnv || 'https://harambasic.de';
}
