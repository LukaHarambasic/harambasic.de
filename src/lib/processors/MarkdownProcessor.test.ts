import { describe, it, expect, beforeEach } from 'vitest';
import { RemarkRehypeProcessor } from './RemarkRehypeProcessor';
import { ProcessorConfigBuilder } from './ProcessorConfig';
import type { MarkdownProcessor } from './MarkdownProcessor';

describe('RemarkRehypeProcessor', () => {
	let processor: MarkdownProcessor;

	beforeEach(() => {
		processor = new RemarkRehypeProcessor(ProcessorConfigBuilder.testing());
	});

	describe('Basic Markdown Processing', () => {
		it('should process simple markdown with frontmatter', () => {
			const markdown = `---
title: Test Post
description: A test post
image: test.jpg
tags: [typescript, testing]
published: 2024-01-01
updated: 2024-01-01
---

# Hello World

This is a test post with **bold** text.`;

			const result = processor.processSync(markdown);

			expect(result.frontmatter.title).toBe('Test Post');
			expect(result.frontmatter.description).toBe('A test post');
			expect(result.frontmatter.tags).toEqual(['typescript', 'testing']);
			expect(result.html).toContain('id="hello-world"');
			expect(result.html).toContain('Hello World');
			expect(result.html).toContain('<strong>bold</strong>');
		});

		it('should handle markdown without frontmatter', () => {
			const markdown = `# Simple Heading

Just some content.`;

			const result = processor.processSync(markdown);

			expect(result.frontmatter).toEqual({});
			expect(result.html).toContain('id="simple-heading"');
			expect(result.html).toContain('Simple Heading');
		});
	});

	describe('Table of Contents Generation', () => {
		it('should generate nested TOC correctly', () => {
			const markdown = `---
title: TOC Test
description: Test
image: test.jpg
tags: [test]
published: 2024-01-01
updated: 2024-01-01
---

# Level 1
Content for level 1

## Level 2A
Content for level 2A

### Level 3
Content for level 3

## Level 2B
Content for level 2B`;

			const result = processor.processSync(markdown);

			expect(result.toc).toHaveLength(1);
			expect(result.toc[0].value).toBe('Level 1');
			expect(result.toc[0].depth).toBe(1);
			expect(result.toc[0].children).toHaveLength(2);
			expect(result.toc[0].children![0].value).toBe('Level 2A');
			expect(result.toc[0].children![0].children).toHaveLength(1);
			expect(result.toc[0].children![0].children![0].value).toBe('Level 3');
		});

		it('should respect maxDepth configuration', () => {
			const processorWithLimit = new RemarkRehypeProcessor({
				toc: { maxDepth: 2 }
			});

			const markdown = `# H1
## H2
### H3
#### H4`;

			const result = processorWithLimit.processSync(markdown);

			// Should only include H1 and H2
			expect(result.toc).toHaveLength(1);
			expect(result.toc[0].children).toHaveLength(1);
			expect(result.toc[0].children![0].depth).toBe(2);
		});
	});

	describe('Metadata Extraction', () => {
		it('should calculate word count and reading time', () => {
			const markdown = `---
title: Test
description: Test
image: test.jpg
tags: [test]
published: 2024-01-01
updated: 2024-01-01
---

# Test Article

This is a test article with multiple words to test the word counting functionality. 
It should calculate an approximate reading time based on the standard 200 words per minute.

Here is more content to increase the word count and make the reading time calculation more meaningful.`;

			const result = processor.processSync(markdown);

			expect(result.metadata.wordCount).toBeGreaterThan(30);
			expect(result.metadata.readingTime).toBe(1); // Should be 1 minute for ~40 words
			expect(result.metadata.headingCount).toBe(1);
			expect(result.metadata.characterCount).toBeGreaterThan(100);
		});

		it('should count headings correctly', () => {
			const markdown = `# Heading 1
## Heading 2
### Heading 3
## Another H2
Text content`;

			const result = processor.processSync(markdown);

			expect(result.metadata.headingCount).toBe(4);
		});
	});

	describe('HTML Processing', () => {
		it('should add IDs to headings', () => {
			const markdown = `# My Great Heading
## Another Heading With Spaces`;

			const result = processor.processSync(markdown);

			expect(result.html).toContain('id="my-great-heading"');
			expect(result.html).toContain('id="another-heading-with-spaces"');
		});

		it('should add autolink to headings', () => {
			const markdown = `# Test Heading`;

			const result = processor.processSync(markdown);

			// Should contain a link element
			expect(result.html).toContain('<a');
			expect(result.html).toContain('href="#test-heading"');
		});

		it('should highlight code blocks', () => {
			const markdown = `\`\`\`javascript
console.log('Hello, world!');
\`\`\``;

			const result = processor.processSync(markdown);

			expect(result.html).toContain('<pre><code class="hljs language-javascript">');
			expect(result.html).toContain('console');
			expect(result.html).toContain('log');
		});
	});

	describe('Error Handling', () => {
		it('should handle malformed frontmatter gracefully', () => {
			const markdown = `---
title: Test
---

# Content`;

			// Should not throw for valid frontmatter
			expect(() => processor.processSync(markdown)).not.toThrow();
		});

		it('should handle empty content', () => {
			const result = processor.processSync('');

			expect(result.html).toBe('');
			expect(result.frontmatter).toEqual({});
			expect(result.toc).toEqual([]);
			expect(result.metadata.wordCount).toBe(0);
		});
	});

	describe('Async Processing', () => {
		it('should process content asynchronously', async () => {
			const markdown = `---
title: Async Test
description: Test
image: test.jpg
tags: [test]
published: 2024-01-01
updated: 2024-01-01
---

# Async Processing Test`;

			const result = await processor.process(markdown);

			expect(result.frontmatter.title).toBe('Async Test');
			expect(result.html).toContain('<h1 id="async-processing-test">');
		});
	});
});
