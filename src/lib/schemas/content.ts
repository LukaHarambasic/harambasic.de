import { z } from 'zod';

/**
 * Schema-first content validation using Zod
 *
 * This file defines comprehensive validation schemas for all content types and
 * infers TypeScript types directly from schemas to eliminate redundancy.
 * This approach ensures validation logic and type definitions stay synchronized.
 */

// ===== SHARED COMPONENT SCHEMAS =====

// Define TocNode type for recursive reference first
export interface TocNode {
	depth: number;
	slug: string;
	value: string;
	children?: TocNode[];
}

/**
 * Table of Contents Node Schema
 */
export const TocNodeSchema: z.ZodType<TocNode> = z.lazy(() =>
	z.object({
		depth: z.number().int().min(1).max(6, 'Heading depth must be between 1-6'),
		slug: z.string().min(1, 'TOC slug is required'),
		value: z.string().min(1, 'TOC value is required'),
		children: z.array(TocNodeSchema).optional()
	})
);

/**
 * Link Schema for project links, etc.
 */
export const LinkSchema = z.object({
	title: z.string().min(1, 'Link title is required'),
	url: z.string().url('Link URL must be a valid URL')
});

/**
 * Tag Schema for content tagging
 */
export const TagSchema = z.object({
	display: z.string().min(1, 'Tag display name is required'),
	slug: z.string().min(1, 'Tag slug is required'),
	relativePath: z.string().min(1, 'Tag relative path is required'),
	count: z.number().int().min(0, 'Tag count cannot be negative'),
	type: z.enum(['post', 'project', 'uses', 'shareable'])
});

/**
 * Entry Date Schema for processed dates
 */
export const EntryDateSchema = z.object({
	raw: z.date(),
	display: z.string().min(1, 'Date display string is required')
});

// ===== CONTENT STATUS AND TYPE SCHEMAS =====

export const ContentStatusSchema = z.enum(['active', 'inactive', 'all']);
export const EntryTypeSchema = z.enum(['post', 'project', 'uses', 'shareable']);
export type ValidatedEntryType = z.infer<typeof EntryTypeSchema>;

// ===== RAW ENTRY SCHEMA (Pre-processing) =====

/**
 * Raw Entry Schema - Structure before processing
 *
 * This represents the flattened frontmatter + content structure that comes
 * directly from markdown processing, before transformation into typed entries.
 */
export const RawEntrySchema = z.object({
	// Content fields
	html: z.string().default(''), // Allow empty HTML - specific schemas will enforce if needed
	toc: z.array(TocNodeSchema).default([]),

	// Required frontmatter fields
	title: z.string().min(1, 'Title is required').max(100, 'Title too long (max 100 chars)'),
	description: z
		.string()
		.min(10, 'Description must be at least 10 characters')
		.max(200, 'Description too long (max 200 chars)'),
	image: z
		.string()
		.nullable()
		.optional()
		.default('TODO')
		.transform((val) => val || 'TODO')
		.refine((val) => {
			// Allow "TODO" as temporary placeholder during migration
			// This will be made stricter once all content has proper images
			return val === 'TODO' || val.length > 1;
		}, 'Image must be a valid path or "TODO" for temporary placeholder'),
	tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'At least one tag required'),
	published: z.string().refine((val) => {
		// Support both YYYY-MM-DD and ISO datetime formats
		const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
		const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

		if (dateOnlyRegex.test(val) || isoDatetimeRegex.test(val)) {
			const date = new Date(val);
			return !isNaN(date.getTime());
		}
		return false;
	}, 'Invalid published date format (expected YYYY-MM-DD or ISO datetime)'),
	updated: z.string().refine((val) => {
		// Support both YYYY-MM-DD and ISO datetime formats
		const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
		const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

		if (dateOnlyRegex.test(val) || isoDatetimeRegex.test(val)) {
			const date = new Date(val);
			return !isNaN(date.getTime());
		}
		return false;
	}, 'Invalid updated date format (expected YYYY-MM-DD or ISO datetime)'),

	// Optional fields (varies by content type)
	url: z.string().url('Invalid URL format').optional(),
	status: ContentStatusSchema.optional(),
	openSource: z.boolean().nullable().optional().default(false),
	tldr: z.string().min(10, 'TLDR must be at least 10 characters').optional(),
	discussion: z.string().url('Invalid discussion URL').optional(),
	links: z.array(LinkSchema).optional(),
	prio: z.number().int().min(1).max(1000, 'Priority must be between 1-1000').optional(),
	imageAlt: z.string().min(5, 'Alt text must be at least 5 characters').optional(),
	comment: z.string().min(1, 'Comment cannot be empty').optional()
});

// ===== BASE ENTRY SCHEMA (Post-processing) =====

/**
 * Base Entry Schema - Foundation for all processed content types
 *
 * This represents the processed structure with computed fields like slug,
 * paths, and transformed data like parsed dates and tag objects.
 */
