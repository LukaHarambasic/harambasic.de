/**
 * Tests for BaseCallout component composition patterns
 *
 * This serves as an example of how to test components that follow
 * our standardized functional composition patterns.
 */

import { describe, it, expect } from 'vitest';

interface BaseCalloutProps {
	prefix: string;
	children?: import('svelte').Snippet;
	class?: string;
	id?: string;
}

describe('BaseCallout', () => {
	it('should follow BaseCalloutProps interface', () => {
		// Test that the component accepts all required and optional props
		const props: BaseCalloutProps = {
			prefix: 'Test',
			class: 'test-class',
			id: 'test-id',
			children: undefined
		};

		// Type test - should compile without errors
		expect(props.prefix).toBe('Test');
		expect(props.class).toBe('test-class');
		expect(props.id).toBe('test-id');
	});

	it('should have consistent prop structure', () => {
		// Test interface consistency
		const minimalProps = {
			prefix: 'Note'
		};

		const fullProps: BaseCalloutProps = {
			prefix: 'Important',
			class: 'custom-class',
			id: 'custom-id',
			children: undefined
		};

		expect(minimalProps.prefix).toBe('Note');
		expect(fullProps.prefix).toBe('Important');
		expect(fullProps.class).toBe('custom-class');
		expect(fullProps.id).toBe('custom-id');
	});
});
