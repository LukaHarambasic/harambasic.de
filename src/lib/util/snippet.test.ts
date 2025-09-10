/**
 * Tests for snippet utility functions
 *
 * These tests ensure our functional composition utilities work correctly
 * and provide proper TypeScript inference.
 */

import { describe, it, expect } from 'vitest';
import {
	hasSnippet,
	hasAnySnippet,
	hasAllSnippets,
	snippetClass,
	assertSnippet,
	conditionalSnippet
} from './snippet';

describe('snippet utilities', () => {
	// Mock snippet objects for testing
	const mockSnippet = { toString: () => 'mock-snippet' } as import('svelte').Snippet;
	const mockSnippet2 = { toString: () => 'mock-snippet-2' } as import('svelte').Snippet;

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

	describe('hasAnySnippet', () => {
		it('should return true when at least one snippet exists', () => {
			expect(hasAnySnippet(mockSnippet, undefined, null as any)).toBe(true);
			expect(hasAnySnippet(undefined, mockSnippet)).toBe(true);
		});

		it('should return false when no snippets exist', () => {
			expect(hasAnySnippet(undefined, null as any)).toBe(false);
			expect(hasAnySnippet()).toBe(false);
		});

		it('should handle single snippet', () => {
			expect(hasAnySnippet(mockSnippet)).toBe(true);
			expect(hasAnySnippet(undefined)).toBe(false);
		});
	});

	describe('hasAllSnippets', () => {
		it('should return true when all snippets exist', () => {
			expect(hasAllSnippets(mockSnippet, mockSnippet2)).toBe(true);
		});

		it('should return false when any snippet is missing', () => {
			expect(hasAllSnippets(mockSnippet, undefined)).toBe(false);
			expect(hasAllSnippets(undefined, mockSnippet)).toBe(false);
		});

		it('should handle single snippet', () => {
			expect(hasAllSnippets(mockSnippet)).toBe(true);
			expect(hasAllSnippets(undefined)).toBe(false);
		});

		it('should return true for empty arguments', () => {
			expect(hasAllSnippets()).toBe(true);
		});
	});

	describe('snippetClass', () => {
		it('should return class name when snippet exists', () => {
			expect(snippetClass(mockSnippet, 'active')).toBe('active');
		});

		it('should return undefined when snippet does not exist and no fallback', () => {
			expect(snippetClass(undefined, 'active')).toBeUndefined();
		});

		it('should return fallback class when snippet does not exist', () => {
			expect(snippetClass(undefined, 'active', 'inactive')).toBe('inactive');
		});

		it('should return class when snippet exists and fallback provided', () => {
			expect(snippetClass(mockSnippet, 'active', 'inactive')).toBe('active');
		});
	});

	describe('assertSnippet', () => {
		it('should return true for valid snippet', () => {
			expect(assertSnippet(mockSnippet)).toBe(true);
		});

		it('should return false for undefined', () => {
			expect(assertSnippet(undefined)).toBe(false);
		});

		it('should provide proper type narrowing', () => {
			const snippet: import('svelte').Snippet | undefined = mockSnippet;

			if (assertSnippet(snippet)) {
				// TypeScript should now know that snippet is not undefined
				expect(snippet).toBe(mockSnippet);
			}
		});
	});

	describe('conditionalSnippet', () => {
		it('should return snippet when condition is true and snippet exists', () => {
			expect(conditionalSnippet(mockSnippet, true)).toBe(mockSnippet);
		});

		it('should return undefined when condition is false', () => {
			expect(conditionalSnippet(mockSnippet, false)).toBeUndefined();
		});

		it('should return undefined when snippet does not exist', () => {
			expect(conditionalSnippet(undefined, true)).toBeUndefined();
		});

		it('should work with function conditions', () => {
			expect(conditionalSnippet(mockSnippet, () => true)).toBe(mockSnippet);
			expect(conditionalSnippet(mockSnippet, () => false)).toBeUndefined();
		});

		it('should handle complex function conditions', () => {
			let shouldShow = false;
			const condition = () => shouldShow;

			expect(conditionalSnippet(mockSnippet, condition)).toBeUndefined();

			shouldShow = true;
			expect(conditionalSnippet(mockSnippet, condition)).toBe(mockSnippet);
		});
	});
});
