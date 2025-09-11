/**
 * Tests for content utility functions
 * Testing pure functions with predictable inputs/outputs
 */

import { describe, it, expect } from 'vitest';
import {
	generateSlug,
	formatContentDate,
	normalizeTags,
	getContentDirectory,
	generateFilePath,
	getStaticDirectory,
	validateContentMetadata,
	escapeYamlString
} from './util.js';

describe('generateSlug', () => {
	it('should generate a slug from a simple title', () => {
		expect(generateSlug('My Blog Post')).toBe('my-blog-post');
	});

	it('should handle special characters', () => {
		expect(generateSlug('Hello, World! (2024)')).toBe('hello-world-2024');
	});

	it('should handle multiple spaces', () => {
		expect(generateSlug('Multiple   Spaces    Here')).toBe('multiple-spaces-here');
	});

	it('should handle leading and trailing spaces', () => {
		expect(generateSlug('  Trim Me  ')).toBe('trim-me');
	});

	it('should handle empty string', () => {
		expect(generateSlug('')).toBe('');
	});

	it('should handle null/undefined', () => {
		expect(generateSlug(null)).toBe('');
		expect(generateSlug(undefined)).toBe('');
	});

	it('should handle non-string input', () => {
		expect(generateSlug(123)).toBe('');
		expect(generateSlug({})).toBe('');
	});

	it('should remove leading and trailing dashes', () => {
		expect(generateSlug('!@#Title!@#')).toBe('title');
	});
});

