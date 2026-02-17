import type { Node } from 'unist';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';
import { slug as slugger } from 'github-slugger';
import type { TocNode } from '$lib/types/post';

/**
 * Configuration options for TOC generation
 */
export interface TocConfig {
	/** Maximum heading depth to include (default: 6) */
	maxDepth?: number;
	/** Minimum heading depth to include (default: 1) */
	minDepth?: number;
	/** Whether to include parent relationships in flat structure */
	includeParents?: boolean;
	/** Whether to use ordered list structure */
	ordered?: boolean;
}

/**
 * Creates a remark plugin for generating nested table of contents
 *
 * @param config Configuration options for TOC generation
 * @returns Remark plugin function
 */
export function createTocPlugin(config: TocConfig = {}) {
	const { maxDepth = 6, minDepth = 1 } = config;

	return function remarkGenerateNestedToc() {
		return (tree: Node, file: VFile) => {
			const headings: { value: string; depth: number; slug: string }[] = [];

			visit(tree, 'heading', (node: TocNode) => {
				// Only process headings within the specified depth range
				if (node.depth < minDepth || node.depth > maxDepth) {
					return;
				}

				const value = (node?.children ?? []).reduce(
					(text, child) => text + (child.value || ''),
					''
				);
				const slug = slugger(value);
				headings.push({ value, depth: node.depth, slug });
			});

			file.data.toc = buildNestedToc(headings);
		};
	};
}

/**
 * Builds a nested table of contents structure from flat heading array
 *
 * @param markdownHeadings Array of headings with value, depth, and slug
 * @returns Nested TOC structure
 */
function buildNestedToc(markdownHeadings: TocNode[]): TocNode[] {
	if (markdownHeadings.length === 0) return [];

	// Efficient shallow copy with children initialization
	const headingsCopy = markdownHeadings.map((heading) => ({ ...heading, children: [] }));
	if (headingsCopy.length === 1) {
		return headingsCopy;
	}

	// Algorithm uses stack-based approach, no need to track minimum depth explicitly

	const result: TocNode[] = [];
	const stack: TocNode[] = [];

	for (const heading of headingsCopy) {
		// Remove all headings from stack that are not parents of current heading
		while (stack.length > 0) {
			const top = stack.at(-1);
			if (top === undefined || top.depth < heading.depth) break;
			stack.pop();
		}

		if (stack.length === 0) {
			// This is a root-level heading
			result.push(heading);
		} else {
			// This is a child of the last heading in the stack
			const parent = stack.at(-1);
			if (parent) {
				if (!parent.children) parent.children = [];
				parent.children.push(heading);
			}
		}

		stack.push(heading);
	}

	return result;
}
