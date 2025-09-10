import type { EntryType } from '$lib/types/enums';
import type { RawEntry } from '$lib/types/entry';
import type { ValidationResult, ContentQualityIssue } from '$lib/schemas';

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

	/**
	 * Validate all content types and return comprehensive report
	 * @returns Promise resolving to validation results for all content types
	 */
	validateAllContent(): Promise<{
		overall: {
			total: number;
			passed: number;
			failed: number;
			successRate: number;
		};
		byType: Record<EntryType, ValidationResult[]>;
		errors: ValidationResult[];
	}>;

	/**
	 * Validate single entry with quality checks
	 * @param entryType - The type of entry to validate
	 * @param slug - The slug identifier for the entry
	 * @returns Promise resolving to validation result with quality issues
	 */
	validateEntryWithQuality(
		entryType: EntryType,
		slug: string
	): Promise<{
		validation: ValidationResult;
		qualityIssues: ContentQualityIssue[];
	} | null>;
}

/**
 * Content validation summary for reporting
 */
export interface ContentValidationSummary {
	/** Total number of entries validated */
	total: number;
	/** Number of entries that passed validation */
	passed: number;
	/** Number of entries that failed validation */
	failed: number;
	/** Success rate as percentage */
	successRate: number;
	/** List of validation errors */
	errors: ValidationResult[];
	/** Breakdown by content type */
	byType: Record<
		EntryType,
		{
			total: number;
			passed: number;
			failed: number;
		}
	>;
}
