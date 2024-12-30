import type { MarkdownHeading } from "astro";

export function generateNestedToc(markdownHeadings: MarkdownHeading[]): TocNode[] {
	let latestEntry: TocNode | null;
	let latestParent: TocNode | null;
	const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeadings));
	if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;
	const entryDepth: number = markdownHeadings.reduce((acc: number, item: MarkdownHeading) => {
		return item.depth < acc ? item.depth : acc;
	}, Number.POSITIVE_INFINITY);
	return markdownHeadingCopy.reduce((result: TocNode[], entry: TocNode) => {
		if (latestEntry && !latestEntry.children) {
			latestEntry.children = [];
		}
		const latestEntryDepth = latestEntry?.depth || 0;
		const latestEntryChildren = latestEntry?.children || [];
		const latestParentChildren = latestParent?.children || [];
		if (entry.depth === entryDepth) {
			entry.children = [];
			result.push(entry);
			latestParent = null;
		} else if (entry.depth === latestEntryDepth + 1) {
			latestEntryChildren.push(entry);
			latestParent = latestEntry;
		} else if (entry.depth === latestEntryDepth) {
			latestParentChildren.push(entry);
		} else {
			console.error('Unexpected ToC behaviour', entry);
		}
		latestEntry = entry;
		return result;
	}, []);
}

export interface TocNode {
	depth: number;
	slug: string;
	text: string;
	children?: TocNode[] | [];
}