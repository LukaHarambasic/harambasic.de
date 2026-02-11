/**
 * Tests for validation functions
 * Testing pure functions with various input scenarios
 */

import { describe, it, expect } from 'vitest';
import {
	validateTitle,
	validateDescription,
	validateTags,
	validateUrl,
	validateStatus,
	validatePriority,
	validateDate,
	combineValidationResults,
	validateBaseMetadata,
	validatePostMetadata,
	validateProjectMetadata,
	validateUsesMetadata,
	validateMetadataForType
} from './validation.js';

describe('validateTitle', () => {
	it('should validate correct title', () => {
		const result = validateTitle('My Blog Post');
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should invalidate missing title', () => {
		const result = validateTitle('');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TITLE_REQUIRED');
	});

	it('should invalidate short title', () => {
		const result = validateTitle('Hi');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TITLE_TOO_SHORT');
	});

	it('should invalidate long title', () => {
		const longTitle = 'A'.repeat(201);
		const result = validateTitle(longTitle);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TITLE_TOO_LONG');
	});

	it('should invalidate non-string title', () => {
		const result = validateTitle(123);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TITLE_REQUIRED');
	});

	it('should handle null/undefined', () => {
		expect(validateTitle(null).valid).toBe(false);
		expect(validateTitle(undefined).valid).toBe(false);
	});
});

describe('validateDescription', () => {
	it('should validate correct description', () => {
		const result = validateDescription('This is a valid description');
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should invalidate missing description', () => {
		const result = validateDescription('');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('DESCRIPTION_REQUIRED');
	});

	it('should invalidate short description', () => {
		const result = validateDescription('Short');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('DESCRIPTION_TOO_SHORT');
	});

	it('should invalidate long description', () => {
		const longDescription = 'A'.repeat(501);
		const result = validateDescription(longDescription);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('DESCRIPTION_TOO_LONG');
	});
});

describe('validateTags', () => {
	it('should validate correct tag array', () => {
		const result = validateTags(['JavaScript', 'React', 'Testing']);
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should validate comma-separated tag string', () => {
		const result = validateTags('JavaScript, React, Testing');
		expect(result.valid).toBe(true);
	});

	it('should allow empty tags', () => {
		const result = validateTags(null);
		expect(result.valid).toBe(true);
		
		const result2 = validateTags(undefined);
		expect(result2.valid).toBe(true);
	});

	it('should invalidate non-string tags in array', () => {
		const result = validateTags(['JavaScript', 123, 'React']);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TAG_INVALID_TYPE');
	});

	it('should invalidate empty tags in array', () => {
		const result = validateTags(['JavaScript', '', 'React']);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TAG_EMPTY');
	});

	it('should invalidate long tags', () => {
		const longTag = 'A'.repeat(51);
		const result = validateTags([longTag]);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TAG_TOO_LONG');
	});

	it('should invalidate duplicate tags', () => {
		const result = validateTags(['JavaScript', 'javascript', 'React']);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TAGS_DUPLICATE');
	});

	it('should invalidate too many tags', () => {
		const manyTags = Array.from({ length: 11 }, (_, i) => `Tag${i}`);
		const result = validateTags(manyTags);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('TAGS_TOO_MANY');
	});
});

describe('validateUrl', () => {
	it('should validate correct URL', () => {
		const result = validateUrl('https://example.com');
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should allow empty URL when not required', () => {
		const result = validateUrl('', false);
		expect(result.valid).toBe(true);
	});

	it('should invalidate empty URL when required', () => {
		const result = validateUrl('', true);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('URL_REQUIRED');
	});

	it('should invalidate malformed URL', () => {
		const result = validateUrl('not-a-url');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('URL_INVALID');
	});

	it('should validate different URL protocols', () => {
		expect(validateUrl('http://example.com').valid).toBe(true);
		expect(validateUrl('https://example.com').valid).toBe(true);
		expect(validateUrl('ftp://example.com').valid).toBe(true);
	});
});