export const BaseEntrySchema = z.object({
	type: EntryTypeSchema,
	slug: z.string().min(1, 'Slug is required'),
	relativePath: z.string().min(1, 'Relative path is required'),
	fullPath: z.string().url('Full path must be a valid URL'),
	title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
	description: z
		.string()
		.min(10, 'Description must be descriptive')
		.max(200, 'Description too long for SEO'),
	image: z
		.string()
		.nullable()
		.optional()
		.default('TODO')
		.transform((val) => val || 'TODO')
		.refine((val) => {
			// Allow "TODO" as temporary placeholder during migration
			// This will be made stricter once all content has proper images
			return val === 'TODO' || val.length > 1;
		}, 'Image must be a valid path or "TODO" for temporary placeholder'),
	tags: z.array(TagSchema).min(1, 'At least one tag required'),
	published: EntryDateSchema,
	updated: EntryDateSchema
});

// ===== CONTENT TYPE SPECIFIC SCHEMAS =====

/**
 * Post Schema - Blog posts with TOC and discussion
 */
export const PostSchema = BaseEntrySchema.extend({
	type: z.literal('post'),
	toc: z.array(TocNodeSchema).default([]),
	tldr: z.string().min(10, 'TLDR must be descriptive'),
	discussion: z.string().url('Invalid discussion URL'),
	html: z.string().min(1, 'HTML content is required')
});

/**
 * Project Schema - Portfolio projects with links and priority
 */
export const ProjectSchema = BaseEntrySchema.extend({
	type: z.literal('project'),
	links: z.array(LinkSchema).min(1, 'Projects must have at least one link'),
	prio: z.number().int().min(1).max(1000, 'Priority must be between 1-1000'),
	status: ContentStatusSchema,
	html: z.string().min(1, 'HTML content is required'),
	imageAlt: z.string().min(5, 'Alt text must be descriptive for accessibility')
});

/**
 * Uses Entry Schema - Tools and software recommendations
 */
export const UsesEntrySchema = BaseEntrySchema.extend({
	type: z.literal('uses'),
	url: z.string().url('Uses entry must have a valid URL'),
	status: ContentStatusSchema,
	openSource: z.boolean().default(false),
	html: z.string().default('') // Uses entries can have empty HTML content (reference-style entries)
});

/**
 * Shareable Schema - Bookmarks and shared links
 */
export const ShareableSchema = BaseEntrySchema.omit({ image: true }).extend({
	type: z.literal('shareable'),
	url: z.string().url('Shareable must have a valid URL'),
	comment: z.string().min(1, 'Comment is required for shareables')
});

// ===== TYPE INFERENCE (Single Source of Truth) =====

/**
 * Inferred TypeScript types from Zod schemas
 * These replace the existing .d.ts interface definitions
 */

// Component types (TocNode already defined as interface above)
export type Link = z.infer<typeof LinkSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type EntryDate = z.infer<typeof EntryDateSchema>;

// Enum types
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
// Note: Using ValidatedEntryType to avoid conflict with main EntryType that includes 'snippet'

// Entry types
export type RawEntry = z.infer<typeof RawEntrySchema>;
export type BaseEntry = z.infer<typeof BaseEntrySchema>;
export type Post = z.infer<typeof PostSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type UsesEntry = z.infer<typeof UsesEntrySchema>;
export type Shareable = z.infer<typeof ShareableSchema>;

// Union type for all processed entries
export type Entry = Post | Project | UsesEntry | Shareable;

// ===== SCHEMA MAPPING UTILITIES =====

/**
 * Map entry types to their corresponding Zod schemas
 */
export const ENTRY_SCHEMAS = {
	post: PostSchema,
	project: ProjectSchema,
	uses: UsesEntrySchema,
	shareable: ShareableSchema
} as const;

/**
 * Get the appropriate schema for a given entry type
 */
export function getSchemaForType(type: ValidatedEntryType) {
	return ENTRY_SCHEMAS[type];
}

// ===== VALIDATION RESULT SCHEMAS =====

/**
 * Validation Result Schema for error reporting
 */
export const ValidationResultSchema = z.object({
	entryType: EntryTypeSchema,
	slug: z.string().optional(),
	isValid: z.boolean(),
	message: z.string().optional(),
	details: z.string().optional()
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

/**
 * Validation Error Details Schema for comprehensive error reporting
 */
export const ValidationErrorDetailSchema = z.object({
	file: z.string().min(1, 'File path is required'),
	field: z.string().min(1, 'Field path is required'),
	message: z.string().min(1, 'Error message is required'),
	line: z.number().int().min(1).optional(),
	received: z.any().optional(),
	expected: z.string().optional()
});

export type ValidationErrorDetail = z.infer<typeof ValidationErrorDetailSchema>;
