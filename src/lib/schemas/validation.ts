import { z } from 'zod';
import type {
	EntryType,
	RawEntry,
	Entry,
	ValidationResult,
	ValidationErrorDetail
} from './content';
import { RawEntrySchema, getSchemaForType, EntryTypeSchema } from './content';

/**
 * Validation utilities for content using Zod schemas
 *
 * These pure functions provide comprehensive validation capabilities
 * following the project's functional programming principles.
 */

// ===== VALIDATION ERROR FORMATTING =====

/**
 * Format Zod validation errors into structured error details
 */
export function formatValidationError(
	error: z.ZodError,
	filePath?: string
): ValidationErrorDetail[] {
	return error.issues.map((issue) => ({
		file: filePath || 'unknown',
		field: issue.path.join('.'),
		message: issue.message,
		received: 'received' in issue ? issue.received : undefined,
		expected: 'expected' in issue ? String(issue.expected) : undefined
	}));
}

/**
 * Create a formatted validation result for failed validation
 */
export function createValidationFailure(
	entryType: EntryType,
	error: z.ZodError,
	slug?: string,
	filePath?: string
): ValidationResult {
	const details = formatValidationError(error, filePath);
	const primaryError = details[0];

	return {
		entryType,
		slug,
		isValid: false,
		message: `Validation failed for ${entryType}: ${primaryError?.message || 'Unknown error'}`,
		details: JSON.stringify(details, null, 2)
	};
}

/**
 * Create a successful validation result
 */
export function createValidationSuccess(entryType: EntryType, slug?: string): ValidationResult {
	return {
		entryType,
		slug,
		isValid: true,
		message: `${entryType} validated successfully`
	};
}

// ===== CORE VALIDATION FUNCTIONS =====

/**
 * Validate raw entry structure from markdown processing
 */
export function validateRawEntry(
	rawEntry: unknown,
	filePath?: string
): ValidationResult & { data?: RawEntry } {
	const result = RawEntrySchema.safeParse(rawEntry);

	if (!result.success) {
		return {
			...createValidationFailure('post', result.error, undefined, filePath),
			data: undefined
		};
	}

	return {
		...createValidationSuccess('post'),
		data: result.data
	};
}

/**
 * Validate processed entry against its specific type schema
 */
export function validateProcessedEntry(
	entry: unknown,
	entryType: EntryType,
	slug?: string,
	filePath?: string
): ValidationResult & { data?: Entry } {
	const schema = getSchemaForType(entryType);
	const result = schema.safeParse(entry);

	if (!result.success) {
		return {
			...createValidationFailure(entryType, result.error, slug, filePath),
			data: undefined
		};
	}

	return {
		...createValidationSuccess(entryType, slug),
		data: result.data
	};
}

/**
 * Validate entry type enum
 */
export function validateEntryType(type: unknown): type is EntryType {
	const result = EntryTypeSchema.safeParse(type);
	return result.success;
}

// ===== CONTENT QUALITY VALIDATION =====

/**
 * Additional content quality checks beyond schema validation
 */
export interface ContentQualityIssue {
	type: 'warning' | 'error';
	field: string;
	message: string;
	suggestion?: string;
}

/**
 * Validate content quality aspects (SEO, accessibility, etc.)
 */