describe('validateStatus', () => {
	it('should validate correct status values', () => {
		expect(validateStatus('active').valid).toBe(true);
		expect(validateStatus('inactive').valid).toBe(true);
	});

	it('should allow undefined status', () => {
		expect(validateStatus(undefined).valid).toBe(true);
		expect(validateStatus(null).valid).toBe(true);
	});

	it('should invalidate incorrect status', () => {
		const result = validateStatus('invalid');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('STATUS_INVALID_VALUE');
	});

	it('should invalidate non-string status', () => {
		const result = validateStatus(123);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('STATUS_INVALID_TYPE');
	});
});

describe('validatePriority', () => {
	it('should validate correct priority', () => {
		expect(validatePriority(100).valid).toBe(true);
		expect(validatePriority(1).valid).toBe(true);
		expect(validatePriority(1000).valid).toBe(true);
	});

	it('should allow undefined priority', () => {
		expect(validatePriority(undefined).valid).toBe(true);
		expect(validatePriority(null).valid).toBe(true);
	});

	it('should invalidate out of range priority', () => {
		expect(validatePriority(0).valid).toBe(false);
		expect(validatePriority(1001).valid).toBe(false);
	});

	it('should invalidate non-number priority', () => {
		const result = validatePriority('100');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('PRIORITY_INVALID_TYPE');
	});

	it('should invalidate NaN priority', () => {
		const result = validatePriority(NaN);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('PRIORITY_INVALID_TYPE');
	});
});

describe('validateDate', () => {
	it('should validate correct date', () => {
		const result = validateDate(new Date('2024-01-01'));
		expect(result.valid).toBe(true);
	});

	it('should validate date string', () => {
		const result = validateDate('2024-01-01');
		expect(result.valid).toBe(true);
	});

	it('should allow undefined date', () => {
		expect(validateDate(undefined).valid).toBe(true);
		expect(validateDate(null).valid).toBe(true);
	});

	it('should invalidate invalid date', () => {
		const result = validateDate('invalid-date');
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('DATE_INVALID');
	});

	it('should invalidate invalid Date object', () => {
		const result = validateDate(new Date('invalid'));
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('DATE_INVALID');
	});
});

describe('combineValidationResults', () => {
	it('should combine valid results', () => {
		const results = [
			{ valid: true, errors: [] },
			{ valid: true, errors: [] }
		];
		const combined = combineValidationResults(results);
		expect(combined.valid).toBe(true);
		expect(combined.errors).toHaveLength(0);
	});

	it('should combine mixed results', () => {
		const results = [
			{ valid: true, errors: [] },
			{ valid: false, errors: [{ field: 'test', message: 'error' }] }
		];
		const combined = combineValidationResults(results);
		expect(combined.valid).toBe(false);
		expect(combined.errors).toHaveLength(1);
	});

	it('should combine multiple error results', () => {
		const results = [
			{ valid: false, errors: [{ field: 'field1', message: 'error1' }] },
			{ valid: false, errors: [{ field: 'field2', message: 'error2' }] }
		];
		const combined = combineValidationResults(results);
		expect(combined.valid).toBe(false);
		expect(combined.errors).toHaveLength(2);
	});
});

describe('validateBaseMetadata', () => {
	const validMetadata = {
		title: 'Valid Title',
		description: 'This is a valid description that is long enough.'
	};

	it('should validate correct base metadata', () => {
		const result = validateBaseMetadata(validMetadata);
		expect(result.valid).toBe(true);
	});

	it('should invalidate non-object metadata', () => {
		const result = validateBaseMetadata(null);
		expect(result.valid).toBe(false);
		expect(result.errors[0].code).toBe('METADATA_REQUIRED');
	});

	it('should validate metadata with optional fields', () => {
		const metadata = {
			...validMetadata,
			tags: ['Tag1', 'Tag2'],
			publishDate: new Date('2024-01-01')
		};
		const result = validateBaseMetadata(metadata);
		expect(result.valid).toBe(true);
	});
});

