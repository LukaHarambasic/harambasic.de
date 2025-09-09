import * as fs from 'fs/promises';
import type { EntryType } from '$lib/types/enums';
import { join } from 'path';
import { processMarkdown } from '$lib/processors/MarkdownProcessor';
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

export async function getRawEntries(entryType: EntryType): Promise<RawEntry[]> {
	const fileData = await _getFilesWithNames(entryType);
	const entries = await Promise.all(
		fileData.map(async ({ fileName, content }): Promise<RawEntry> => {
			try {
				const output = processMarkdown(content);
				const frontmatter = {
					title: output.title,
					description: output.description,
					image: output.image,
					tags: output.tags,
					published: output.published,
					updated: output.updated,
					url: output.url,
					status: output.status,
					openSource: output.openSource,
					tldr: output.tldr,
					discussion: output.discussion,
					links: output.links,
					prio: output.prio,
					imageAlt: output.imageAlt
				} as FrontmatterData;

				// Validate required fields
				if (!frontmatter) {
					throw new Error(`Missing frontmatter in ${entryType} file "${fileName}"`);
				}
				if (
					!frontmatter.title ||
					!frontmatter.description ||
					!frontmatter.published ||
					!frontmatter.updated
				) {
					throw new Error(
						`Missing required frontmatter fields in ${entryType} file "${fileName}": ${frontmatter.title || 'untitled'}`
					);
				}

				// Strict validation of date formats - fail fast with detailed error
				if (frontmatter.published === undefined || frontmatter.published === null) {
					throw new Error(
						`Missing 'published' date in ${entryType} file "${fileName}" (title: "${frontmatter.title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
					);
				}

				if (frontmatter.updated === undefined || frontmatter.updated === null) {
					throw new Error(
						`Missing 'updated' date in ${entryType} file "${fileName}" (title: "${frontmatter.title}"). This field is mandatory and must be a valid ISO date string (YYYY-MM-DD).`
					);
				}

				const publishedDate = new Date(frontmatter.published);
				const updatedDate = new Date(frontmatter.updated);

				if (isNaN(publishedDate.getTime())) {
					throw new Error(
						`Invalid 'published' date format in ${entryType} file "${fileName}" (title: "${frontmatter.title}"): "${frontmatter.published}". Must be a valid ISO date string (YYYY-MM-DD).`
					);
				}

				if (isNaN(updatedDate.getTime())) {
					throw new Error(
						`Invalid 'updated' date format in ${entryType} file "${fileName}" (title: "${frontmatter.title}"): "${frontmatter.updated}". Must be a valid ISO date string (YYYY-MM-DD).`
					);
				}

				return output;
			} catch (error) {
				// Re-throw with file context if not already included
				if (error instanceof Error && !error.message.includes(fileName)) {
					throw new Error(`Error processing ${entryType} file "${fileName}": ${error.message}`);
				}
				throw error;
			}
		})
	);
	return entries;
}

export async function _getFilesWithNames(
	entryType: EntryType
): Promise<Array<{ fileName: string; content: string }>> {
	const folderName = entryType === 'uses' ? 'uses' : `${entryType}s`;
	const folderPath = join(process.cwd(), 'src', 'content', folderName);
	const fileNames = await fs.readdir(folderPath);
	return await Promise.all(
		fileNames.map(async (fileName) => {
			const filePath = join(folderPath, fileName);
			const content = await fs.readFile(filePath, 'utf8');
			return { fileName, content };
		})
	);
}
