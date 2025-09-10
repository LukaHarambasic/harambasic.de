#!/usr/bin/env node

/**
 * Content Validation Script for Git Pre-commit Hook
 *
 * Validates all content files using the Zod validation system.
 * Designed to catch content validation errors early in the git workflow.
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Setup ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	bold: '\x1b[1m',
	reset: '\x1b[0m'
};

function log(color, message) {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
	log('red', `❌ ${message}`);
}

function logSuccess(message) {
	log('green', `✅ ${message}`);
}

function logWarning(message) {
	log('yellow', `⚠️  ${message}`);
}

function logInfo(message) {
	log('blue', `ℹ️  ${message}`);
}

/**
 * Validate all content using the FileSystemContentService
 */
async function validateContent() {
	try {
		// Import the validation service (needs to be dynamic for ES modules)
		const contentRoot = join(__dirname, '..', 'src', 'content');

		// We need to use the built validation system from the SvelteKit environment
		// For now, we'll create a simplified validation that mimics the service behavior

		const { validateAllContent } = await import('./validation-runner.js');

		logInfo('Starting content validation...');

		const results = await validateAllContent(contentRoot);

		// Process validation results
		const failures = results.filter((result) => !result.success);

		if (failures.length === 0) {
			logSuccess(`All content files passed validation (${results.length} files checked)`);
			return true;
		}

		// Report validation failures
		logError(`Content validation failed for ${failures.length} files:`);
		console.log('');

		for (const failure of failures) {
			logError(`File: ${failure.filePath}`);
			if (failure.errors && failure.errors.length > 0) {
				failure.errors.forEach((error) => {
					console.log(`   ${colors.red}→${colors.reset} ${error}`);
				});
			}
			console.log('');
		}

		logWarning('Please fix the content validation errors and try again.');
		return false;
	} catch (error) {
		logError(`Content validation script failed: ${error.message}`);
		console.error(error.stack);
		return false;
	}
}

/**
 * Main execution
 */
async function main() {
	const success = await validateContent();
	process.exit(success ? 0 : 1);
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((error) => {
		logError(`Unexpected error: ${error.message}`);
		console.error(error.stack);
		process.exit(1);
	});
}

export { validateContent };