describe('formatContentDate', () => {
	it('should format a date to YYYY-MM-DD', () => {
		const date = new Date('2024-03-15T10:30:00Z');
		expect(formatContentDate(date)).toBe('2024-03-15');
	});

	it('should use current date when no date provided', () => {
		const result = formatContentDate();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('should handle invalid date', () => {
		const result = formatContentDate(new Date('invalid'));
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('should handle null/undefined', () => {
		expect(formatContentDate(null)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(formatContentDate(undefined)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});
});

describe('normalizeTags', () => {
	it('should normalize array of tags', () => {
		expect(normalizeTags(['javascript', 'react', 'testing']))
			.toEqual(['Javascript', 'React', 'Testing']);
	});

	it('should normalize comma-separated string', () => {
		expect(normalizeTags('javascript, react, testing'))
			.toEqual(['Javascript', 'React', 'Testing']);
	});

	it('should handle mixed case and whitespace', () => {
		expect(normalizeTags('  javaScript  ,   REACT   ,testing'))
			.toEqual(['JavaScript', 'REACT', 'Testing']);
	});

	it('should filter out empty tags', () => {
		expect(normalizeTags(['javascript', '', 'react', '   ', 'testing']))
			.toEqual(['Javascript', 'React', 'Testing']);
	});

	it('should handle empty input', () => {
		expect(normalizeTags(null)).toEqual([]);
		expect(normalizeTags(undefined)).toEqual([]);
		expect(normalizeTags('')).toEqual([]);
		expect(normalizeTags([])).toEqual([]);
	});

	it('should handle non-string array elements', () => {
		expect(normalizeTags(['javascript', 123, 'react', null, 'testing']))
			.toEqual(['Javascript', 'React', 'Testing']);
	});

	it('should handle invalid input types', () => {
		expect(normalizeTags(123)).toEqual([]);
		expect(normalizeTags({})).toEqual([]);
	});
});

describe('getContentDirectory', () => {
	it('should return correct directory for posts', () => {
		expect(getContentDirectory('post')).toBe('src/content/posts');
	});

	it('should return correct directory for projects', () => {
		expect(getContentDirectory('project')).toBe('src/content/projects');
	});

	it('should return correct directory for uses', () => {
		expect(getContentDirectory('uses')).toBe('src/content/uses');
	});

	it('should return correct directory for shareables', () => {
		expect(getContentDirectory('shareable')).toBe('src/content/shareables');
	});

	it('should return correct directory for snippets', () => {
		expect(getContentDirectory('snippet')).toBe('src/content/snippets');
	});

	it('should throw error for unknown content type', () => {
		expect(() => getContentDirectory('unknown')).toThrow('Unknown content type: unknown');
	});
});

describe('generateFilePath', () => {
	it('should generate correct file path for posts', () => {
		expect(generateFilePath('post', 'My Blog Post'))
			.toBe('src/content/posts/my-blog-post.md');
	});

	it('should generate correct file path for projects', () => {
		expect(generateFilePath('project', 'My Cool Project'))
			.toBe('src/content/projects/my-cool-project.md');
	});

	it('should handle special characters in title', () => {
		expect(generateFilePath('post', 'Hello, World! (2024)'))
			.toBe('src/content/posts/hello-world-2024.md');
	});
});

describe('getStaticDirectory', () => {
	it('should return correct static directory for posts', () => {
		expect(getStaticDirectory('post')).toBe('static/posts');
	});

	it('should return correct static directory for projects', () => {
		expect(getStaticDirectory('project')).toBe('static/projects');
	});

	it('should return correct static directory for uses', () => {
		expect(getStaticDirectory('uses')).toBe('static/uses');
	});

	it('should return default static directory for unknown types', () => {
		expect(getStaticDirectory('unknown')).toBe('static');
	});
});

describe('validateContentMetadata', () => {
	const validMetadata = {
		title: 'Valid Title',
		description: 'This is a valid description that is long enough.',
		tags: ['Tag1', 'Tag2']
	};

	it('should validate correct metadata', () => {
		const result = validateContentMetadata(validMetadata);
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should invalidate missing title', () => {
		const metadata = { ...validMetadata, title: '' };
		const result = validateContentMetadata(metadata);
		expect(result.valid).toBe(false);
		expect(result.errors[0].field).toBe('title');
	});

	it('should invalidate short title', () => {
		const metadata = { ...validMetadata, title: 'Hi' };
		const result = validateContentMetadata(metadata);
		expect(result.valid).toBe(false);
		expect(result.errors[0].field).toBe('title');
	});

	it('should invalidate missing description', () => {
		const metadata = { ...validMetadata, description: '' };
		const result = validateContentMetadata(metadata);
		expect(result.valid).toBe(false);
		expect(result.errors[0].field).toBe('description');
	});

	it('should invalidate short description', () => {
		const metadata = { ...validMetadata, description: 'Too short' };
		const result = validateContentMetadata(metadata);
		expect(result.valid).toBe(false);
		expect(result.errors[0].field).toBe('description');
	});

	it('should handle invalid tags', () => {
		const metadata = { ...validMetadata, tags: 123 };
		const result = validateContentMetadata(metadata);
		expect(result.valid).toBe(false);
		expect(result.errors[0].field).toBe('tags');
	});

	it('should handle null metadata', () => {
		const result = validateContentMetadata(null);
		expect(result.valid).toBe(false);
	});
});

describe('escapeYamlString', () => {
	it('should not escape simple strings', () => {
		expect(escapeYamlString('simple')).toBe('simple');
	});

	it('should escape strings with special characters', () => {
		expect(escapeYamlString('Hello: World')).toBe('"Hello: World"');
		expect(escapeYamlString('Hello "World"')).toBe('"Hello \\"World\\""');
	});

	it('should escape strings with leading/trailing spaces', () => {
		expect(escapeYamlString(' leading')).toBe('" leading"');
		expect(escapeYamlString('trailing ')).toBe('"trailing "');
	});

	it('should handle non-string input', () => {
		expect(escapeYamlString(123)).toBe(123);
		expect(escapeYamlString(null)).toBe(null);
		expect(escapeYamlString(undefined)).toBe(undefined);
	});

	it('should escape strings with YAML special characters', () => {
		const specialChars = [':', '"', "'", '#', '@', '&', '*', '!', '|', '>', '%', '{', '}', '[', ']', '`', ',', '\\'];
		
		specialChars.forEach(char => {
			const testString = `test${char}string`;
			const result = escapeYamlString(testString);
			expect(result).toMatch(/^"/); // Should start with quote
			expect(result).toMatch(/"$/); // Should end with quote
		});
	});
});