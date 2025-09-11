import { json } from '@sveltejs/kit';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	try {
		// Read all encrypted content files from src/content/secrets/ directory
		const secretsPath = join(process.cwd(), 'src', 'content', 'secrets');
		const files = await readdir(secretsPath);
		
		// Filter for .encrypted files
		const encryptedFiles = files.filter(file => file.endsWith('.encrypted'));
		
		// Read each encrypted file
		const contentPromises = encryptedFiles.map(async (filename) => {
			const filePath = join(secretsPath, filename);
			const encryptedData = await readFile(filePath, 'utf8');
			const parsedData = JSON.parse(encryptedData);
			
			// Extract slug from filename (remove .encrypted extension)
			const slug = filename.replace('.encrypted', '');
			
			return {
				slug,
				data: parsedData
			};
		});
		
		const content = await Promise.all(contentPromises);
		
		return json(content);
	} catch (error) {
		console.error('Error loading encrypted content:', error);
		return json(
			{ error: 'Unable to load content data' },
			{ status: 500 }
		);
	}
};