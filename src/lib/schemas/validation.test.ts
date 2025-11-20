import { expect, test, describe } from 'vitest';
import { z } from 'zod';
import {
	validateRawEntry,
	validateEntryType,
	validateContentQuality,
	validateMarkdownStructure,
	formatValidationError,
	createValidationFailure,
	createValidationSuccess,
	generateValidationSummary
} from './validation';
import type { RawEntry } from './content';
import type { EntryType } from '../types/enums';

describe('Validation Utilities', () => {
	describe('validateRawEntry', () => {
		test('should validate correct raw entry structure', () => {
			const validRawEntry: RawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: 'Test Title',
				description: 'This is a test description that is long enough',
				image: '/test-image.jpg',
				tags: ['test'],
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
				openSource: false
			};

			const result = validateRawEntry(validRawEntry);

			expect(result.isValid).toBe(true);
			expect(result.data).toEqual(validRawEntry);
		});

		test('should fail validation for missing required fields', () => {
			const invalidRawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: '', // Empty title should fail
				description: 'Test',
				image: '/test-image.jpg',
				tags: [],
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z'
			};

			const result = validateRawEntry(invalidRawEntry);

			expect(result.isValid).toBe(false);
			expect(result.data).toBeUndefined();
			expect(result.message).toContain('Validation failed');
		});

		test('should fail validation for invalid date format', () => {
			const invalidRawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: 'Test Title',
				description: 'This is a test description that is long enough',
				image: '/test-image.jpg',
				tags: ['test'],
				published: 'invalid-date',
				updated: '2024-01-01T00:00:00.000Z'
			};

			const result = validateRawEntry(invalidRawEntry);

			expect(result.isValid).toBe(false);
			expect(result.message).toContain('Invalid published date format');
		});
	});

	describe('validateEntryType', () => {
		test('should validate correct entry types', () => {
			expect(validateEntryType('post')).toBe(true);
			expect(validateEntryType('project')).toBe(true);
			expect(validateEntryType('uses')).toBe(true);
			expect(validateEntryType('shareable')).toBe(true);
		});

		test('should reject invalid entry types', () => {
			expect(validateEntryType('invalid')).toBe(false);
			expect(validateEntryType('')).toBe(false);
			expect(validateEntryType(null)).toBe(false);
			expect(validateEntryType(123)).toBe(false);
		});
	});

	describe('validateContentQuality', () => {
		test('should warn about short descriptions', () => {
			const rawEntry: RawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: 'Test Title',
				description: 'Short', // Too short for SEO
				image: '/test-image.jpg',
				tags: ['test'],
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
				openSource: false
			};

			const issues = validateContentQuality(rawEntry);

			expect(issues).toHaveLength(1);
			expect(issues[0].type).toBe('warning');
			expect(issues[0].field).toBe('description');
			expect(issues[0].message).toContain('shorter than recommended');
		});

		test('should warn about long descriptions', () => {
			const longDescription = 'a'.repeat(200);
			const rawEntry: RawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: 'Test Title',
				description: longDescription,
				image: '/test-image.jpg',
				tags: ['test'],
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
				openSource: false
			};

			const issues = validateContentQuality(rawEntry);

			expect(
				issues.some(
					(issue) =>
						issue.field === 'description' && issue.message.includes('exceeds SEO recommendation')
				)
			).toBe(true);
		});

		test('should detect duplicate tags', () => {
			const rawEntry: RawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: 'Test Title',
				description: 'This is a test description that is long enough',
				image: '/test-image.jpg',
				tags: ['test', 'duplicate', 'duplicate'],
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
				openSource: false
			};

			const issues = validateContentQuality(rawEntry);

			expect(
				issues.some(
					(issue) =>
						issue.field === 'tags' &&
						issue.type === 'error' &&
						issue.message.includes('Duplicate tags')
				)
			).toBe(true);
		});

		test('should validate URLs', () => {
			const rawEntry: RawEntry = {
				html: '<p>Test content</p>',
				toc: [],
				title: 'Test Title',
				description: 'This is a test description that is long enough',
				image: '/test-image.jpg',
				tags: ['test'],
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-01T00:00:00.000Z',
				url: 'invalid-url',
				openSource: false
			};

			const issues = validateContentQuality(rawEntry);

			expect(
				issues.some(
					(issue) =>
						issue.field === 'url' &&
						issue.type === 'error' &&
						issue.message.includes('URL format is invalid')
				)
			).toBe(true);
		});
	});

	describe('validateMarkdownStructure', () => {
		test('should detect empty content', () => {
			const issues = validateMarkdownStructure('');

			expect(issues).toHaveLength(1);
			expect(issues[0].type).toBe('error');
			expect(issues[0].field).toBe('html');
			expect(issues[0].message).toBe('Content is empty');
		});

		test('should warn about very short content', () => {
			const issues = validateMarkdownStructure('<p>Short</p>');

			expect(
				issues.some(
					(issue) =>
						issue.type === 'warning' &&
						issue.field === 'html' &&
						issue.message.includes('very short')
				)
			).toBe(true);
		});

		test('should detect images without alt attributes', () => {
			const htmlWithImagesNoAlt = '<p>Test</p><img src="test.jpg"><img src="test2.jpg">';

			const issues = validateMarkdownStructure(htmlWithImagesNoAlt);

			expect(
				issues.some(
					(issue) =>
						issue.field === 'html' &&
						issue.message.includes('image(s) found without alt attributes')
				)
			).toBe(true);
		});

		test('should pass for content with proper alt attributes', () => {
			const htmlWithAlt =
				'<p>Test content with proper images</p><img src="test.jpg" alt="Test image"><img src="test2.jpg" alt="Another test image">';

			const issues = validateMarkdownStructure(htmlWithAlt);

			// Should not have alt-related issues
			expect(issues.every((issue) => !issue.message.includes('without alt attributes'))).toBe(true);
		});
	});

	describe('formatValidationError', () => {
		test('should format Zod errors properly', () => {
			const schema = z.object({
				title: z.string().min(1, 'Title is required'),
				description: z.string().min(10, 'Description too short')
			});

			const result = schema.safeParse({
				title: '',
				description: 'short'
			});

			expect(result.success).toBe(false);

			if (!result.success) {
				const formatted = formatValidationError(result.error, '/test/file.md');

				expect(formatted).toHaveLength(2);
				expect(formatted[0]).toMatchObject({
					file: '/test/file.md',
					field: 'title',
					message: 'Title is required'
				});
				expect(formatted[1]).toMatchObject({
					file: '/test/file.md',
					field: 'description',
					message: 'Description too short'
				});
			}
		});
	});

	describe('createValidationFailure', () => {
		test('should create proper failure result', () => {
			const schema = z.object({
				title: z.string().min(1, 'Title is required')
			});

			const result = schema.safeParse({ title: '' });

			expect(result.success).toBe(false);

			if (!result.success) {
				const failure = createValidationFailure('post', result.error, 'test-slug', '/test/file.md');

				expect(failure.isValid).toBe(false);
				expect(failure.entryType).toBe('post');
				expect(failure.slug).toBe('test-slug');
				expect(failure.message).toContain('Validation failed for post');
				expect(failure.details).toContain('Title is required');
			}
		});
	});

	describe('createValidationSuccess', () => {
		test('should create proper success result', () => {
			const success = createValidationSuccess('project', 'test-slug');

			expect(success.isValid).toBe(true);
			expect(success.entryType).toBe('project');
			expect(success.slug).toBe('test-slug');
			expect(success.message).toBe('project validated successfully');
		});
	});

	describe('generateValidationSummary', () => {
		test('should generate proper summary', () => {
			const results = [
				{ entryType: 'post' as EntryType, isValid: true },
				{ entryType: 'post' as EntryType, isValid: false, message: 'Error 1' },
				{ entryType: 'project' as EntryType, isValid: true },
				{ entryType: 'project' as EntryType, isValid: true }
			];

			const summary = generateValidationSummary(results);

			expect(summary.total).toBe(4);
			expect(summary.passed).toBe(3);
			expect(summary.failed).toBe(1);
			expect(summary.successRate).toBe(75);
			expect(summary.errors).toHaveLength(1);
			expect(summary.errors[0].message).toBe('Error 1');
		});

		test('should handle empty results', () => {
			const summary = generateValidationSummary([]);

			expect(summary.total).toBe(0);
			expect(summary.passed).toBe(0);
			expect(summary.failed).toBe(0);
			expect(summary.successRate).toBe(0);
			expect(summary.errors).toHaveLength(0);
		});
	});
});
