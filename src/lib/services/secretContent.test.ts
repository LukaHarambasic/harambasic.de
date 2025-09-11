import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	decryptSecretContent,
	extractContentMetadata,
	processContentList,
	extractSlugFromFilename,
	validateSecretContent,
	getContentErrorMessage,
	sanitizeContent
} from './secretContent';
import type { EncryptedData } from '$lib/util/encryption';

// Mock the encryption utility
vi.mock('$lib/util/encryption', () => ({
	decryptData: vi.fn()
}));

import { decryptData } from '$lib/util/encryption';

describe('decryptSecretContent', () => {
	const mockEncryptedData: EncryptedData = {
		data: 'encrypted_content',
		iv: 'mock_iv',
		salt: 'mock_salt',
		algorithm: 'AES-GCM',
		iterations: 100000
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should decrypt and parse markdown content successfully', async () => {
		const markdownContent = `---
title: Secret Document
published: 2024-01-01
tags: ["secret", "important"]
---

# Secret Content

This is the secret content body.`;

		vi.mocked(decryptData).mockResolvedValue(markdownContent);

		const result = await decryptSecretContent(mockEncryptedData, 'password', 'secret-doc');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.title).toBe('Secret Document');
			expect(result.data.slug).toBe('secret-doc');
			expect(result.data.content).toBe('# Secret Content\n\nThis is the secret content body.');
			expect(result.data.published).toEqual(new Date('2024-01-01'));
			expect(result.data.tags).toEqual(['secret', 'important']);
		}
	});

	it('should handle content without front matter', async () => {
		const plainContent = '# Simple Content\n\nJust plain markdown.';

		vi.mocked(decryptData).mockResolvedValue(plainContent);

		const result = await decryptSecretContent(mockEncryptedData, 'password', 'simple-doc');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.title).toBe('simple doc'); // Generated from slug
			expect(result.data.content).toBe(plainContent);
			expect(result.data.published).toBeInstanceOf(Date);
			expect(result.data.tags).toBeUndefined();
		}
	});

	it('should handle decryption failure', async () => {
		vi.mocked(decryptData).mockRejectedValue(new Error('Decryption failed'));

		const result = await decryptSecretContent(mockEncryptedData, 'wrong_password', 'doc');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('DECRYPTION_FAILED');
		}
	});

	it('should handle invalid encrypted data format', async () => {
		const invalidData = { not: 'valid' } as any;

		const result = await decryptSecretContent(invalidData, 'password', 'doc');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('INVALID_FORMAT');
		}
	});

	it('should parse complex front matter correctly', async () => {
		const complexContent = `---
title: "Complex Document"
published: 2024-01-01T10:00:00Z
updated: 2024-01-02T15:30:00Z
tags: ["tag1", "tag2", "tag3"]
author: 'John Doe'
priority: 1
---

Content here`;

		vi.mocked(decryptData).mockResolvedValue(complexContent);

		const result = await decryptSecretContent(mockEncryptedData, 'password', 'complex-doc');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.title).toBe('Complex Document');
			expect(result.data.published).toEqual(new Date('2024-01-01T10:00:00Z'));
			expect(result.data.updated).toEqual(new Date('2024-01-02T15:30:00Z'));
			expect(result.data.tags).toEqual(['tag1', 'tag2', 'tag3']);
		}
	});
});

describe('extractContentMetadata', () => {
	const mockEncryptedData: EncryptedData = {
		data: 'encrypted_content',
		iv: 'mock_iv',
		salt: 'mock_salt',
		algorithm: 'AES-GCM',
		iterations: 100000
	};

	it('should extract metadata without full content processing', async () => {
		const markdownContent = `---
title: Metadata Test
published: 2024-01-01
tags: ["meta", "test"]
---

This is a long content that we don't need for metadata extraction.
Lorem ipsum dolor sit amet...`;

		vi.mocked(decryptData).mockResolvedValue(markdownContent);

		const result = await extractContentMetadata(mockEncryptedData, 'password', 'meta-test');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.title).toBe('Metadata Test');
			expect(result.data.slug).toBe('meta-test');
			expect(result.data.published).toEqual(new Date('2024-01-01'));
			expect(result.data.tags).toEqual(['meta', 'test']);
			// Should not include the full content
			expect('content' in result.data).toBe(false);
		}
	});

	it('should handle metadata extraction failure', async () => {
		vi.mocked(decryptData).mockRejectedValue(new Error('Failed'));

		const result = await extractContentMetadata(mockEncryptedData, 'password', 'doc');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('DECRYPTION_FAILED');
		}
	});
});

describe('processContentList', () => {
	const mockEncryptedContents = [
		{
			slug: 'doc1',
			data: {
				data: 'encrypted1',
				iv: 'iv1',
				salt: 'salt1',
				algorithm: 'AES-GCM',
				iterations: 100000
			}
		},
		{
			slug: 'doc2',
			data: {
				data: 'encrypted2',
				iv: 'iv2',
				salt: 'salt2',
				algorithm: 'AES-GCM',
				iterations: 100000
			}
		}
	];

	it('should process multiple content files and sort by date', async () => {
		vi.mocked(decryptData).mockResolvedValueOnce(`---
title: First Doc
published: 2024-01-02
---
Content 1`).mockResolvedValueOnce(`---
title: Second Doc
published: 2024-01-01
---
Content 2`);

		const result = await processContentList(mockEncryptedContents, 'password');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toHaveLength(2);
			// Should be sorted by published date (newest first)
			expect(result.data[0].title).toBe('First Doc');
			expect(result.data[1].title).toBe('Second Doc');
		}
	});

	it('should handle partial failures gracefully', async () => {
		vi.mocked(decryptData)
			.mockResolvedValueOnce(
				`---
title: Valid Doc
published: 2024-01-01
---
Content`
			)
			.mockRejectedValueOnce(new Error('Decryption failed'));

		const result = await processContentList(mockEncryptedContents, 'password');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toHaveLength(1);
			expect(result.data[0].title).toBe('Valid Doc');
		}
	});

	it('should handle complete failure', async () => {
		vi.mocked(decryptData).mockRejectedValue(new Error('Complete failure'));

		const result = await processContentList(mockEncryptedContents, 'password');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('DECRYPTION_FAILED');
		}
	});
});

