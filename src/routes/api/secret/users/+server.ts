import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const prerender = false; // Must be dynamic for authentication

export const GET: RequestHandler = async ({ cookies }) => {
	// Require authentication for this endpoint
	const authResult = requireAuth(cookies);
	if (!authResult.success) {
		return authResult.response;
	}

	try {
		// This endpoint no longer exposes raw encrypted data
		// Instead, it confirms the user is authenticated
		return json({ 
			authenticated: true,
			userIdentifier: authResult.userIdentifier
		});
	} catch (error) {
		console.error('Error in users endpoint:', error);
		return json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
};
