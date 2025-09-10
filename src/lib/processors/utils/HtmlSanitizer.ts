/**
 * Simple HTML sanitizer for markdown-generated content
 */

export type SanitizationConfig = {
	enabled: boolean;
	allowedTags: string[];
	allowedAttributes: string[];
	allowDataAttributes: boolean;
};

function buildAttributePattern(config: SanitizationConfig): RegExp {
	const allowedAttrs = config.allowedAttributes.join('|');
	const dataAttrPattern = config.allowDataAttributes ? '|data-\\w+' : '';
	return new RegExp(
		`\\s((?!(${allowedAttrs}${dataAttrPattern})\\b)\\w+)\\s*=\\s*['"][^'"]*['"]`,
		'gi'
	);
}

function sanitizeTagAttributes(tagContent: string, disallowedPattern: RegExp): string {
	const sanitizedContent = tagContent.replace(disallowedPattern, '');
	return `<${sanitizedContent}>`;
}

/**
 * Sanitize HTML content based on configuration
 */
export function sanitizeHtml(html: string, config: SanitizationConfig): string {
	if (!config.enabled) {
		return html;
	}

	let sanitized = html;

	sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gis, '');
	sanitized = sanitized.replace(/\s(on\w+)\s*=\s*['"][^'"]*[']/gi, '');
	sanitized = sanitized.replace(/javascript:/gi, '');

	if (config.allowedTags.length > 0) {
		const allowedTagsPattern = config.allowedTags.join('|');
		const tagRegex = new RegExp(`</?(?!(${allowedTagsPattern})\\b)[^>]+>`, 'gi');
		sanitized = sanitized.replace(tagRegex, '');
	}

	if (config.allowedAttributes.length > 0) {
		const attributePattern = buildAttributePattern(config);
		sanitized = sanitized.replace(/<([^>]+)>/g, (match, tagContent) => {
			return sanitizeTagAttributes(tagContent, attributePattern);
		});
	}

	return sanitized;
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
