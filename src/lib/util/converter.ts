import type { EntryType } from '$lib/types/enums';
import { join } from 'path';
import * as fs from 'fs/promises';
import { marked } from 'marked';
import matter from 'gray-matter';

// TODO still needs to be transformed to the corresponding Entry types
export async function getRawEntries(entryType: EntryType): Promise<any[]> {
	const files = await _getFiles(entryType);
	const entries = await Promise.all(
		files.map(async (file) => {
			const [markdown, meta] = await _getMeta(file);
			const html = await _getHTML(markdown);
			return { html, meta };
		})
	);
	return entries;
}

export async function _getFiles(entryType: EntryType): Promise<string[]> {
	const folderPath = join(process.cwd(), 'src', 'content', `${entryType.toLowerCase()}s`);
	const fileNames = await fs.readdir(folderPath);
	return await Promise.all(
		fileNames.map(async (fileName) => {
			const filePath = join(folderPath, fileName);
			return await fs.readFile(filePath, 'utf8');
		})
	);
}

export async function _getHTML(markdown: string): Promise<string> {
	return marked.parse(markdown);
}

export async function _getMeta(frontmatter: string): Promise<[string, object]> {
	const { content, data } = await matter(frontmatter);
	return [content, data];
}
