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

/**
 * Check if any of the provided snippets exist
 * @param snippets - Array of snippets to check
 * @returns Boolean indicating if at least one snippet exists
 */
export function hasAnySnippet(
	...snippets: (import('svelte').Snippet | undefined | null)[]
): boolean {
	return snippets.some((snippet) => hasSnippet(snippet));
}

/**
 * Check if all provided snippets exist
 * @param snippets - Array of snippets to check
 * @returns Boolean indicating if all snippets exist
 */
export function hasAllSnippets(
	...snippets: (import('svelte').Snippet | undefined | null)[]
): boolean {
	return snippets.every((snippet) => hasSnippet(snippet));
}

/**
 * Create a conditional class string based on snippet existence
 * @param snippet - The snippet to check
 * @param className - The class name to apply if snippet exists
 * @param fallbackClass - Optional class to apply if snippet doesn't exist
 * @returns Class string or undefined
 */
export function snippetClass(
	snippet: import('svelte').Snippet | undefined,
	className: string,
	fallbackClass?: string
): string | undefined {
	return hasSnippet(snippet) ? className : fallbackClass;
}

/**
 * Type guard for snippet existence with proper TypeScript narrowing
 * @param snippet - The snippet to check
 * @returns Type-narrowed snippet
 */
export function assertSnippet<T extends import('svelte').Snippet | undefined>(
	snippet: T
): snippet is NonNullable<T> {
	return hasSnippet(snippet);
}

/**
 * Functional approach to conditional snippet rendering
 * @param snippet - The snippet to conditionally render
 * @param condition - Boolean or function returning boolean
 * @returns The snippet if condition is true, undefined otherwise
 */
export function conditionalSnippet(
	snippet: import('svelte').Snippet | undefined,
	condition: boolean | (() => boolean)
): import('svelte').Snippet | undefined {
	const shouldRender = typeof condition === 'function' ? condition() : condition;
	return shouldRender && hasSnippet(snippet) ? snippet : undefined;
}
