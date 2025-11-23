/**
 * Secret authentication service
 * Handles user authentication, session management, and secure credential validation
 */

import { browser } from '$app/environment';
import {
	decryptData,
	constantTimeCompare,
	normalizePassphrase,
	type EncryptedData
} from '$lib/util/encryption';
import {
	type AuthenticationState,
	type AuthFormData,
	type SecretAuthError,
	SESSION_DURATION_MS,
	SESSION_STORAGE_KEY,
	isSecretUsers,
	isAuthenticationState
} from '$lib/types/secret';

// Authentication result types
export type AuthResult =
	| { success: true; userIdentifier: string }
	| { success: false; error: SecretAuthError };

export type SessionResult =
	| { valid: true; userIdentifier: string }
	| { valid: false; error: SecretAuthError };

/**
 * Authenticate user with 3-word passphrase
 * Uses constant-time comparison to prevent timing attacks
 */
export async function authenticateUser(
	encryptedUsers: EncryptedData,
	authData: AuthFormData,
	masterPassword: string
): Promise<AuthResult> {
	try {
		// Decrypt user credentials
		const usersJson = await decryptData(encryptedUsers, masterPassword);
		const users: unknown = JSON.parse(usersJson);

		if (!isSecretUsers(users)) {
			return { success: false, error: 'VALIDATION_ERROR' };
		}

		// Normalize input passphrase
		const inputPassphrase = normalizePassphrase([authData.word1, authData.word2, authData.word3]);
		const userIdentifier = authData.identifier.trim().toLowerCase();

		// Check if user exists and validate passphrase
		let userFound = false;
		let passphraseValid = false;

		for (const [identifier, storedPassphrase] of Object.entries(users)) {
			const normalizedIdentifier = identifier.trim().toLowerCase();
			const normalizedStoredPassphrase = normalizePassphrase(storedPassphrase);

			// Use constant-time comparison for both identifier and passphrase
			const identifierMatch = constantTimeCompare(userIdentifier, normalizedIdentifier);
			const passphraseMatch = constantTimeCompare(inputPassphrase, normalizedStoredPassphrase);

			if (identifierMatch) {
				userFound = true;
				passphraseValid = passphraseMatch;
				break;
			}
		}

		if (!userFound) {
			return { success: false, error: 'USER_NOT_FOUND' };
		}

		if (!passphraseValid) {
			return { success: false, error: 'INVALID_CREDENTIALS' };
		}

		return { success: true, userIdentifier: authData.identifier };
	} catch (error) {
		console.error('Authentication error:', error);
		return { success: false, error: 'DECRYPTION_FAILED' };
	}
}

/**
 * Create and store authentication session
 */
export function createSession(userIdentifier: string): AuthenticationState {
	if (!browser) {
		throw new Error('Session management only available in browser');
	}

	const sessionExpiry = Date.now() + SESSION_DURATION_MS;
	const authState: AuthenticationState = {
		isAuthenticated: true,
		userIdentifier,
		sessionExpiry
	};

	try {
		sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authState));
	} catch (error) {
		console.error('Failed to store session:', error);
		// Continue without session storage - authentication will work but won't persist
	}

	return authState;
}

/**
 * Get current authentication session
 */
export function getSession(): SessionResult {
	if (!browser) {
		return { valid: false, error: 'SESSION_EXPIRED' };
	}

	try {
		const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (!sessionData) {
			return { valid: false, error: 'SESSION_EXPIRED' };
		}

		const authState: unknown = JSON.parse(sessionData);
		if (!isAuthenticationState(authState)) {
			clearSession();
			return { valid: false, error: 'VALIDATION_ERROR' };
		}

		// Check if session has expired
		if (
			!authState.isAuthenticated ||
			!authState.sessionExpiry ||
			Date.now() > authState.sessionExpiry
		) {
			clearSession();
			return { valid: false, error: 'SESSION_EXPIRED' };
		}

		if (!authState.userIdentifier) {
			clearSession();
			return { valid: false, error: 'VALIDATION_ERROR' };
		}

		return { valid: true, userIdentifier: authState.userIdentifier };
	} catch (error) {
		console.error('Session validation error:', error);
		clearSession();
		return { valid: false, error: 'VALIDATION_ERROR' };
	}
}

/**
 * Clear authentication session
 */
export function clearSession(): void {
	if (!browser) return;

	try {
		sessionStorage.removeItem(SESSION_STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear session:', error);
	}
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
	const session = getSession();
	return session.valid;
}

/**
 * Get current authenticated user identifier
 */
export function getCurrentUser(): string | null {
	const session = getSession();
	return session.valid ? session.userIdentifier : null;
}

/**
 * Extend current session expiry
 */
export function extendSession(): boolean {
	if (!browser) return false;

	const session = getSession();
	if (!session.valid) return false;

	try {
		const newExpiry = Date.now() + SESSION_DURATION_MS;
		const authState: AuthenticationState = {
			isAuthenticated: true,
			userIdentifier: session.userIdentifier,
			sessionExpiry: newExpiry
		};

		sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authState));
		return true;
	} catch (error) {
		console.error('Failed to extend session:', error);
		return false;
	}
}

/**
 * Validate authentication form data
 */
export function validateAuthForm(data: unknown): data is AuthFormData {
	if (typeof data !== 'object' || data === null) return false;

	const formData = data as Record<string, unknown>;

	return (
		typeof formData.identifier === 'string' &&
		typeof formData.word1 === 'string' &&
		typeof formData.word2 === 'string' &&
		typeof formData.word3 === 'string' &&
		formData.identifier.trim().length > 0 &&
		formData.word1.trim().length > 0 &&
		formData.word2.trim().length > 0 &&
		formData.word3.trim().length > 0
	);
}

/**
 * Get user-friendly error message for authentication errors
 */
export function getAuthErrorMessage(error: SecretAuthError): string {
	switch (error) {
		case 'INVALID_CREDENTIALS':
		case 'USER_NOT_FOUND':
			// Generic message to avoid user enumeration
			return 'Invalid credentials. Please check your identifier and passphrase.';
		case 'SESSION_EXPIRED':
			return 'Your session has expired. Please log in again.';
		case 'DECRYPTION_FAILED':
			return 'Unable to verify credentials. Please try again.';
		case 'VALIDATION_ERROR':
			return 'Invalid input format. Please check your entries.';
		default:
			return 'Authentication failed. Please try again.';
	}
}
