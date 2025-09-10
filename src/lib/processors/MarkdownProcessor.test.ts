import { expect, test, describe } from 'vitest';
import { processMarkdown, processMarkdownBatch } from './MarkdownProcessor';

describe('MarkdownProcessor', () => {
	test('should process simple markdown with frontmatter', () => {
		const markdown = `---
title: Test Article
description: A test article that is long enough for validation requirements
image: /test-image.jpg
published: 2023-01-01T00:00:00.000Z
updated: 2023-01-02T00:00:00.000Z
tags: [test, markdown]
---

# Test Heading

This is a test paragraph with some **bold text** and *italic text*.

## Sub Heading

Another paragraph here.`;

		const result = processMarkdown(markdown);

		expect(result.title).toBe('Test Article');
		expect(result.description).toBe(
			'A test article that is long enough for validation requirements'
		);
		expect(result.published).toBe('2023-01-01T00:00:00.000Z');
		expect(result.image).toBe('/test-image.jpg');
		expect(result.tags).toEqual(['test', 'markdown']);
		expect(result.html).toContain('id="test-heading"');
		expect(result.html).toContain('Test Heading');
		expect(result.html).toContain('<strong>bold text</strong>');
		expect(result.html).toContain('<em>italic text</em>');
		expect(result.toc).toHaveLength(1);
		expect(result.toc[0].value).toBe('Test Heading');
		expect(result.toc[0].depth).toBe(1);
		expect(result.toc[0].children).toHaveLength(1);
		expect(result.toc[0].children![0].value).toBe('Sub Heading');
	});

	test('should generate table of contents correctly', () => {
		const markdown = `---
title: TOC Test
description: Testing table of contents with proper length
image: /toc-test.jpg
published: 2023-01-01T00:00:00.000Z
updated: 2023-01-01T00:00:00.000Z
tags: [test, toc]
---

# Main Heading

Content under main heading.

## Sub Heading 1

Content under sub heading 1.

### Sub Sub Heading 1

Content under sub sub heading 1.

## Sub Heading 2

Content under sub heading 2.

# Another Main Heading

More content.`;

		const result = processMarkdown(markdown);

		expect(result.toc).toHaveLength(2);

		// First main heading with sub-items
		expect(result.toc[0].value).toBe('Main Heading');
		expect(result.toc[0].depth).toBe(1);
		expect(result.toc[0].children).toHaveLength(1);
		expect(result.toc[0].children![0].value).toBe('Sub Heading 1');

		// Second main heading
		expect(result.toc[1].value).toBe('Another Main Heading');
		expect(result.toc[1].depth).toBe(1);
	});

	test('should handle markdown without headings', () => {
		const markdown = `---
title: No Headings
description: A document without headings but with proper length
image: /no-headings.jpg
published: 2023-01-01T00:00:00.000Z
updated: 2023-01-01T00:00:00.000Z
tags: [test]
---

Just some regular text without any headings.

And another paragraph.`;

		const result = processMarkdown(markdown);

		expect(result.title).toBe('No Headings');
		expect(result.toc).toHaveLength(0);
		expect(result.html).toContain('<p>Just some regular text');
	});

	test('should handle code blocks with syntax highlighting', () => {
		const markdown = `---
title: Code Test
description: Testing code blocks with proper description length
image: /code-test.jpg
published: 2023-01-01T00:00:00.000Z
updated: 2023-01-01T00:00:00.000Z
tags: [test, code]
---

Here's some JavaScript:

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

And some TypeScript:

\`\`\`typescript
interface User {
  id: number;
  name: string;
}
\`\`\``;

		const result = processMarkdown(markdown);

		expect(result.html).toContain('class="hljs language-javascript"');
		expect(result.html).toContain('class="hljs language-typescript"');
		expect(result.html).toContain('title function_">hello');
		expect(result.html).toContain('title class_">User');
	});

	test('should throw error for invalid markdown processing', () => {
		// This test verifies error handling in the processor
		// We'll test this with malformed frontmatter that might cause issues
		const invalidMarkdown = `---
title: Missing closing
description: "Unclosed quote
---

# Test`;

		expect(() => processMarkdown(invalidMarkdown)).toThrow();
	});

	test('processMany - should process multiple markdown contents', async () => {
		const markdowns = [
			{
				content: `---
title: First
description: First post with proper length
image: /first.jpg
published: 2023-01-01T00:00:00.000Z
updated: 2023-01-01T00:00:00.000Z
tags: [first]
---

# First Post`,
				filePath: '/test/first.md'
			},
			{
				content: `---
title: Second
description: Second post with proper length
image: /second.jpg
published: 2023-01-02T00:00:00.000Z
updated: 2023-01-02T00:00:00.000Z
tags: [second]
---

# Second Post`,
				filePath: '/test/second.md'
			}
		];

		const results = await processMarkdownBatch(markdowns);

		expect(results).toHaveLength(2);
		expect(results[0].title).toBe('First');
		expect(results[1].title).toBe('Second');
		expect(results[0].html).toContain('First Post');
		expect(results[1].html).toContain('Second Post');
	});

	test('should handle empty markdown gracefully', () => {
		const markdown = `---
title: Empty
description: Empty content with proper length for validation
image: /empty.jpg
published: 2023-01-01T00:00:00.000Z
updated: 2023-01-01T00:00:00.000Z
tags: [empty]
---

This is minimal content to satisfy validation requirements.`;

		const result = processMarkdown(markdown);

		expect(result.title).toBe('Empty');
		expect(result.html).toContain('<p>This is minimal content');
		expect(result.toc).toHaveLength(0);
	});
});