export function validateContentQuality(entry: RawEntry): ContentQualityIssue[] {
	const issues: ContentQualityIssue[] = [];

	// SEO: Description length optimization
	if (entry.description.length < 120) {
		issues.push({
			type: 'warning',
			field: 'description',
			message: 'Description is shorter than recommended for SEO (120-160 chars)',
			suggestion: 'Consider expanding the description for better search visibility'
		});
	}

	if (entry.description.length > 160) {
		issues.push({
			type: 'warning',
			field: 'description',
			message: 'Description exceeds SEO recommendation (160 chars max)',
			suggestion: 'Consider shortening for better search snippet display'
		});
	}

	// Accessibility: Alt text for projects
	if (entry.imageAlt && entry.imageAlt.length < 10) {
		issues.push({
			type: 'warning',
			field: 'imageAlt',
			message: 'Alt text is very short, may not be descriptive enough',
			suggestion: 'Provide more descriptive alt text for better accessibility'
		});
	}

	// Content structure: TOC validation for posts
	if (entry.toc && entry.toc.length > 0) {
		const headingDepths = entry.toc.map((h) => h.depth);
		const minDepth = Math.min(...headingDepths);
		const maxDepth = Math.max(...headingDepths);

		// Check for skipped heading levels
		if (maxDepth - minDepth > 2) {
			issues.push({
				type: 'warning',
				field: 'toc',
				message: 'Heading structure skips levels (accessibility concern)',
				suggestion: 'Use consecutive heading levels (h1->h2->h3, not h1->h3)'
			});
		}
	}

	// Link validation for shareables and uses entries
	if (entry.url) {
		try {
			const url = new URL(entry.url);
			if (!url.protocol.startsWith('http')) {
				issues.push({
					type: 'error',
					field: 'url',
					message: 'URL must use HTTP or HTTPS protocol',
					suggestion: 'Update URL to use https:// or http://'
				});
			}
		} catch {
			issues.push({
				type: 'error',
				field: 'url',
				message: 'URL format is invalid',
				suggestion: 'Provide a valid URL including protocol (https://...)'
			});
		}
	}

	// Tag validation
	const duplicateTags = entry.tags.filter((tag, index) => entry.tags.indexOf(tag) !== index);
	if (duplicateTags.length > 0) {
		issues.push({
			type: 'error',
			field: 'tags',
			message: `Duplicate tags found: ${duplicateTags.join(', ')}`,
			suggestion: 'Remove duplicate tags'
		});
	}

	return issues;
}

/**
 * Validate markdown content structure
 */
export function validateMarkdownStructure(html: string): ContentQualityIssue[] {
	const issues: ContentQualityIssue[] = [];

	// Check for empty content
	if (html.trim().length === 0) {
		issues.push({
			type: 'error',
			field: 'html',
			message: 'Content is empty',
			suggestion: 'Add meaningful content to the markdown file'
		});
		return issues;
	}

	// Check for very short content (might be incomplete)
	if (html.trim().length < 100) {
		issues.push({
			type: 'warning',
			field: 'html',
			message: 'Content appears very short, might be incomplete',
			suggestion: 'Consider adding more detailed content'
		});
	}

	// Check for images without alt attributes (basic accessibility)
	const imgTags = html.match(/<img[^>]*>/g) || [];
	const imagesWithoutAlt = imgTags.filter((img) => !img.includes('alt='));

	if (imagesWithoutAlt.length > 0) {
		issues.push({
			type: 'warning',
			field: 'html',
			message: `${imagesWithoutAlt.length} image(s) found without alt attributes`,
			suggestion: 'Add alt attributes to all images for accessibility'
		});
	}

	return issues;
}

// ===== BATCH VALIDATION =====

/**
 * Validate multiple entries of the same type
 */
export async function validateEntriesBatch(
	entries: Array<{ data: unknown; filePath?: string; slug?: string }>,
	entryType: EntryType
): Promise<ValidationResult[]> {
	const results = await Promise.all(
		entries.map(async ({ data, filePath, slug }) => {
			return validateProcessedEntry(data, entryType, slug, filePath);
		})
	);

	return results;
}

/**
 * Validate raw entries batch (from markdown processing)
 */
export async function validateRawEntriesBatch(
	entries: Array<{ data: unknown; filePath?: string }>
): Promise<Array<ValidationResult & { data?: RawEntry }>> {
	const results = await Promise.all(
		entries.map(async ({ data, filePath }) => {
			return validateRawEntry(data, filePath);
		})
	);

	return results;
}

// ===== VALIDATION SUMMARY =====

/**
 * Generate validation summary from multiple results
 */
export function generateValidationSummary(results: ValidationResult[]): {
	total: number;
	passed: number;
	failed: number;
	successRate: number;
	errors: ValidationResult[];
} {
	const total = results.length;
	const passed = results.filter((r) => r.isValid).length;
	const failed = total - passed;
	const successRate = total > 0 ? (passed / total) * 100 : 0;
	const errors = results.filter((r) => !r.isValid);

	return {
		total,
		passed,
		failed,
		successRate: Math.round(successRate * 100) / 100,
		errors
	};
}
