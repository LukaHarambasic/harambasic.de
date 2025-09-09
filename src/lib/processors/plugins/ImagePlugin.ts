import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

/**
 * Configuration options for image enhancement
 */
export interface ImageConfig {
	/** Whether to enhance images (default: false) */
	enhance?: boolean;
	/** Whether to enable responsive images */
	responsive?: boolean;
	/** Sizes attribute for responsive images */
	sizes?: string;
	/** Image quality (1-100) */
	quality?: number;
	/** Supported image formats */
	formats?: ('webp' | 'avif' | 'jpeg' | 'png')[];
}

/**
 * Element node representation for image processing
 */
interface Element {
	tagName: string;
	properties?: {
		src?: string;
		[key: string]: unknown;
	};
}

/**
 * Creates a rehype plugin for enhancing image elements
 *
 * @param config Configuration options for image enhancement
 * @returns Rehype plugin function
 */
export function createImagePlugin(config: ImageConfig = {}) {
	const { enhance = false, responsive = false, sizes, quality = 80 } = config;

	return function rehypeEnhanceImage() {
		return (tree: Node) => {
			if (!enhance) return;

			visit(tree, 'element', (node: Element) => {
				if (node.tagName === 'img') {
					enhanceImageElement(node, { responsive, sizes, quality });
				}
			});
		};
	};
}

/**
 * Enhances a single image element based on configuration
 *
 * @param node Image element to enhance
 * @param config Enhancement configuration
 */
function enhanceImageElement(
	node: Element,
	config: { responsive?: boolean; sizes?: string; quality?: number }
) {
	const { responsive, sizes, quality } = config;

	if (!node.properties?.src || typeof node.properties.src !== 'string') {
		return;
	}

	const src = node.properties.src;

	// Skip GIFs and SVGs as they don't benefit from enhancement
	if (src.endsWith('.gif') || src.endsWith('.svg')) {
		return;
	}

	// TODO: Implement actual image enhancement logic
	// This is a placeholder for future implementation when the build system supports it

	if (responsive && sizes) {
		// Future enhancement: Convert to enhanced:img component
		// node.tagName = 'enhanced:img';
		// node.properties.src = `${src}?w=1280;640;400`;
		// node.properties.sizes = sizes;

		// For now, just add quality parameter if specified
		if (quality && quality !== 80) {
			const separator = src.includes('?') ? '&' : '?';
			node.properties.src = `${src}${separator}q=${quality}`;
		}
	}
}
