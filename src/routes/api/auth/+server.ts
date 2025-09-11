import { json, type RequestHandler } from '@sveltejs/kit';
import { MASTER_PASSWORD } from '$env/static/private';
import { authenticateUser } from '$lib/services/secretAuth';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { isRateLimited, getRateLimitInfo } from '$lib/server/rateLimit';
import type { AuthFormData } from '$lib/types/secret';

export const POST: RequestHandler = async (event) => {
	const { request, cookies } = event;
	
	try {
		// Check rate limiting
		if (isRateLimited(event)) {
			const rateLimitInfo = getRateLimitInfo(event);
			
			return json(
				{ 
					success: false, 
					error: 'RATE_LIMITED',
					blockUntil: rateLimitInfo.blockUntil
				},
				{ 
					status: 429,
					headers: {
						'Retry-After': rateLimitInfo.blockUntil 
							? Math.ceil((rateLimitInfo.blockUntil - Date.now()) / 1000).toString()
							: '3600'
					}
				}
			);
		}

		const requestBody = await request.json();
		
		// Validate request body
		if (!requestBody.identifier || !requestBody.word1 || !requestBody.word2 || !requestBody.word3) {
			return json(
				{ success: false, error: 'INVALID_REQUEST' },
				{ status: 400 }
			);
		}

		const authData: AuthFormData = {
			identifier: requestBody.identifier,
			word1: requestBody.word1,
			word2: requestBody.word2,
			word3: requestBody.word3
		};

		// Get master password from environment variable
		const masterPassword = MASTER_PASSWORD;
		if (!masterPassword) {
			console.error('MASTER_PASSWORD environment variable not set');
			return json(
				{ success: false, error: 'SERVER_ERROR' },
				{ status: 500 }
			);
		}

		// Load encrypted users data
		const usersPath = join(process.cwd(), 'secrets-config', 'users.encrypted');
		const encryptedUsersData = await readFile(usersPath, 'utf8');
		const encryptedUsers = JSON.parse(encryptedUsersData);

		// Authenticate user server-side
		const result = await authenticateUser(encryptedUsers, authData, masterPassword);

		if (result.success) {
			// Create secure session token
			const sessionToken = crypto.randomUUID();
			const sessionExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

			// Store session in HTTP-only cookie
			cookies.set('session-token', sessionToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 24 * 60 * 60, // 24 hours in seconds
				path: '/'
			});

			// In production, store session in database
			// For now, store in memory (would need Redis/database in production)
			global.sessions = global.sessions || new Map();
			global.sessions.set(sessionToken, {
				userIdentifier: result.userIdentifier,
				expiry: sessionExpiry,
				createdAt: Date.now()
			});

			return json({
				success: true,
				userIdentifier: result.userIdentifier
			});
		} else {
			// Add delay to prevent timing attacks
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			return json(
				{ success: false, error: result.error },
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error('Authentication error:', error);
		return json(
			{ success: false, error: 'SERVER_ERROR' },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	try {
		const sessionToken = cookies.get('session-token');
		
		if (sessionToken && global.sessions) {
			global.sessions.delete(sessionToken);
		}

		cookies.delete('session-token', { path: '/' });

		return json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return json(
			{ success: false, error: 'SERVER_ERROR' },
			{ status: 500 }
		);
	}
};