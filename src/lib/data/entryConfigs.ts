import type { EntryTransformConfig, BaseEntryFields } from '$lib/util/entryTransformer';
import type { Post } from '$lib/types/post';
import type { Project } from '$lib/types/project';
import type { UsesEntry } from '$lib/types/usesEntry';
import type { Snippet } from '$lib/types/snippet';
import type { Shareable } from '$lib/types/shareable';
import type { RawEntry } from '$lib/types/entry';
import type { ProjectStatus, UsesEntryStatus } from '$lib/types/enums';
import { z } from 'zod';
import { RawEntrySchema } from '$lib/schemas/content';
import { getSlug } from '$lib/util/helper';

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
		throw new Error(`Missing required fields in uses entry "${title}": ${firstError.message}`);
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

	snippet: {
		entryType: 'snippet' as const,
		transform: (base: BaseEntryFields, raw: RawEntry): Snippet => ({
			...base,
			html: raw.html || ''
		})
		// No validate - allows null returns in API layer
	} satisfies EntryTransformConfig<Snippet>,

	shareable: {
		entryType: 'shareable' as const,
		transform: (base: BaseEntryFields, raw: RawEntry): Shareable => {
			// Shareable omits 'image' from BaseEntry
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { image, ...baseWithoutImage } = base;
			return {
				...baseWithoutImage,
				url: raw.url || '',
				comment: raw.tldr || ''
			};
		}
		// No validate - shareables handle missing directory at API level
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as EntryTransformConfig<any>
} as const;
