import type { EntryType } from '$lib/types/enums';
import type { RawEntry } from '$lib/types/entry';

/**
 * Validation result for content structure validation
 */
export interface ValidationResult {
	/** The entry type that was validated */
	entryType: EntryType;
	/** Slug of the entry, if applicable */
	slug?: string;
	/** Whether the validation was successful */
	isValid: boolean;
	/** Error message if validation failed */
	message?: string;
	/** Additional details about the error */
	details?: string;
}

/**
 * Error class for content service operations
 */
export class ContentServiceError extends Error {
	constructor(
		message: string,
		public entryType: EntryType,
		public slug?: string,
		public cause?: Error
	) {
		super(message);
		this.name = 'ContentServiceError';
	}
}

/**
 * Service interface for content operations.
 * Provides abstraction layer for content processing with different source implementations.
 */
export interface ContentService {
	/**
	 * Get all entries of a specific type
	 * @param entryType - The type of entries to retrieve
	 * @returns Promise resolving to array of raw entries
	 */
	getEntries(entryType: EntryType): Promise<RawEntry[]>;

	/**
	 * Get single entry by type and slug
	 * @param entryType - The type of entry to retrieve
	 * @param slug - The slug identifier for the entry
	 * @returns Promise resolving to raw entry or null if not found
	 */
	getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null>;

	/**
	 * Get entry metadata only (faster for listings)
	 * @param entryType - The type of entry to retrieve metadata for
	 * @param slug - The slug identifier for the entry
	 * @returns Promise resolving to entry metadata subset or null if not found
	 */
	getEntryMetadata(
		entryType: EntryType,
		slug: string
	): Promise<Pick<RawEntry, 'title' | 'description' | 'published'> | null>;

	/**
	 * Validate content structure for a specific entry type
	 * @param entryType - The type of entries to validate
	 * @returns Promise resolving to array of validation results
	 */
	validateContent(entryType: EntryType): Promise<ValidationResult[]>;
}
