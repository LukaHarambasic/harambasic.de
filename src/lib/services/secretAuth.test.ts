import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	authenticateUser,
	createSession,
	getSession,
	clearSession,
	isAuthenticated,
	getCurrentUser,
	extendSession,
	validateAuthForm,
	getAuthErrorMessage
} from './secretAuth';
import type { AuthFormData, SecretUsers } from '$lib/types/secret';
import type { EncryptedData } from '$lib/util/encryption';

// Mock browser environment
const mockSessionStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn()
};

// Mock browser and session storage
vi.mock('$app/environment', () => ({
	browser: true
}));

beforeEach(() => {
	// Reset mocks
	vi.clearAllMocks();

	// Mock global objects
	global.window = {
		sessionStorage: mockSessionStorage
	} as any;

	// Reset session storage mock
	mockSessionStorage.getItem.mockReturnValue(null);
	mockSessionStorage.setItem.mockImplementation(() => {});
	mockSessionStorage.removeItem.mockImplementation(() => {});
});

// Mock encryption functions
vi.mock('$lib/util/encryption', () => ({
	decryptData: vi.fn(),
	constantTimeCompare: vi.fn(),
	normalizePassphrase: vi.fn()
}));

import { decryptData, constantTimeCompare, normalizePassphrase } from '$lib/util/encryption';

describe('authenticateUser', () => {
	const mockEncryptedUsers: EncryptedData = {
		data: 'encrypted_data',
		iv: 'iv_data',
		salt: 'salt_data',
		algorithm: 'AES-GCM',
		iterations: 100000
	};

	const mockAuthData: AuthFormData = {
		identifier: 'john',
		word1: 'ocean',
		word2: 'mountain',
		word3: 'telescope'
	};

	const mockUsers: SecretUsers = {
		john: ['ocean', 'mountain', 'telescope'],
		sarah: ['garden', 'sunset', 'bicycle']
	};

	beforeEach(() => {
		vi.mocked(decryptData).mockResolvedValue(JSON.stringify(mockUsers));
		vi.mocked(normalizePassphrase).mockImplementation((words) => words.join(' ').toLowerCase());
		vi.mocked(constantTimeCompare).mockImplementation((a, b) => a === b);
	});

	it('should authenticate user successfully with correct credentials', async () => {
		const result = await authenticateUser(mockEncryptedUsers, mockAuthData, 'master-password');

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.userIdentifier).toBe('john');
		}
		expect(decryptData).toHaveBeenCalledWith(mockEncryptedUsers, 'master-password');
	});

	it('should fail authentication with wrong passphrase', async () => {
		vi.mocked(constantTimeCompare).mockImplementation((a, b) => {
			// Simulate wrong passphrase comparison
			if (a.includes('ocean mountain telescope') && b.includes('wrong words here')) {
				return false;
			}
			return a === b;
		});

		const wrongAuthData: AuthFormData = {
			identifier: 'john',
			word1: 'wrong',
			word2: 'words',
			word3: 'here'
		};

		const result = await authenticateUser(mockEncryptedUsers, wrongAuthData, 'master-password');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('INVALID_CREDENTIALS');
		}
	});

	it('should fail authentication with non-existent user', async () => {
		const nonExistentAuthData: AuthFormData = {
			identifier: 'nonexistent',
			word1: 'any',
			word2: 'words',
			word3: 'here'
		};

		const result = await authenticateUser(
			mockEncryptedUsers,
			nonExistentAuthData,
			'master-password'
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('USER_NOT_FOUND');
		}
	});

	it('should handle decryption failure', async () => {
		vi.mocked(decryptData).mockRejectedValue(new Error('Decryption failed'));

		const result = await authenticateUser(
			mockEncryptedUsers,
			mockAuthData,
			'wrong-master-password'
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('DECRYPTION_FAILED');
		}
	});

	it('should handle invalid users data format', async () => {
		vi.mocked(decryptData).mockResolvedValue('invalid json');

		const result = await authenticateUser(mockEncryptedUsers, mockAuthData, 'master-password');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe('VALIDATION_ERROR');
		}
	});
});

