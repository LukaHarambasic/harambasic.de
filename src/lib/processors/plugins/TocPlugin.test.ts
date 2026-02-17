import { describe, it, expect } from 'vitest';
import { remark } from 'remark';
import { createTocPlugin } from './TocPlugin';
import type { TocNode } from '$lib/types/post';

describe('TocPlugin', () => {
	describe('Basic TOC Generation', () => {
		it('should generate TOC from headings', () => {
			const plugin = createTocPlugin();
			const processor = remark().use(plugin);

			const markdown = `# Level 1
## Level 2
### Level 3`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			expect(toc).toHaveLength(1);
			expect(toc[0]?.value).toBe('Level 1');
			expect(toc[0]?.depth).toBe(1);
			expect(toc[0]?.children ?? []).toHaveLength(1);
			expect(toc[0]?.children?.[0]?.value).toBe('Level 2');
			expect(toc[0]?.children?.[0]?.children ?? []).toHaveLength(1);
			expect(toc[0]?.children?.[0]?.children?.[0]?.value).toBe('Level 3');
		});

		it('should handle multiple top-level headings', () => {
			const plugin = createTocPlugin();
			const processor = remark().use(plugin);

			const markdown = `# First Heading
## Sub heading
# Second Heading
## Another sub heading`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			expect(toc).toHaveLength(2);
			expect(toc[0]?.value).toBe('First Heading');
			expect(toc[1]?.value).toBe('Second Heading');
			expect(toc[0]?.children).toHaveLength(1);
			expect(toc[1]?.children).toHaveLength(1);
		});
	});

	describe('Configuration Options', () => {
		it('should respect maxDepth configuration', () => {
			const plugin = createTocPlugin({ maxDepth: 2 });
			const processor = remark().use(plugin);

			const markdown = `# H1
## H2
### H3
#### H4`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			// Should only include H1 and H2, excluding H3 and H4
			expect(toc).toHaveLength(1);
			expect(toc[0]?.children ?? []).toHaveLength(1);
			expect(toc[0]?.children?.[0]?.depth).toBe(2);
		});

		it('should respect minDepth configuration', () => {
			const plugin = createTocPlugin({ minDepth: 2 });
			const processor = remark().use(plugin);

			const markdown = `# H1
## H2
### H3`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			// Should only include H2 as the root, excluding H1
			expect(toc).toHaveLength(1);
			expect(toc[0]?.depth).toBe(2);
			expect(toc[0]?.value).toBe('H2');
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty content', () => {
			const plugin = createTocPlugin();
			const processor = remark().use(plugin);

			const result = processor.processSync('');
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			expect(toc).toEqual([]);
		});

		it('should handle content without headings', () => {
			const plugin = createTocPlugin();
			const processor = remark().use(plugin);

			const markdown = `Just some text content without headings.
And more content.`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			expect(toc).toEqual([]);
		});

		it('should handle single heading', () => {
			const plugin = createTocPlugin();
			const processor = remark().use(plugin);

			const markdown = `# Single Heading
Some content.`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			expect(toc).toHaveLength(1);
			expect(toc[0]?.value).toBe('Single Heading');
			expect(toc[0]?.children).toBeDefined();
		});
	});

	describe('Slug Generation', () => {
		it('should generate proper slugs for headings', () => {
			const plugin = createTocPlugin();
			const processor = remark().use(plugin);

			const markdown = `# Hello World
## Special Characters & Symbols!
### Multiple   Spaces`;

			const result = processor.processSync(markdown);
			const toc: TocNode[] = (result.data?.toc ?? []) as TocNode[];

			expect(toc[0]?.slug).toBe('hello-world');
			expect(toc[0]?.children?.[0]?.slug).toBe('special-characters--symbols');
			expect(toc[0]?.children?.[0]?.children?.[0]?.slug).toBe('multiple---spaces');
		});
	});
});
