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

	// Image enhancement implementation
	// Note: Full enhancement requires build-time processing integration
	
	// Add loading="lazy" for performance
	if (!node.properties.loading) {
		node.properties.loading = 'lazy';
	}
	
	// Add decoding="async" for better performance
	if (!node.properties.decoding) {
		node.properties.decoding = 'async';
	}

	if (responsive && sizes) {
		// Add sizes attribute for responsive images
		if (!node.properties.sizes) {
			node.properties.sizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
		}
		
		// Add quality parameter if specified
		if (quality && quality !== 80) {
			const separator = src.includes('?') ? '&' : '?';
			node.properties.src = `${src}${separator}q=${quality}`;
		}
		
		// Prepare for future enhanced:img integration
		// This sets up the groundwork for when build-time image processing is available
		// node.tagName = 'enhanced:img';
		// node.properties.src = generateResponsiveSources(src, [1920, 1280, 640, 400]);
	} else if (quality && quality !== 80) {
		// Apply quality parameter even for non-responsive images
		const separator = src.includes('?') ? '&' : '?';
		node.properties.src = `${src}${separator}q=${quality}`;
	}
}
