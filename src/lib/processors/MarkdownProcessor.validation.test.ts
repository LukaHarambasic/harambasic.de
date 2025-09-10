import { expect, test, describe } from 'vitest';
import { processMarkdown, processMarkdownWithValidation } from './MarkdownProcessor';

describe('MarkdownProcessor with Validation', () => {
	const validMarkdown = `---
title: Test Post
description: This is a test post description that is long enough for validation
image: /test-image.jpg
tags:
  - test
  - validation
published: 2024-01-01T00:00:00.000Z
updated: 2024-01-01T00:00:00.000Z
---

# Test Post

This is test content for the post.`;

	const invalidMarkdown = `---
title: ""
description: short
image: ""
tags: []
published: invalid-date
updated: 2024-01-01T00:00:00.000Z
---

# Test Post

This is test content.`;

	describe('processMarkdown with validation', () => {
		test('should process valid markdown successfully', () => {
			const result = processMarkdown(validMarkdown, '/test/file.md');

			expect(result.title).toBe('Test Post');
			expect(result.description).toBe(
				'This is a test post description that is long enough for validation'
			);
			expect(result.tags).toEqual(['test', 'validation']);
			expect(result.html).toContain('Test Post');
		});

		test('should throw error for invalid markdown', () => {
			expect(() => {
				processMarkdown(invalidMarkdown, '/test/invalid.md');
			}).toThrow('Content validation failed');
		});

		test('should include validation context in error', () => {
			try {
				processMarkdown(invalidMarkdown, '/test/invalid.md');
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toContain('Content validation failed');
				expect((error as Error).name).toBe('MarkdownProcessingError');
			}
		});
	});

	describe('processMarkdownWithValidation', () => {
		test('should return comprehensive validation result for valid content', () => {
			const result = processMarkdownWithValidation(validMarkdown, '/test/file.md');

			expect(result.validation.isValid).toBe(true);
			expect(result.qualityIssues).toBeInstanceOf(Array);
			expect(result.html).toContain('Test Post');
			expect(result.frontmatter.title).toBe('Test Post');
		});

		test('should return validation failure for invalid content', () => {
			const result = processMarkdownWithValidation(invalidMarkdown, '/test/invalid.md');

			expect(result.validation.isValid).toBe(false);
			expect(result.validation.message).toContain('Validation failed');
			expect(result.qualityIssues).toBeInstanceOf(Array);
		});

		test('should detect content quality issues', () => {
			const markdownWithQualityIssues = `---
title: Test Post
description: Short description that is under 120 characters
image: /test-image.jpg
tags:
  - test
  - duplicate
  - duplicate
published: 2024-01-01T00:00:00.000Z
updated: 2024-01-01T00:00:00.000Z
---

# Test Post

This is content with some text and duplicate tags that should be detected by validation.

And some more content to make it longer than 100 characters.`;

			const result = processMarkdownWithValidation(markdownWithQualityIssues, '/test/quality.md');

			// Should have quality issues even if validation passes
			expect(result.qualityIssues.length).toBeGreaterThan(0);

			// Check for specific quality issues we know should be there
			expect(
				result.qualityIssues.some(
					(issue) =>
						issue.field === 'description' && issue.message.includes('shorter than recommended')
				)
			).toBe(true);

			expect(
				result.qualityIssues.some(
					(issue) => issue.field === 'tags' && issue.message.includes('Duplicate tags found')
				)
			).toBe(true);
		});

		test('should handle empty content', () => {
			const emptyMarkdown = `---
title: Empty Post
description: This is a post with minimal content that is long enough for validation
image: /test-image.jpg
tags:
  - test
published: 2024-01-01T00:00:00.000Z
updated: 2024-01-01T00:00:00.000Z
---

Short.`;

			const result = processMarkdownWithValidation(emptyMarkdown, '/test/empty.md');

			// Should detect very short content as quality issue
			expect(
				result.qualityIssues.some(
					(issue) => issue.field === 'html' && issue.message.includes('very short')
				)
			).toBe(true);
		});
	});

	describe('validation edge cases', () => {
		test('should handle missing frontmatter gracefully', () => {
			const noFrontmatter = `# Test Post

This is content without frontmatter.`;

			expect(() => {
				processMarkdown(noFrontmatter, '/test/no-frontmatter.md');
			}).toThrow('Content validation failed');
		});

		test('should handle malformed frontmatter', () => {
			const malformedFrontmatter = `---
title: Test Post
description: Test
invalid_yaml: [unclosed array
tags:
  - test
published: 2024-01-01T00:00:00.000Z
updated: 2024-01-01T00:00:00.000Z
---

# Test Post

Content here.`;

			// Should throw error during markdown processing
			expect(() => {
				processMarkdown(malformedFrontmatter, '/test/malformed.md');
			}).toThrow();
		});

		test('should validate date formats strictly', () => {
			const invalidDateMarkdown = `---
title: Test Post  
description: This is a test post description that is long enough for validation
image: /test-image.jpg
tags:
  - test
published: 2024-01-01
updated: not-a-date
---

# Test Post

Content here.`;

			expect(() => {
				processMarkdown(invalidDateMarkdown, '/test/invalid-date.md');
			}).toThrow('Content validation failed');
		});

		test('should accept both date formats', () => {
			const validDateMarkdown = `---
title: Test Post  
description: This is a test post description that is long enough for validation
image: /test-image.jpg
tags:
  - test
published: 2024-01-01
updated: 2024-01-01T00:00:00.000Z
---

# Test Post

Content here.`;

			// Should not throw with mixed date formats
			expect(() => {
				processMarkdown(validDateMarkdown, '/test/mixed-dates.md');
			}).not.toThrow();
		});

		test('should validate tag requirements', () => {
			const noTagsMarkdown = `---
title: Test Post
description: This is a test post description that is long enough
image: /test-image.jpg
tags: []
published: 2024-01-01T00:00:00.000Z
updated: 2024-01-01T00:00:00.000Z
---

# Test Post

Content here.`;

			expect(() => {
				processMarkdown(noTagsMarkdown, '/test/no-tags.md');
			}).toThrow('Content validation failed');
		});
	});
});
