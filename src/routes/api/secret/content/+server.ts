import { json } from '@sveltejs/kit';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { requireAuth } from '$lib/server/auth';
import { MASTER_PASSWORD } from '$env/static/private';
import { processContentList } from '$lib/services/secretContent';
import type { RequestHandler } from './$types';

export const prerender = false; // Must be dynamic for authentication

export const GET: RequestHandler = async ({ cookies, url }) => {
	// Require authentication for this endpoint
	const authResult = requireAuth(cookies);
	if (!authResult.success) {
		return authResult.response;
	}

	try {
		const masterPassword = MASTER_PASSWORD;
		if (!masterPassword) {
			console.error('MASTER_PASSWORD environment variable not set');
			return json({ error: 'SERVER_ERROR' }, { status: 500 });
		}

		// Check if requesting specific content or content list
		const slug = url.searchParams.get('slug');

		if (slug) {
			// Return specific content - decrypt server-side for authorized user
			const secretsPath = join(process.cwd(), 'src', 'content', 'secrets');
			const filePath = join(secretsPath, `${slug}.encrypted`);
			
			try {
				const encryptedData = await readFile(filePath, 'utf8');
				const parsedData = JSON.parse(encryptedData);

				// Decrypt content server-side using user's passphrase
				// Note: In a real implementation, you'd need to store the user's passphrase
				// securely or require re-authentication for content access
				return json({
					slug,
					data: parsedData // Still encrypted - client will decrypt with their passphrase
				});
			} catch (error) {
				return json({ error: 'Content not found' }, { status: 404 });
			}
		} else {
			// Return content list metadata only (no full content)
			const secretsPath = join(process.cwd(), 'src', 'content', 'secrets');
			const files = await readdir(secretsPath);
			
			// Filter for .encrypted files
			const encryptedFiles = files.filter((file) => file.endsWith('.encrypted'));

			// Return only metadata for listing - not full encrypted content
			const contentList = encryptedFiles.map((filename) => {
				const slug = filename.replace('.encrypted', '');
				return {
					slug,
					// Don't expose encrypted data in list endpoint
					hasContent: true
				};
			});

			return json(contentList);
		}
	} catch (error) {
		console.error('Error loading encrypted content:', error);
		return json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
};
