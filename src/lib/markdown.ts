import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

/**
 * Render markdown-in-YAML (work `positions[].content`) to an HTML string.
 *
 * Direct port of the retired `processPositionContent` from entryConfigs.ts —
 * same remark -> remark-rehype -> rehype-stringify pipeline, so the output is
 * byte-identical to the old work detail page and work RSS `content:encoded`.
 */
export async function renderPositionContent(markdown: string): Promise<string> {
	try {
		const result = await remark().use(remarkRehype).use(rehypeStringify).process(markdown);
		return String(result);
	} catch (error) {
		console.warn('Failed to process position content markdown:', error);
		return markdown;
	}
}

/**
 * Render a markdown body to an HTML string for RSS `content:encoded`.
 *
 * Mirrors the retired MarkdownProcessor's non-code chain (plain remark — no GFM
 * or smartypants — plus rehype-slug + rehype-autolink-headings), so heading
 * anchors, links, images, and prose match the captured RSS fixtures. Code-block
 * internals intentionally differ from the old hljs output and are normalized out
 * of the fixture comparison.
 */
export async function renderEntryHtml(markdown: string): Promise<string> {
	const result = await remark()
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings)
		.use(rehypeStringify)
		.process(markdown);
	return String(result);
}
