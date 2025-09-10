/**
 * Standardized Component Composition Types
 *
 * Following functional programming principles and Svelte 5 snippet patterns
 * for consistent, testable, and maintainable component interfaces.
 */

// Core composition interface for components with content slots
export interface ComponentWithChildren {
	children?: import('svelte').Snippet;
}

// Extended composition interface for components with multiple named slots
export interface ComponentWithNamedSlots {
	children?: import('svelte').Snippet;
	header?: import('svelte').Snippet;
	footer?: import('svelte').Snippet;
	sidebar?: import('svelte').Snippet;
}

// Layout component interfaces following consistent naming
export interface LayoutComponentProps extends ComponentWithChildren {
	class?: string;
	id?: string;
}

// Base component interfaces for common patterns
export interface BaseComponentProps extends ComponentWithChildren {
	class?: string;
	id?: string;
}

// Modal/Dialog component interface
export interface ModalComponentProps extends ComponentWithChildren {
	isOpen?: boolean;
	onClose?: () => void;
}

// Button-like components with content
export interface ButtonComponentProps extends ComponentWithChildren {
	onclick?: () => void;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

// Container components with flexible content areas
export interface ContainerComponentProps extends ComponentWithNamedSlots {
	class?: string;
}

// Utility type for components that render dynamic content
export type ContentRenderer = import('svelte').Snippet;

// Function type for component event handlers (functional approach)
export type ComponentEventHandler<T = unknown> = (event: T) => void;

// Utility type for optional snippet with conditional rendering
export type OptionalSnippet = import('svelte').Snippet | undefined;
