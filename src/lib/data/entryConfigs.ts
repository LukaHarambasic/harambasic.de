import type { EntryTransformConfig, BaseEntryFields } from '$lib/util/entryTransformer';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { WorkEntry, Position } from '$lib/types/workEntry';
import type { RawEntry } from '$lib/types/entry';
import type { ProjectStatus, UsesEntryStatus } from '$lib/types/enums';
import { z } from 'zod';
import { RawEntrySchema } from '$lib/schemas/content';
import { getSlug } from '$lib/util/helper';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

type RawPosition = {
	title: string;
	startDate: string;
	endDate: string | null;
	content: string;
	employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
};

/**
 * Validate project entry with strict date requirements using Zod
 */
function validateProject(raw: RawEntry): void {
	const slug = getSlug(raw.title);
	const title = raw.title || 'untitled';

	// Check for missing published date
	if (raw.published === undefined || raw.published === null) {
		throw new Error(
			`Missing 'published' date in project entry "${slug}" (title: "${title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	// Check for missing updated date
	if (raw.updated === undefined || raw.updated === null) {
		throw new Error(
			`Missing 'updated' date in project entry "${slug}" (title: "${title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	// Validate date formats using Zod schema
	const DateSchema = z.string().refine(
		(val) => {
			const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
			const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
			if (dateOnlyRegex.test(val) || isoDatetimeRegex.test(val)) {
				const date = new Date(val);
				return !isNaN(date.getTime());
			}
			return false;
		},
		{
			message: 'Invalid date format (expected YYYY-MM-DD or ISO datetime)'
		}
	);

	// Validate published date
	const publishedResult = DateSchema.safeParse(raw.published);
	if (!publishedResult.success) {
		const errorMsg = publishedResult.error.issues[0]?.message || 'Invalid date format';
		throw new Error(
			`Invalid 'published' date in project entry "${slug}" (title: "${title}"): ${errorMsg}`
		);
	}

	// Validate updated date
	const updatedResult = DateSchema.safeParse(raw.updated);
	if (!updatedResult.success) {
		const errorMsg = updatedResult.error.issues[0]?.message || 'Invalid date format';
		throw new Error(
			`Invalid 'updated' date in project entry "${slug}" (title: "${title}"): ${errorMsg}`
		);
	}
}

/**
 * Validate uses entry with required fields using Zod
 */
function validateUsesEntry(raw: RawEntry): void {
	const UsesRawSchema = RawEntrySchema.refine(
		(data) => {
			return !!(data.title && data.description && data.published && data.updated);
		},
		{
			message: 'Missing required fields (title, description, published, or updated)',
			path: []
		}
	);

	const result = UsesRawSchema.safeParse(raw);

	if (!result.success) {
		const title = raw.title || 'untitled';
		const firstError = result.error.issues[0];
		const message = firstError?.message ?? 'Unknown validation error';
		throw new Error(`Missing required fields in uses entry "${title}": ${message}`);
	}
}

/**
 * Validate work entry with required fields
 */
function validateWorkEntry(raw: RawEntry): void {
	const slug = getSlug(raw.title);
	const title = raw.title || 'untitled';

	// Check for missing published date
	if (raw.published === undefined || raw.published === null) {
		throw new Error(
			`Missing 'published' date in work entry "${slug}" (title: "${title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	// Check for missing updated date
	if (raw.updated === undefined || raw.updated === null) {
		throw new Error(
			`Missing 'updated' date in work entry "${slug}" (title: "${title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
		);
	}

	// Validate required work-specific fields
	if (!raw.location) {
		throw new Error(`Missing 'location' field in work entry "${slug}" (title: "${title}").`);
	}

	// employmentType is optional - can be at work level or position level

	if (!raw.positions || !Array.isArray(raw.positions) || raw.positions.length === 0) {
		throw new Error(
			`Missing or empty 'positions' array in work entry "${slug}" (title: "${title}"). At least one position is required.`
		);
	}

	// Validate each position
	raw.positions.forEach((position: RawPosition, index: number) => {
		if (!position.title) {
			throw new Error(
				`Position ${index + 1} in work entry "${slug}" is missing required 'title' field.`
			);
		}
		if (!position.startDate) {
			throw new Error(
				`Position ${index + 1} in work entry "${slug}" is missing required 'startDate' field.`
			);
		}
		if (position.endDate === undefined) {
			throw new Error(
				`Position ${index + 1} in work entry "${slug}" is missing required 'endDate' field (use null for current positions).`
			);
		}
		if (!position.content) {
			throw new Error(
				`Position ${index + 1} in work entry "${slug}" is missing required 'content' field.`
			);
		}
	});

	// Validate date formats using Zod schema
	const DateSchema = z.string().refine(
		(val) => {
			const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
			const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
			if (dateOnlyRegex.test(val) || isoDatetimeRegex.test(val)) {
				const date = new Date(val);
				return !isNaN(date.getTime());
			}
			return false;
		},
		{
			message: 'Invalid date format (expected YYYY-MM-DD or ISO datetime)'
		}
	);

	// Validate published date
	const publishedResult = DateSchema.safeParse(raw.published);
	if (!publishedResult.success) {
		const errorMsg = publishedResult.error.issues[0]?.message || 'Invalid date format';
		throw new Error(
			`Invalid 'published' date in work entry "${slug}" (title: "${title}"): ${errorMsg}`
		);
	}

	// Validate updated date
	const updatedResult = DateSchema.safeParse(raw.updated);
	if (!updatedResult.success) {
		const errorMsg = updatedResult.error.issues[0]?.message || 'Invalid date format';
		throw new Error(
			`Invalid 'updated' date in work entry "${slug}" (title: "${title}"): ${errorMsg}`
		);
	}
}

/**
 * Process position content from markdown to HTML
 */
function processPositionContent(markdown: string): string {
	try {
		const processor = remark().use(remarkRehype).use(rehypeStringify);
		const result = processor.processSync(markdown);
		return String(result);
	} catch (error) {
		// If processing fails, return the markdown as-is (will be escaped in display)
		console.warn('Failed to process position content markdown:', error);
		return markdown;
	}
}

export const ENTRY_CONFIGS = {
	post: {
		entryType: 'post' as const,
		transform: (base: BaseEntryFields, raw: RawEntry): Post => ({
			...base,
			tldr: raw.tldr || '',
			discussion: raw.discussion || '',
			toc: raw.toc || [],
			html: raw.html || ''
		})
		// No validate - allows null returns in API layer
	} satisfies EntryTransformConfig<Post>,

	project: {
		entryType: 'project' as const,
		transform: (base: BaseEntryFields, raw: RawEntry): Project => ({
			...base,
			links: raw.links || [],
			prio: raw.prio || 0,
			status: (raw.status as ProjectStatus) || 'active',
			html: raw.html || '',
			imageAlt: raw.imageAlt || ''
		}),
		validate: validateProject
	} satisfies EntryTransformConfig<Project>,

	uses: {
		entryType: 'uses' as const,
		transform: (base: BaseEntryFields, raw: RawEntry): UsesEntry => ({
			...base,
			url: raw.url || '',
			status: (raw.status as UsesEntryStatus) || 'active',
			openSource: raw.openSource || false
		}),
		validate: validateUsesEntry
	} satisfies EntryTransformConfig<UsesEntry>,

	work: {
		entryType: 'work' as const,
		transform: (base: BaseEntryFields, raw: RawEntry): WorkEntry => {
			// Process positions: convert markdown content to HTML
			const positions: Position[] = (raw.positions || []).map((pos: RawPosition) => ({
				title: pos.title,
				startDate: pos.startDate,
				endDate: pos.endDate === null ? null : pos.endDate,
				content: processPositionContent(pos.content || ''),
				employmentType: pos.employmentType || raw.employmentType || undefined
			}));

			return {
				...base,
				location: raw.location || '',
				employmentType: raw.employmentType as WorkEntry['employmentType'] | undefined,
				positions,
				relatedProjects: raw.relatedProjects || [],
				html: raw.html || ''
			};
		},
		validate: validateWorkEntry
	} satisfies EntryTransformConfig<WorkEntry>
} as const;
