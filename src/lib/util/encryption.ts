/**
 * Encryption utilities for the secret content system
 * Uses Web Crypto API with AES-GCM for authenticated encryption
 * and PBKDF2 for secure key derivation from passphrases
 */

// Encryption constants following security best practices
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // bits
const IV_LENGTH = 12; // bytes (96 bits for GCM)
const SALT_LENGTH = 16; // bytes (128 bits)
const TAG_LENGTH = 16; // bytes (128 bits)
const PBKDF2_ITERATIONS = 100000; // OWASP recommended minimum

// Type definitions for encrypted data structure
export type EncryptedData = {
	data: string; // base64 encoded encrypted data
	iv: string; // base64 encoded initialization vector
	salt: string; // base64 encoded salt for key derivation
	algorithm: string; // encryption algorithm used
	iterations: number; // PBKDF2 iterations used
};

export type SecretUser = {
	identifier: string;
	passphrase: [string, string, string]; // exactly 3 words
};

export type SecretUsers = Record<string, [string, string, string]>;

/**
 * Generate cryptographically secure random bytes
 */
function getRandomBytes(length: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}

/**
 * Derive encryption key from passphrase using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
	// Import passphrase as a key for PBKDF2
	const baseKey = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(passphrase),
		'PBKDF2',
		false,
		['deriveBits', 'deriveKey']
	);

	// Derive the actual encryption key
	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256'
		},
		baseKey,
		{ name: ALGORITHM, length: KEY_LENGTH },
		false,
		['encrypt', 'decrypt']
	);
}

/**
 * Encrypt data using AES-GCM with PBKDF2 key derivation
 */
export async function encryptData(data: string, passphrase: string): Promise<EncryptedData> {
	try {
		// Generate random salt and IV
		const salt = getRandomBytes(SALT_LENGTH);
		const iv = getRandomBytes(IV_LENGTH);

		// Derive encryption key from passphrase
		const key = await deriveKey(passphrase, salt);

		// Encrypt the data
		const encodedData = new TextEncoder().encode(data);
		const encryptedBuffer = await crypto.subtle.encrypt(
			{
				name: ALGORITHM,
				iv: iv,
				tagLength: TAG_LENGTH * 8 // Convert to bits
			},
			key,
			encodedData
		);

		return {
			data: arrayBufferToBase64(encryptedBuffer),
			iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
			salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
			algorithm: ALGORITHM,
			iterations: PBKDF2_ITERATIONS
		};
	} catch (error) {
		throw new Error(
			`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/**
 * Decrypt data using AES-GCM with PBKDF2 key derivation
 */
export async function decryptData(
	encryptedData: EncryptedData,
	passphrase: string
): Promise<string> {
	try {
		// Validate algorithm compatibility
		if (encryptedData.algorithm !== ALGORITHM) {
			throw new Error(`Unsupported algorithm: ${encryptedData.algorithm}`);
		}

		// Convert base64 back to binary data
		const salt = new Uint8Array(base64ToArrayBuffer(encryptedData.salt));
		const iv = new Uint8Array(base64ToArrayBuffer(encryptedData.iv));
		const data = base64ToArrayBuffer(encryptedData.data);

		// Derive the same key using stored salt
		const key = await deriveKey(passphrase, salt);

		// Decrypt the data
		const decryptedBuffer = await crypto.subtle.decrypt(
			{
				name: ALGORITHM,
				iv: iv,
				tagLength: TAG_LENGTH * 8 // Convert to bits
			},
			key,
			data
		);

		return new TextDecoder().decode(decryptedBuffer);
	} catch {
		// Return a generic error to avoid leaking information
		throw new Error('Decryption failed - invalid passphrase or corrupted data');
	}
}

/**
 * Constant-time string comparison to prevent timing attacks
 * Compares two strings character by character without early exit
 */
export function constantTimeCompare(a: string, b: string): boolean {
	// If lengths differ, still do the comparison to prevent timing leaks
	const aLen = a.length;
	const bLen = b.length;
	const maxLen = Math.max(aLen, bLen);

	let result = aLen === bLen ? 0 : 1;

	for (let i = 0; i < maxLen; i++) {
		const aChar = i < aLen ? a.charCodeAt(i) : 0;
		const bChar = i < bLen ? b.charCodeAt(i) : 0;
		result |= aChar ^ bChar;
	}

	return result === 0;
}

/**
 * Validate 3-word passphrase format
 */
export function isValidPassphrase(words: unknown): words is [string, string, string] {
	return (
		Array.isArray(words) &&
		words.length === 3 &&
		words.every((word) => typeof word === 'string' && word.trim().length > 0)
	);
}

/**
 * Normalize passphrase for consistent comparison
 * Joins 3 words with single space, trimmed and lowercase
 */
export function normalizePassphrase(words: [string, string, string]): string {
	return words.map((word) => word.trim().toLowerCase()).join(' ');
}

/**
 * Validate secret users data structure
 */
export function isValidSecretUsers(data: unknown): data is SecretUsers {
	if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;

	const users = data as Record<string, unknown>;

	for (const [identifier, passphrase] of Object.entries(users)) {
		if (typeof identifier !== 'string' || identifier.trim().length === 0) {
			return false;
		}
		if (!isValidPassphrase(passphrase)) {
			return false;
		}
	}

	return true;
}
