import { json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	try {
		// Read the encrypted users file from secrets-config directory
		const usersPath = join(process.cwd(), 'secrets-config', 'users.encrypted');
		const encryptedData = await readFile(usersPath, 'utf8');
		const parsedData = JSON.parse(encryptedData);

		return json(parsedData);
	} catch (error) {
		console.error('Error loading encrypted users:', error);
		return json(
			{ error: 'Unable to load user data' },
			{ status: 500 }
		);
	}
};