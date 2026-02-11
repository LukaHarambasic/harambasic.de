/**
 * Content creation functions using pure functions and composition
 * Each function has clear inputs/outputs with no side effects
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { 
	generateFilePath, 
	getStaticDirectory, 
	generateSlug, 
	validateContentMetadata 
} from './util.js';
import { renderTemplate, getTemplate, getDefaultTemplate } from './templates.js';

/**
 * Content creation options type
 * @typedef {Object} ContentCreationOptions
 * @property {string} type - Content type (post, project, uses)
 * @property {string} [templateName] - Specific template to use
 * @property {object} metadata - Content metadata
 * @property {boolean} [createImageDir] - Whether to create image directory
 */

/**
 * Content creation result type
 * @typedef {Object} ContentCreationResult
 * @property {boolean} success - Whether creation was successful
 * @property {string} filePath - Path to created file
 * @property {string} [imageDirPath] - Path to created image directory
 * @property {string[]} [errors] - Any errors that occurred
 */

/**
 * Validates content creation options
 * @param {ContentCreationOptions} options - Options to validate
 * @returns {object} Validation result with valid flag and errors
 */
function validateCreationOptions(options) {
	const errors = [];
	
	if (!options.type || typeof options.type !== 'string') {
		errors.push('Content type is required and must be a string');
	}
	
	if (!['post', 'project', 'uses', 'shareable', 'snippet'].includes(options.type)) {
		errors.push('Content type must be one of: post, project, uses, shareable, snippet');
	}
	
	if (!options.metadata || typeof options.metadata !== 'object') {
		errors.push('Metadata is required and must be an object');
	}
	
	// Validate metadata if provided
	if (options.metadata) {
		const metadataValidation = validateContentMetadata(options.metadata);
		errors.push(...metadataValidation.errors.map(e => e.message));
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Selects the appropriate template for content creation
 * @param {string} contentType - Type of content
 * @param {string} [templateName] - Specific template name
 * @returns {ContentTemplate|null} Selected template or null
 */
function selectTemplate(contentType, templateName) {
	if (templateName) {
		const template = getTemplate(templateName);
		if (template && template.type === contentType) {
			return template;
		}
		// Fall back to default if specified template doesn't match
	}
	
	return getDefaultTemplate(contentType);
}

/**
 * Ensures directory exists by creating it if necessary
 * @param {string} filePath - File path to ensure directory for
 */
function ensureDirectory(filePath) {
	const dir = dirname(filePath);
	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		// Directory might already exist, ignore EEXIST errors
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
}

/**
 * Creates image directory for content if needed
 * @param {string} contentType - Type of content
 * @param {string} slug - Content slug for directory name
 * @returns {string|null} Created directory path or null
 */
function createImageDirectory(contentType, slug) {
	if (contentType !== 'post') return null; // Only posts get image directories
	
	const staticDir = getStaticDirectory(contentType);
	const imageDirPath = `${staticDir}/${slug}`;
	
	try {
		mkdirSync(imageDirPath, { recursive: true });
		return imageDirPath;
	} catch (error) {
		// Directory might already exist
		if (error.code === 'EEXIST') {
			return imageDirPath;
		}
		throw error;
	}
}

/**
 * Writes content to file atomically
 * @param {string} filePath - Path to write to
 * @param {string} content - Content to write
 */
function writeContentFile(filePath, content) {
	ensureDirectory(filePath);
	writeFileSync(filePath, content, 'utf8');
}

/**
 * Creates content with given options
 * @param {ContentCreationOptions} options - Content creation options
 * @returns {ContentCreationResult} Creation result
 */
export function createContent(options) {
	// Validate input options
	const validation = validateCreationOptions(options);
	if (!validation.valid) {
		return {
			success: false,
			filePath: '',
			errors: validation.errors
		};
	}
	
	try {
		// Select template
		const template = selectTemplate(options.type, options.templateName);
		if (!template) {
			return {
				success: false,
				filePath: '',
				errors: [`No template found for content type: ${options.type}`]
			};
		}
		
		// Generate file path
		const filePath = generateFilePath(options.type, options.metadata.title);
		
		// Render content
		const content = renderTemplate(template, options.metadata);
		
		// Write content file
		writeContentFile(filePath, content);
		
		// Create image directory if requested
		let imageDirPath;
		if (options.createImageDir && options.type === 'post') {
			const slug = generateSlug(options.metadata.title);
			imageDirPath = createImageDirectory(options.type, slug);
		}
		
		return {
			success: true,
			filePath,
			imageDirPath
		};
		
	} catch (error) {
		return {
			success: false,
			filePath: '',
			errors: [`Failed to create content: ${error.message}`]
		};
	}
}

/**
 * Creates a blog post with specific defaults
 * @param {object} metadata - Post metadata
 * @param {string} [templateName] - Template to use
 * @returns {ContentCreationResult} Creation result
 */
export function createPost(metadata, templateName = 'basic-post') {
	return createContent({
		type: 'post',
		templateName,
		metadata,
		createImageDir: true
	});
}

/**
 * Creates a project entry with specific defaults
 * @param {object} metadata - Project metadata
 * @returns {ContentCreationResult} Creation result
 */
export function createProject(metadata) {
	return createContent({
		type: 'project',
		templateName: 'basic-project',
		metadata,
		createImageDir: false
	});
}

/**
 * Creates a uses entry with specific defaults
 * @param {object} metadata - Uses entry metadata
 * @returns {ContentCreationResult} Creation result
 */
export function createUses(metadata) {
	return createContent({
		type: 'uses',
		templateName: 'basic-uses',
		metadata,
		createImageDir: false
	});
}

/**
 * Composes content creation with validation and error handling
 * @param {function} creationFn - Content creation function
 * @param {function} validationFn - Additional validation function
 * @returns {function} Composed creation function
 */
export function withValidation(creationFn, validationFn) {
	return (metadata, ...args) => {
		const validation = validationFn(metadata);
		if (!validation.valid) {
			return {
				success: false,
				filePath: '',
				errors: validation.errors.map(e => e.message || e)
			};
		}
		
		return creationFn(metadata, ...args);
	};
}

/**
 * Composes content creation with post-creation hooks
 * @param {function} creationFn - Content creation function
 * @param {function} hookFn - Post-creation hook function
 * @returns {function} Composed creation function
 */
export function withPostCreationHook(creationFn, hookFn) {
	return (...args) => {
		const result = creationFn(...args);
		
		if (result.success) {
			try {
				hookFn(result);
			} catch (error) {
				// Don't fail the creation, just log the hook error
				console.warn('Post-creation hook failed:', error.message);
			}
		}
		
		return result;
	};
}