import { expect, test } from 'vitest';
import { getSlug } from './helper';

// Test component utility functions that components rely on

test('component helper - slug generation works correctly for component names', async () => {
	// Test common component name patterns
	expect(getSlug('BaseTag')).toBe('basetag');
	expect(getSlug('Layout Header')).toBe('layout-header');
	expect(getSlug('Entries Filter & Sort')).toBe('entries-filter-sort');
	expect(getSlug('Multiple   Spaces')).toBe('multiple-spaces');
});

test('component helper - empty or invalid inputs handled gracefully', async () => {
	expect(getSlug('')).toBe('');
	expect(getSlug('   ')).toBe('');
	expect(getSlug('!')).toBe('');
	expect(getSlug('@#$%^&*()')).toBe('');
});

// Test that would be used by tag components
test('tag component utilities', async () => {
	const tagDisplays = ['JavaScript', 'Vue.js', 'React', 'TypeScript'];
	const slugs = tagDisplays.map((display) => getSlug(display));

	expect(slugs).toEqual(['javascript', 'vuejs', 'react', 'typescript']);
});

// Test edge cases that components might encounter
test('component edge cases', async () => {
	// Test very long strings
	const longString = 'A'.repeat(1000);
	const longSlug = getSlug(longString);
	expect(longSlug).toBe('a'.repeat(1000));

	// Test unicode characters
	expect(getSlug('Café')).toBe('caf');
	expect(getSlug('naïve')).toBe('nave');

	// Test numbers in component context
	expect(getSlug('Button 2.0')).toBe('button-20');
	expect(getSlug('Version 3.14')).toBe('version-314');
});
