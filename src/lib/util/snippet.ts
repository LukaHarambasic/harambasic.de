/**
 * Utility functions for Svelte 5 snippet composition patterns
 *
 * Following functional programming principles for consistent
 * and reusable component composition patterns.
 */

/**
 * Safely render a snippet with optional fallback content
 * @param snippet - The snippet to render
 * @param fallback - Optional fallback content if snippet is undefined
 * @returns Boolean indicating if snippet exists and should be rendered
 */
export function hasSnippet(
	snippet: import('svelte').Snippet | undefined | null
): snippet is import('svelte').Snippet {
	return snippet !== undefined && snippet !== null;
}