describe('Session Management', () => {
	const mockCurrentTime = 1640995200000; // 2022-01-01 00:00:00

	beforeEach(() => {
		vi.spyOn(Date, 'now').mockReturnValue(mockCurrentTime);
	});

	describe('createSession', () => {
		it('should create and store session successfully', () => {
			const userIdentifier = 'john';
			const result = createSession(userIdentifier);

			expect(result.isAuthenticated).toBe(true);
			expect(result.userIdentifier).toBe(userIdentifier);
			expect(result.sessionExpiry).toBe(mockCurrentTime + 24 * 60 * 60 * 1000);
			expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
				'secret-auth-session',
				JSON.stringify(result)
			);
		});

		it('should handle session storage errors gracefully', () => {
			mockSessionStorage.setItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			const result = createSession('john');

			expect(result.isAuthenticated).toBe(true);
			expect(result.userIdentifier).toBe('john');
			// Should not throw error
		});
	});

	describe('getSession', () => {
		it('should return valid session when not expired', () => {
			const validSession = {
				isAuthenticated: true,
				userIdentifier: 'john',
				sessionExpiry: mockCurrentTime + 1000 // Not expired
			};

			mockSessionStorage.getItem.mockReturnValue(JSON.stringify(validSession));

			const result = getSession();

			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.userIdentifier).toBe('john');
			}
		});

		it('should return invalid session when expired', () => {
			const expiredSession = {
				isAuthenticated: true,
				userIdentifier: 'john',
				sessionExpiry: mockCurrentTime - 1000 // Expired
			};

			mockSessionStorage.getItem.mockReturnValue(JSON.stringify(expiredSession));

			const result = getSession();

			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe('SESSION_EXPIRED');
			}
			expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('secret-auth-session');
		});

		it('should return invalid session when no session exists', () => {
			mockSessionStorage.getItem.mockReturnValue(null);

			const result = getSession();

			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe('SESSION_EXPIRED');
			}
		});

		it('should handle invalid session data format', () => {
			mockSessionStorage.getItem.mockReturnValue('invalid json');

			const result = getSession();

			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe('VALIDATION_ERROR');
			}
			expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('secret-auth-session');
		});
	});

	describe('clearSession', () => {
		it('should remove session from storage', () => {
			clearSession();

			expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('secret-auth-session');
		});

		it('should handle storage errors gracefully', () => {
			mockSessionStorage.removeItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			// Should not throw error
			expect(() => clearSession()).not.toThrow();
		});
	});

	describe('isAuthenticated', () => {
		it('should return true for valid session', () => {
			const validSession = {
				isAuthenticated: true,
				userIdentifier: 'john',
				sessionExpiry: mockCurrentTime + 1000
			};

			mockSessionStorage.getItem.mockReturnValue(JSON.stringify(validSession));

			expect(isAuthenticated()).toBe(true);
		});

		it('should return false for invalid session', () => {
			mockSessionStorage.getItem.mockReturnValue(null);

			expect(isAuthenticated()).toBe(false);
		});
	});

	describe('getCurrentUser', () => {
		it('should return user identifier for valid session', () => {
			const validSession = {
				isAuthenticated: true,
				userIdentifier: 'john',
				sessionExpiry: mockCurrentTime + 1000
			};

			mockSessionStorage.getItem.mockReturnValue(JSON.stringify(validSession));

			expect(getCurrentUser()).toBe('john');
		});

		it('should return null for invalid session', () => {
			mockSessionStorage.getItem.mockReturnValue(null);

			expect(getCurrentUser()).toBe(null);
		});
	});

	describe('extendSession', () => {
		it('should extend session expiry for valid session', () => {
			const validSession = {
				isAuthenticated: true,
				userIdentifier: 'john',
				sessionExpiry: mockCurrentTime + 1000
			};

			mockSessionStorage.getItem.mockReturnValue(JSON.stringify(validSession));

			const result = extendSession();

			expect(result).toBe(true);
			expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
				'secret-auth-session',
				JSON.stringify({
					isAuthenticated: true,
					userIdentifier: 'john',
					sessionExpiry: mockCurrentTime + 24 * 60 * 60 * 1000
				})
			);
		});

		it('should fail to extend invalid session', () => {
			mockSessionStorage.getItem.mockReturnValue(null);

			const result = extendSession();

			expect(result).toBe(false);
		});
	});
});

describe('validateAuthForm', () => {
	it('should validate correct form data', () => {
		const validData: AuthFormData = {
			identifier: 'john',
			word1: 'ocean',
			word2: 'mountain',
			word3: 'telescope'
		};

		expect(validateAuthForm(validData)).toBe(true);
	});

	it('should reject invalid form data', () => {
		expect(validateAuthForm(null)).toBe(false);
		expect(validateAuthForm(undefined)).toBe(false);
		expect(validateAuthForm('not an object')).toBe(false);
		expect(validateAuthForm({})).toBe(false);
		expect(validateAuthForm({ identifier: '', word1: 'a', word2: 'b', word3: 'c' })).toBe(false);
		expect(validateAuthForm({ identifier: 'john', word1: '', word2: 'b', word3: 'c' })).toBe(false);
		expect(validateAuthForm({ identifier: 'john', word1: '   ', word2: 'b', word3: 'c' })).toBe(
			false
		);
	});
});

describe('getAuthErrorMessage', () => {
	it('should return appropriate error messages', () => {
		expect(getAuthErrorMessage('INVALID_CREDENTIALS')).toContain('Invalid credentials');
		expect(getAuthErrorMessage('USER_NOT_FOUND')).toContain('Invalid credentials');
		expect(getAuthErrorMessage('SESSION_EXPIRED')).toContain('session has expired');
		expect(getAuthErrorMessage('DECRYPTION_FAILED')).toContain('Unable to verify');
		expect(getAuthErrorMessage('VALIDATION_ERROR')).toContain('Invalid input');
	});

	it('should return generic message for unknown errors', () => {
		expect(getAuthErrorMessage('UNKNOWN_ERROR' as any)).toContain('Authentication failed');
	});
});
