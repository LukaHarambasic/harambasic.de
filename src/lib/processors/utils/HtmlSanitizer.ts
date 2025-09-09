/**
 * Simple HTML sanitizer for markdown-generated content
 *
 * This is a lightweight sanitizer designed specifically for markdown-generated HTML
 * in a static site generator context. For user-generated content, consider using
 * a more comprehensive library like DOMPurify.
 */

export interface SanitizationConfig {
	/** Whether sanitization is enabled */
	enabled: boolean;
	/** List of allowed HTML tags */
	allowedTags: string[];
	/** List of allowed HTML attributes */
	allowedAttributes: string[];
	/** Whether to allow data-* attributes */
	allowDataAttributes: boolean;
}

export class HtmlSanitizer {
	private config: SanitizationConfig;

	constructor(config: SanitizationConfig) {
		this.config = config;
	}

	/**
	 * Sanitize HTML content based on configuration
	 */
	sanitize(html: string): string {
		if (!this.config.enabled) {
			return html;
		}

		// Simple tag and attribute sanitization using regex
		// Note: This is a basic implementation suitable for markdown-generated HTML
		// For more complex scenarios, consider using a proper HTML parser

		let sanitized = html;

		// Remove script tags completely (security critical)
		sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gis, '');

		// Remove on* event handlers (security critical)
		sanitized = sanitized.replace(/\s(on\w+)\s*=\s*['"[^'"]*[']/gi, '');

		// Remove javascript: URLs (security critical)
		sanitized = sanitized.replace(/javascript:/gi, '');

		// Filter allowed tags if specified
		if (this.config.allowedTags.length > 0) {
			const allowedTagsPattern = this.config.allowedTags.join('|');
			const tagRegex = new RegExp(`</?(?!(${allowedTagsPattern})\\b)[^>]+>`, 'gi');
			sanitized = sanitized.replace(tagRegex, '');
		}

		// Filter allowed attributes if specified
		if (this.config.allowedAttributes.length > 0) {
			const attributePattern = this.buildAttributePattern();
			sanitized = sanitized.replace(/<([^>]+)>/g, (match, tagContent) => {
				return this.sanitizeTagAttributes(tagContent, attributePattern);
			});
		}

		return sanitized;
	}

	/**
	 * Build regex pattern for allowed attributes
	 */
	private buildAttributePattern(): RegExp {
		const allowedAttrs = this.config.allowedAttributes.join('|');
		const dataAttrPattern = this.config.allowDataAttributes ? '|data-\\w+' : '';
		return new RegExp(
			`\\s((?!(${allowedAttrs}${dataAttrPattern})\\b)\\w+)\\s*=\\s*['"[^'"]*['"]`,
			'gi'
		);
	}

	/**
	 * Sanitize attributes within a tag
	 */
	private sanitizeTagAttributes(tagContent: string, disallowedPattern: RegExp): string {
		const sanitizedContent = tagContent.replace(disallowedPattern, '');
		return `<${sanitizedContent}>`;
	}
}

/**
 * Default safe configuration for markdown-generated HTML
 */
export const DEFAULT_SANITIZATION_CONFIG: SanitizationConfig = {
	enabled: true,
	allowedTags: [
		'p',
		'br',
		'strong',
		'em',
		'code',
		'pre',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'ul',
		'ol',
		'li',
		'a',
		'blockquote',
		'table',
		'tr',
		'td',
		'th',
		'thead',
		'tbody'
	],
	allowedAttributes: ['href', 'title', 'alt', 'class', 'id', 'aria-label'],
	allowDataAttributes: false
};