describe('extractSlugFromFilename', () => {
	it('should extract slug from various filename formats', () => {
		expect(extractSlugFromFilename('my-document.secret.md')).toBe('my-document');
		expect(extractSlugFromFilename('users.secret.json')).toBe('users');
		expect(extractSlugFromFilename('complex-file-name.encrypted')).toBe('complex-file-name');
		expect(extractSlugFromFilename('Simple Title.secret.md')).toBe('simple-title');
	});

	it('should handle edge cases', () => {
		expect(extractSlugFromFilename('single.secret.md')).toBe('single');
		expect(extractSlugFromFilename('NO-EXTENSION')).toBe('no-extension');
		expect(extractSlugFromFilename('')).toBe('');
	});
});

describe('validateSecretContent', () => {
	it('should validate correct secret content structure', () => {
		const validContent = {
			slug: 'test-slug',
			title: 'Test Title',
			content: 'Test content',
			published: new Date(),
			updated: new Date(),
			tags: ['tag1', 'tag2']
		};

		expect(validateSecretContent(validContent)).toBe(true);
	});

	it('should validate minimal required fields', () => {
		const minimalContent = {
			slug: 'test',
			title: 'Title',
			content: 'Content',
			published: new Date()
		};

		expect(validateSecretContent(minimalContent)).toBe(true);
	});

	it('should reject invalid content structures', () => {
		expect(validateSecretContent(null)).toBe(false);
		expect(validateSecretContent(undefined)).toBe(false);
		expect(validateSecretContent('not an object')).toBe(false);
		expect(validateSecretContent({})).toBe(false);

		// Missing required fields
		expect(
			validateSecretContent({
				title: 'Title',
				content: 'Content',
				published: new Date()
			})
		).toBe(false);

		// Wrong field types
		expect(
			validateSecretContent({
				slug: 'test',
				title: 'Title',
				content: 'Content',
				published: 'not a date'
			})
		).toBe(false);

		// Empty required fields
		expect(
			validateSecretContent({
				slug: '',
				title: 'Title',
				content: 'Content',
				published: new Date()
			})
		).toBe(false);
	});
});

describe('getContentErrorMessage', () => {
	it('should return appropriate error messages', () => {
		expect(getContentErrorMessage('CONTENT_NOT_FOUND')).toContain('could not be found');
		expect(getContentErrorMessage('DECRYPTION_FAILED')).toContain('decrypt content');
		expect(getContentErrorMessage('INVALID_FORMAT')).toContain('invalid or corrupted');
		expect(getContentErrorMessage('ACCESS_DENIED')).toContain('permission');
	});

	it('should return generic message for unknown errors', () => {
		expect(getContentErrorMessage('UNKNOWN_ERROR' as any)).toContain('error occurred');
	});
});

describe('sanitizeContent', () => {
	it('should remove dangerous HTML elements', () => {
		const maliciousContent = `
			<script>alert('xss')</script>
			<iframe src="evil.com"></iframe>
			<p>Safe content</p>
			<a href="javascript:alert('xss')">Bad link</a>
			<div onclick="alert('xss')">Bad div</div>
		`;

		const sanitized = sanitizeContent(maliciousContent);

		expect(sanitized).not.toContain('<script>');
		expect(sanitized).not.toContain('<iframe>');
		expect(sanitized).not.toContain('javascript:');
		expect(sanitized).not.toContain('onclick=');
		expect(sanitized).toContain('<p>Safe content</p>');
	});

	it('should handle various XSS vectors', () => {
		const vectors = [
			'<script type="text/javascript">alert("xss")</script>',
			'<SCRIPT>alert("xss")</SCRIPT>',
			'<iframe src="data:text/html,<script>alert(1)</script>"></iframe>',
			'<a href="javascript:void(0)">Click</a>',
			'<div onload="alert(1)">Content</div>',
			'<img onerror="alert(1)" src="x">'
		];

		vectors.forEach((vector) => {
			const sanitized = sanitizeContent(vector);
			expect(sanitized).not.toContain('alert');
			expect(sanitized).not.toContain('javascript:');
			expect(sanitized).not.toMatch(/on\w+\s*=/i);
		});
	});

	it('should preserve safe content', () => {
		const safeContent = `
			<h1>Title</h1>
			<p>Paragraph with <strong>bold</strong> text</p>
			<ul>
				<li>List item</li>
			</ul>
			<a href="https://example.com">Safe link</a>
		`;

		const sanitized = sanitizeContent(safeContent);

		expect(sanitized).toContain('<h1>Title</h1>');
		expect(sanitized).toContain('<strong>bold</strong>');
		expect(sanitized).toContain('<ul>');
		expect(sanitized).toContain('https://example.com');
	});
});
