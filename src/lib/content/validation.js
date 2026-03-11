/**
 * Content validation using pure functions
 * Each validator returns an object with valid flag and errors array
 */

/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {ValidationError[]} errors - Array of validation errors
 */

/**
 * Validation error type
 * @typedef {Object} ValidationError
 * @property {string} field - Field that failed validation
 * @property {string} message - Error message
 * @property {string} [code] - Error code for programmatic handling
 */

/**
 * Validates title field
 * @param {string} title - Title to validate
 * @returns {ValidationResult} Validation result
 */
export function validateTitle(title) {
	const errors = [];
	
	if (!title || typeof title !== 'string') {
		errors.push({
			field: 'title',
			message: 'Title is required and must be a string',
			code: 'TITLE_REQUIRED'
		});
	} else if (title.trim().length < 3) {
		errors.push({
			field: 'title',
			message: 'Title must be at least 3 characters long',
			code: 'TITLE_TOO_SHORT'
		});
	} else if (title.trim().length > 200) {
		errors.push({
			field: 'title',
			message: 'Title must be less than 200 characters',
			code: 'TITLE_TOO_LONG'
		});
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Validates description field
 * @param {string} description - Description to validate
 * @returns {ValidationResult} Validation result
 */
export function validateDescription(description) {
	const errors = [];
	
	if (!description || typeof description !== 'string') {
		errors.push({
			field: 'description',
			message: 'Description is required and must be a string',
			code: 'DESCRIPTION_REQUIRED'
		});
	} else if (description.trim().length < 10) {
		errors.push({
			field: 'description',
			message: 'Description must be at least 10 characters long',
			code: 'DESCRIPTION_TOO_SHORT'
		});
	} else if (description.trim().length > 500) {
		errors.push({
			field: 'description',
			message: 'Description must be less than 500 characters',
			code: 'DESCRIPTION_TOO_LONG'
		});
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Validates tags field
 * @param {string[]|string} tags - Tags to validate
 * @returns {ValidationResult} Validation result
 */
export function validateTags(tags) {
	const errors = [];
	
	if (tags === null || tags === undefined) {
		// Tags are optional, so null/undefined is valid
		return { valid: true, errors: [] };
	}
	
	// Handle string input (comma-separated)
	let tagArray = tags;
	if (typeof tags === 'string') {
		tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
	}
	
	if (!Array.isArray(tagArray)) {
		errors.push({
			field: 'tags',
			message: 'Tags must be an array or comma-separated string',
			code: 'TAGS_INVALID_TYPE'
		});
	} else {
		// Validate individual tags
		tagArray.forEach((tag, index) => {
			if (typeof tag !== 'string') {
				errors.push({
					field: 'tags',
					message: `Tag at index ${index} must be a string`,
					code: 'TAG_INVALID_TYPE'
				});
			} else if (tag.trim().length === 0) {
				errors.push({
					field: 'tags',
					message: `Tag at index ${index} cannot be empty`,
					code: 'TAG_EMPTY'
				});
			} else if (tag.trim().length > 50) {
				errors.push({
					field: 'tags',
					message: `Tag "${tag}" is too long (max 50 characters)`,
					code: 'TAG_TOO_LONG'
				});
			}
		});
		
		// Check for duplicate tags
		const uniqueTags = new Set(tagArray.map(tag => tag.toLowerCase()));
		if (uniqueTags.size !== tagArray.length) {
			errors.push({
				field: 'tags',
				message: 'Duplicate tags are not allowed',
				code: 'TAGS_DUPLICATE'
			});
		}
		
		// Limit number of tags
		if (tagArray.length > 10) {
			errors.push({
				field: 'tags',
				message: 'Maximum 10 tags allowed',
				code: 'TAGS_TOO_MANY'
			});
		}
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Validates URL field
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether URL is required
 * @returns {ValidationResult} Validation result
 */
export function validateUrl(url, required = false) {
	const errors = [];
	
	if (!url || typeof url !== 'string') {
		if (required) {
			errors.push({
				field: 'url',
				message: 'URL is required and must be a string',
				code: 'URL_REQUIRED'
			});
		}
		// If not required and empty, that's valid
		return { valid: !required || errors.length === 0, errors };
	}
	
	// Basic URL validation
	try {
		new URL(url);
	} catch {
		errors.push({
			field: 'url',
			message: 'URL must be a valid URL',
			code: 'URL_INVALID'
		});
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Validates status field
 * @param {string} status - Status to validate
 * @returns {ValidationResult} Validation result
 */
export function validateStatus(status) {
	const errors = [];
	const validStatuses = ['active', 'inactive'];
	
	if (status !== undefined && status !== null) {
		if (typeof status !== 'string') {
			errors.push({
				field: 'status',
				message: 'Status must be a string',
				code: 'STATUS_INVALID_TYPE'
			});
		} else if (!validStatuses.includes(status)) {
			errors.push({
				field: 'status',
				message: `Status must be one of: ${validStatuses.join(', ')}`,
				code: 'STATUS_INVALID_VALUE'
			});
		}
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Validates priority field for projects
 * @param {number} priority - Priority to validate
 * @returns {ValidationResult} Validation result
 */
export function validatePriority(priority) {
	const errors = [];
	
	if (priority !== undefined && priority !== null) {
		if (typeof priority !== 'number' || isNaN(priority)) {
			errors.push({
				field: 'priority',
				message: 'Priority must be a number',
				code: 'PRIORITY_INVALID_TYPE'
			});
		} else if (priority < 1 || priority > 1000) {
			errors.push({
				field: 'priority',
				message: 'Priority must be between 1 and 1000',
				code: 'PRIORITY_OUT_OF_RANGE'
			});
		}
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Validates date field
 * @param {Date|string} date - Date to validate
 * @param {string} fieldName - Name of the field for error reporting
 * @returns {ValidationResult} Validation result
 */
export function validateDate(date, fieldName = 'date') {
	const errors = [];
	
	if (date !== undefined && date !== null) {
		let dateObj = date;
		
		// Try to parse string dates
		if (typeof date === 'string') {
			dateObj = new Date(date);
		}
		
		if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
			errors.push({
				field: fieldName,
				message: `${fieldName} must be a valid date`,
				code: 'DATE_INVALID'
			});
		}
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Combines multiple validation results
 * @param {ValidationResult[]} results - Array of validation results
 * @returns {ValidationResult} Combined validation result
 */
export function combineValidationResults(results) {
	const allErrors = results.flatMap(result => result.errors);
	
	return {
		valid: allErrors.length === 0,
		errors: allErrors
	};
}

/**
 * Validates basic content metadata (common to all content types)
 * @param {object} metadata - Metadata to validate
 * @returns {ValidationResult} Validation result
 */
export function validateBaseMetadata(metadata) {
	if (!metadata || typeof metadata !== 'object') {
		return {
			valid: false,
			errors: [{
				field: 'metadata',
				message: 'Metadata must be an object',
				code: 'METADATA_REQUIRED'
			}]
		};
	}
	
	const validationResults = [
		validateTitle(metadata.title),
		validateDescription(metadata.description),
		validateTags(metadata.tags),
		validateDate(metadata.publishDate, 'publishDate'),
		validateDate(metadata.updateDate, 'updateDate')
	];
	
	return combineValidationResults(validationResults);
}

/**
 * Validates post-specific metadata
 * @param {object} metadata - Post metadata to validate
 * @returns {ValidationResult} Validation result
 */
export function validatePostMetadata(metadata) {
	const baseValidation = validateBaseMetadata(metadata);
	
	// Post-specific validations
	const postValidations = [];
	
	// TLDR validation (optional)
	if (metadata.tldr !== undefined && metadata.tldr !== null) {
		if (typeof metadata.tldr !== 'string') {
			postValidations.push({
				valid: false,
				errors: [{
					field: 'tldr',
					message: 'TL;DR must be a string',
					code: 'TLDR_INVALID_TYPE'
				}]
			});
		} else if (metadata.tldr.trim().length > 500) {
			postValidations.push({
				valid: false,
				errors: [{
					field: 'tldr',
					message: 'TL;DR must be less than 500 characters',
					code: 'TLDR_TOO_LONG'
				}]
			});
		} else {
			postValidations.push({ valid: true, errors: [] });
		}
	}
	
	// Discussion URL validation (optional)
	if (metadata.discussion) {
		postValidations.push(validateUrl(metadata.discussion, false));
	}
	
	return combineValidationResults([baseValidation, ...postValidations]);
}

/**
 * Validates project-specific metadata
 * @param {object} metadata - Project metadata to validate
 * @returns {ValidationResult} Validation result
 */
export function validateProjectMetadata(metadata) {
	const baseValidation = validateBaseMetadata(metadata);
	
	const projectValidations = [
		validateUrl(metadata.url, true), // Project URL is required
		validateStatus(metadata.status),
		validatePriority(metadata.priority)
	];
	
	// OpenSource validation (optional boolean)
	if (metadata.openSource !== undefined && metadata.openSource !== null) {
		if (typeof metadata.openSource !== 'boolean') {
			projectValidations.push({
				valid: false,
				errors: [{
					field: 'openSource',
					message: 'OpenSource must be a boolean',
					code: 'OPENSOURCE_INVALID_TYPE'
				}]
			});
		} else {
			projectValidations.push({ valid: true, errors: [] });
		}
	}
	
	return combineValidationResults([baseValidation, ...projectValidations]);
}

/**
 * Validates uses entry metadata
 * @param {object} metadata - Uses entry metadata to validate
 * @returns {ValidationResult} Validation result
 */
export function validateUsesMetadata(metadata) {
	const baseValidation = validateBaseMetadata(metadata);
	
	const usesValidations = [
		validateUrl(metadata.url, true), // Uses entry URL is required
		validateStatus(metadata.status)
	];
	
	// OpenSource validation (optional boolean or null)
	if (metadata.openSource !== undefined && metadata.openSource !== null) {
		if (typeof metadata.openSource !== 'boolean') {
			usesValidations.push({
				valid: false,
				errors: [{
					field: 'openSource',
					message: 'OpenSource must be a boolean or null',
					code: 'OPENSOURCE_INVALID_TYPE'
				}]
			});
		} else {
			usesValidations.push({ valid: true, errors: [] });
		}
	}
	
	return combineValidationResults([baseValidation, ...usesValidations]);
}

/**
 * Validates metadata based on content type
 * @param {object} metadata - Metadata to validate
 * @param {string} contentType - Type of content
 * @returns {ValidationResult} Validation result
 */
export function validateMetadataForType(metadata, contentType) {
	switch (contentType) {
		case 'post':
			return validatePostMetadata(metadata);
		case 'project':
			return validateProjectMetadata(metadata);
		case 'uses':
			return validateUsesMetadata(metadata);
		default:
			return validateBaseMetadata(metadata);
	}
}