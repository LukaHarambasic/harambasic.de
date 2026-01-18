/**
 * Tests for snippet utility functions
 *
 * These tests ensure our functional composition utilities work correctly
 * and provide proper TypeScript inference.
 */

import { describe, it, expect } from 'vitest';
import { hasSnippet } from './snippet';

describe('snippet utilities', () => {
	const mockSnippet = { toString: () => 'mock-snippet' } as import('svelte').Snippet;

	describe('hasSnippet', () => {
		it('should return true for valid snippet', () => {
			expect(hasSnippet(mockSnippet)).toBe(true);
		});

		it('should return false for undefined', () => {
			expect(hasSnippet(undefined)).toBe(false);
		});

		it('should return false for null', () => {
			expect(hasSnippet(null as any)).toBe(false);
		});
	});
});
