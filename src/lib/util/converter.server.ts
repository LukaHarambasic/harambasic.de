import * as fs from 'fs/promises';
import type { EntryType } from '$lib/types/enums';
import { join } from 'path';
import { RemarkRehypeProcessor, ProcessorConfigBuilder } from '$lib/processors';
import type { RawEntry } from '$lib/types/entry';
import type { ContentStatus } from '$lib/types/enums';

/**
 * Interface for frontmatter data extracted from markdown files.
 *
 * Required fields:
 * - title, description, image: Basic content metadata
 * - tags: Array of tag strings for categorization
 * - published, updated: ISO date strings for content lifecycle
 *
 * Optional fields:
 * - status: Content status (draft, active, etc.)
 * - url: External link for the content
 * - openSource: Whether the project is open source
 * - tldr: Short summary of the content
 * - discussion: Link to discussion/comments
 * - links: Related links with title and URL
 * - prio: Priority for sorting/display
 * - imageAlt: Alt text for the main image
 */
interface FrontmatterData {
	title: string;
	description: string;
	image: string;
	tags: string[];
	published: string;
	updated: string;
	url?: string;
	status?: ContentStatus;
	openSource?: boolean;
	tldr?: string;
	discussion?: string;
	links?: Array<{ title: string; url: string }>;
	prio?: number;
	imageAlt?: string;
}

// Create processor instance with production configuration for server-side processing
const processor = new RemarkRehypeProcessor(ProcessorConfigBuilder.production());

export async function getRawEntries(entryType: EntryType): Promise<RawEntry[]> {
	const files = await _getFiles(entryType);
	const entries = await Promise.all(
		files.map(async (file): Promise<RawEntry> => {
			const output = processor.processSync(file);
			const frontmatter = output.frontmatter as unknown as FrontmatterData;

			// Validate required fields
			if (!frontmatter) {
				throw new Error(`Missing frontmatter in ${entryType} entry`);
			}
			if (
				!frontmatter.title ||
				!frontmatter.description ||
				!frontmatter.published ||
				!frontmatter.updated
			) {
				throw new Error(
					`Missing required frontmatter fields in ${entryType} entry: ${frontmatter.title || 'untitled'}`
				);
			}

			// Validate date formats
			const publishedDate = new Date(frontmatter.published);
			const updatedDate = new Date(frontmatter.updated);
			if (isNaN(publishedDate.getTime()) || isNaN(updatedDate.getTime())) {
				console.warn(
					`Invalid date format in ${entryType} entry "${frontmatter.title}": published="${frontmatter.published}", updated="${frontmatter.updated}"`
				);
			}

			return {
				html: output.html,
				toc: output.toc || [], // Ensure toc is always an array
				// Flatten frontmatter fields directly into the object
				...frontmatter,
				// Ensure required fields have default values
				published: frontmatter.published || new Date().toISOString(),
				updated: frontmatter.updated || new Date().toISOString(),
				tags: frontmatter.tags || []
			};
		})
	);
	return entries;
}

export async function _getFiles(entryType: EntryType): Promise<string[]> {
	const folderName = entryType === 'uses' ? 'uses' : `${entryType}s`;
	const folderPath = join(process.cwd(), 'src', 'content', folderName);
	const fileNames = await fs.readdir(folderPath);
	return await Promise.all(
		fileNames.map(async (fileName) => {
			const filePath = join(folderPath, fileName);
			return await fs.readFile(filePath, 'utf8');
		})
	);
}