describe('validatePostMetadata', () => {
	const validPostMetadata = {
		title: 'Valid Post Title',
		description: 'This is a valid post description.',
		tldr: 'Short summary',
		discussion: 'https://example.com/discussion'
	};

	it('should validate correct post metadata', () => {
		const result = validatePostMetadata(validPostMetadata);
		expect(result.valid).toBe(true);
	});

	it('should allow optional post fields', () => {
		const metadata = {
			title: 'Valid Post Title',
			description: 'This is a valid post description.'
		};
		const result = validatePostMetadata(metadata);
		expect(result.valid).toBe(true);
	});

	it('should invalidate non-string tldr', () => {
		const metadata = {
			...validPostMetadata,
			tldr: 123
		};
		const result = validatePostMetadata(metadata);
		expect(result.valid).toBe(false);
	});

	it('should invalidate long tldr', () => {
		const metadata = {
			...validPostMetadata,
			tldr: 'A'.repeat(501)
		};
		const result = validatePostMetadata(metadata);
		expect(result.valid).toBe(false);
	});
});

describe('validateProjectMetadata', () => {
	const validProjectMetadata = {
		title: 'Valid Project Title',
		description: 'This is a valid project description.',
		url: 'https://project.example.com',
		status: 'active',
		priority: 100,
		openSource: true
	};

	it('should validate correct project metadata', () => {
		const result = validateProjectMetadata(validProjectMetadata);
		expect(result.valid).toBe(true);
	});

	it('should invalidate project without URL', () => {
		const metadata = {
			...validProjectMetadata,
			url: ''
		};
		const result = validateProjectMetadata(metadata);
		expect(result.valid).toBe(false);
	});

	it('should invalidate non-boolean openSource', () => {
		const metadata = {
			...validProjectMetadata,
			openSource: 'yes'
		};
		const result = validateProjectMetadata(metadata);
		expect(result.valid).toBe(false);
	});
});

describe('validateUsesMetadata', () => {
	const validUsesMetadata = {
		title: 'Valid Tool',
		description: 'This is a valid tool description.',
		url: 'https://tool.example.com',
		status: 'active',
		openSource: true
	};

	it('should validate correct uses metadata', () => {
		const result = validateUsesMetadata(validUsesMetadata);
		expect(result.valid).toBe(true);
	});

	it('should allow null openSource for uses', () => {
		const metadata = {
			...validUsesMetadata,
			openSource: null
		};
		const result = validateUsesMetadata(metadata);
		expect(result.valid).toBe(true);
	});

	it('should invalidate uses without URL', () => {
		const metadata = {
			...validUsesMetadata,
			url: ''
		};
		const result = validateUsesMetadata(metadata);
		expect(result.valid).toBe(false);
	});
});

describe('validateMetadataForType', () => {
	const baseMetadata = {
		title: 'Test Title',
		description: 'Test description that is long enough.'
	};

	it('should validate post metadata by type', () => {
		const result = validateMetadataForType(baseMetadata, 'post');
		expect(result.valid).toBe(true);
	});

	it('should validate project metadata by type', () => {
		const metadata = {
			...baseMetadata,
			url: 'https://example.com'
		};
		const result = validateMetadataForType(metadata, 'project');
		expect(result.valid).toBe(true);
	});

	it('should validate uses metadata by type', () => {
		const metadata = {
			...baseMetadata,
			url: 'https://tool.example.com'
		};
		const result = validateMetadataForType(metadata, 'uses');
		expect(result.valid).toBe(true);
	});

	it('should fallback to base validation for unknown type', () => {
		const result = validateMetadataForType(baseMetadata, 'unknown');
		expect(result.valid).toBe(true);
	});
});