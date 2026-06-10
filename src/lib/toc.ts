/**
 * Nested table-of-contents builder.
 *
 * Ports the stack-based nesting algorithm from the retired remark TocPlugin, but
 * sources its data from Astro's native `render()` headings instead of a custom
 * remark plugin. Astro's heading `slug` is the same github-slugger id applied to
 * the heading element by rehype-slug, so TOC `#fragment` links land on the
 * matching heading.
 */

/** Structurally compatible with Astro's `MarkdownHeading` ({ depth, slug, text }). */
export interface MarkdownHeading {
	depth: number;
	slug: string;
	text: string;
}

export interface TocNode {
	depth: number;
	slug: string;
	value: string;
	children: TocNode[];
}

export function buildNestedToc(headings: MarkdownHeading[]): TocNode[] {
	const nodes: TocNode[] = headings.map((h) => ({
		depth: h.depth,
		slug: h.slug,
		value: h.text,
		children: []
	}));

	if (nodes.length === 0) return [];
	if (nodes.length === 1) return nodes;

	const result: TocNode[] = [];
	const stack: TocNode[] = [];

	for (const node of nodes) {
		// Pop everything that isn't a parent of the current heading.
		while (stack.length > 0) {
			const top = stack.at(-1);
			if (top === undefined || top.depth < node.depth) break;
			stack.pop();
		}

		const parent = stack.at(-1);
		if (parent === undefined) {
			result.push(node);
		} else {
			parent.children.push(node);
		}

		stack.push(node);
	}

	return result;
}
