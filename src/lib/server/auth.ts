import type { Cookies } from '@sveltejs/kit';

export interface ServerSession {
	userIdentifier: string;
	expiry: number;
	createdAt: number;
}

/**
 * Validate session from HTTP-only cookie
 * Returns user identifier if session is valid, null otherwise
 */
export function validateSession(cookies: Cookies): string | null {
	try {
		const sessionToken = cookies.get('session-token');
		
		if (!sessionToken) {
			return null;
		}

		// Check if sessions exist (in production, this would be Redis/database)
		if (!global.sessions) {
			return null;
		}

		const session = global.sessions.get(sessionToken) as ServerSession | undefined;
		
		if (!session) {
			return null;
		}

		// Check if session has expired
		if (Date.now() > session.expiry) {
			global.sessions.delete(sessionToken);
			cookies.delete('session-token', { path: '/' });
			return null;
		}

		return session.userIdentifier;
	} catch (error) {
		console.error('Session validation error:', error);
		return null;
	}
}

/**
 * Require authentication for API endpoint
 * Returns 401 response if not authenticated
 */
export function requireAuth(cookies: Cookies): { success: false; response: Response } | { success: true; userIdentifier: string } {
	const userIdentifier = validateSession(cookies);
	
	if (!userIdentifier) {
		return {
			success: false,
			response: new Response(
				JSON.stringify({ error: 'UNAUTHORIZED' }),
				{ 
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				}
			)
		};
	}

	return { success: true, userIdentifier };
}