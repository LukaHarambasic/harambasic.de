import { describe, it, expect } from 'vitest';
import { buildNestedToc, type MarkdownHeading } from './toc';

const h = (depth: number, text: string): MarkdownHeading => ({
	depth,
	text,
	slug: text.toLowerCase().replace(/\s+/g, '-')
});

describe('buildNestedToc', () => {
	it('returns an empty array for no headings', () => {
		expect(buildNestedToc([])).toEqual([]);
	});

	it('returns a single root heading', () => {
		const toc = buildNestedToc([h(2, 'Only')]);
		expect(toc).toHaveLength(1);
		expect(toc[0]?.value).toBe('Only');
		expect(toc[0]?.children).toEqual([]);
	});

	it('nests descending headings', () => {
		const toc = buildNestedToc([h(1, 'Level 1'), h(2, 'Level 2'), h(3, 'Level 3')]);
		expect(toc).toHaveLength(1);
		expect(toc[0]?.value).toBe('Level 1');
		expect(toc[0]?.children).toHaveLength(1);
		expect(toc[0]?.children[0]?.value).toBe('Level 2');
		expect(toc[0]?.children[0]?.children[0]?.value).toBe('Level 3');
	});

	it('handles multiple top-level headings', () => {
		const toc = buildNestedToc([h(1, 'First'), h(2, 'Sub A'), h(1, 'Second'), h(2, 'Sub B')]);
		expect(toc).toHaveLength(2);
		expect(toc[0]?.value).toBe('First');
		expect(toc[1]?.value).toBe('Second');
		expect(toc[0]?.children).toHaveLength(1);
		expect(toc[1]?.children).toHaveLength(1);
	});

	it('returns to a shallower level after a deep nest', () => {
		const toc = buildNestedToc([h(2, 'A'), h(3, 'A.1'), h(3, 'A.2'), h(2, 'B')]);
		expect(toc).toHaveLength(2);
		expect(toc[0]?.value).toBe('A');
		expect(toc[0]?.children.map((c) => c.value)).toEqual(['A.1', 'A.2']);
		expect(toc[1]?.value).toBe('B');
		expect(toc[1]?.children).toEqual([]);
	});

	it('carries the heading slug through for fragment links', () => {
		const toc = buildNestedToc([{ depth: 2, text: 'My Heading', slug: 'my-heading' }]);
		expect(toc[0]?.slug).toBe('my-heading');
	});
});
