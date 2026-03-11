/**
 * Pure utility functions for content creation and manipulation
 * Following functional programming principles - no side effects, clear inputs/outputs
 */

/**
 * Generates a URL-friendly slug from a title
 * @param {string} title - The title to convert to a slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(title) {
	if (!title || typeof title !== 'string') return '';
	
	return title
		.trim()
		.toLowerCase()
		// Remove all chars which aren't characters, numbers or spaces
		.replace(/[^a-zA-Z0-9\s]+/g, '')
		// Replace all spaces with dashes
		.replace(/\s+/g, '-')
		// Remove leading/trailing dashes
		.replace(/^-+|-+$/g, '');
}

/**
 * Formats a date for content frontmatter using native JavaScript
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export function formatContentDate(date = new Date()) {
	if (!(date instanceof Date) || isNaN(date)) {
		date = new Date();
	}
	
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	
	return `${year}-${month}-${day}`;
}

/**
 * Validates and normalizes tags array
 * @param {string[]|string} tags - Tags as array or comma-separated string
 * @returns {string[]} Normalized tags array
 */
export function normalizeTags(tags) {
	if (!tags) return [];
	
	// Handle string input (comma-separated)
	if (typeof tags === 'string') {
		return tags
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0)
			.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
	}
	
	// Handle array input
	if (Array.isArray(tags)) {
		return tags
			.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
			.map(tag => tag.trim())
			.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
	}
	
	return [];
}

/**
 * Gets the content directory path for a given content type
 * @param {string} contentType - Type of content (post, project, uses, etc.)
 * @returns {string} Directory path for the content type
 */
export function getContentDirectory(contentType) {
	const basePath = 'src/content';
	
	switch (contentType) {
		case 'post':
			return `${basePath}/posts`;
		case 'project':
			return `${basePath}/projects`;
		case 'uses':
			return `${basePath}/uses`;
		case 'shareable':
			return `${basePath}/shareables`;
		case 'snippet':
			return `${basePath}/snippets`;
		default:
			throw new Error(`Unknown content type: ${contentType}`);
	}
}

/**
 * Generates the full file path for content
 * @param {string} contentType - Type of content
 * @param {string} title - Title of the content (will be slugified)
 * @returns {string} Full file path
 */
export function generateFilePath(contentType, title) {
	const directory = getContentDirectory(contentType);
	const slug = generateSlug(title);
	return `${directory}/${slug}.md`;
}

/**
 * Gets the static image directory for a content type
 * @param {string} contentType - Type of content
 * @returns {string} Static directory path
 */
export function getStaticDirectory(contentType) {
	switch (contentType) {
		case 'post':
			return 'static/posts';
		case 'project':
			return 'static/projects';
		case 'uses':
			return 'static/uses';
		default:
			return 'static';
	}
}

/**
 * Validates basic content metadata
 * @param {object} metadata - Content metadata object
 * @returns {object} Validation result with valid flag and errors array
 */
export function validateContentMetadata(metadata) {
	const errors = [];
	
	if (!metadata.title || typeof metadata.title !== 'string' || metadata.title.trim().length < 3) {
		errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
	}
	
	if (!metadata.description || typeof metadata.description !== 'string' || metadata.description.trim().length < 10) {
		errors.push({ field: 'description', message: 'Description must be at least 10 characters long' });
	}
	
	if (metadata.tags && !Array.isArray(metadata.tags) && typeof metadata.tags !== 'string') {
		errors.push({ field: 'tags', message: 'Tags must be an array or comma-separated string' });
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Escapes YAML string values to prevent parsing issues
 * @param {string} value - String value to escape
 * @returns {string} YAML-safe string
 */
export function escapeYamlString(value) {
	if (typeof value !== 'string') return value;
	
	// If the string contains special characters, wrap in quotes
	if (/[:"'#@&*!|>%{}[\]`,\\]/.test(value) || /^\s|\s$/.test(value)) {
		return `"${value.replace(/"/g, '\\"')}"`;
	}
	
	return value;
}