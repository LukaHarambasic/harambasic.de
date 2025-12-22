import { describe, it, expect } from 'vitest';
import {
	constantTimeCompare,
	isValidPassphrase,
	normalizePassphrase,
	isValidSecretUsers,
	type SecretUsers
} from './encryption';

// Test the pure utility functions without crypto dependencies

describe('constantTimeCompare', () => {
	it('should return true for identical strings', () => {
		expect(constantTimeCompare('hello', 'hello')).toBe(true);
		expect(constantTimeCompare('', '')).toBe(true);
		expect(constantTimeCompare('abc123', 'abc123')).toBe(true);
	});

	it('should return false for different strings', () => {
		expect(constantTimeCompare('hello', 'world')).toBe(false);
		expect(constantTimeCompare('abc', 'def')).toBe(false);
		expect(constantTimeCompare('test', 'testing')).toBe(false);
	});

	it('should return false for strings of different lengths', () => {
		expect(constantTimeCompare('short', 'longer string')).toBe(false);
		expect(constantTimeCompare('long string', 'short')).toBe(false);
		expect(constantTimeCompare('', 'nonempty')).toBe(false);
	});

	it('should handle edge cases', () => {
		expect(constantTimeCompare('a', 'b')).toBe(false);
		expect(constantTimeCompare('A', 'a')).toBe(false); // Case sensitive
	});
});

describe('isValidPassphrase', () => {
	it('should return true for valid 3-word passphrases', () => {
		expect(isValidPassphrase(['ocean', 'mountain', 'telescope'])).toBe(true);
		expect(isValidPassphrase(['one', 'two', 'three'])).toBe(true);
		expect(isValidPassphrase(['  word1  ', 'word2', 'word3'])).toBe(true); // Trimming handled later
	});

	it('should return false for invalid passphrases', () => {
		expect(isValidPassphrase(['only', 'two'])).toBe(false);
		expect(isValidPassphrase(['one', 'two', 'three', 'four'])).toBe(false);
		expect(isValidPassphrase([])).toBe(false);
		expect(isValidPassphrase('not an array')).toBe(false);
		expect(isValidPassphrase(null)).toBe(false);
		expect(isValidPassphrase(undefined)).toBe(false);
		expect(isValidPassphrase([1, 2, 3])).toBe(false);
		expect(isValidPassphrase(['valid', '', 'words'])).toBe(false);
		expect(isValidPassphrase(['valid', 'words', '   '])).toBe(false); // Only whitespace
	});
});

describe('normalizePassphrase', () => {
	it('should normalize passphrase correctly', () => {
		expect(normalizePassphrase(['Ocean', 'Mountain', 'Telescope'])).toBe(
			'ocean mountain telescope'
		);
		expect(normalizePassphrase(['  WORD1  ', 'Word2', 'WORD3'])).toBe('word1 word2 word3');
		expect(normalizePassphrase(['one', 'two', 'three'])).toBe('one two three');
	});

	it('should handle edge cases', () => {
		expect(normalizePassphrase(['', '', ''])).toBe('  ');
		expect(normalizePassphrase(['A', 'B', 'C'])).toBe('a b c');
	});
});

describe('isValidSecretUsers', () => {
	it('should return true for valid secret users data', () => {
		const validUsers: SecretUsers = {
			john: ['ocean', 'mountain', 'telescope'],
			sarah: ['garden', 'sunset', 'bicycle'],
			family: ['coffee', 'bridge', 'starlight']
		};

		expect(isValidSecretUsers(validUsers)).toBe(true);
	});

	it('should return true for empty users object', () => {
		expect(isValidSecretUsers({})).toBe(true);
	});

	it('should return false for invalid data types', () => {
		expect(isValidSecretUsers(null)).toBe(false);
		expect(isValidSecretUsers(undefined)).toBe(false);
		expect(isValidSecretUsers('not an object')).toBe(false);
		expect(isValidSecretUsers([])).toBe(false);
		expect(isValidSecretUsers(123)).toBe(false);
	});

	it('should return false for invalid user identifiers', () => {
		expect(isValidSecretUsers({ '': ['word1', 'word2', 'word3'] })).toBe(false);
		expect(isValidSecretUsers({ '   ': ['word1', 'word2', 'word3'] })).toBe(false);
	});

	it('should return false for invalid passphrases', () => {
		expect(isValidSecretUsers({ user1: ['only', 'two'] })).toBe(false);
		expect(isValidSecretUsers({ user1: ['one', 'two', 'three', 'four'] })).toBe(false);
		expect(isValidSecretUsers({ user1: ['valid', '', 'words'] })).toBe(false);
		expect(isValidSecretUsers({ user1: 'not an array' as any })).toBe(false);
		expect(isValidSecretUsers({ user1: [1, 2, 3] as any })).toBe(false);
	});

	it('should return false for mixed valid and invalid entries', () => {
		const mixedUsers = {
			validUser: ['word1', 'word2', 'word3'],
			invalidUser: ['only', 'two']
		};

		expect(isValidSecretUsers(mixedUsers)).toBe(false);
	});
});
