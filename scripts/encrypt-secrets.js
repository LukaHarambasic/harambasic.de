#!/usr/bin/env node

/**
 * Pre-commit script to encrypt secret files
 * Finds all *.secret.json and *.secret.md files and encrypts them as *.encrypted files
 * Uses Node.js crypto module for encryption to match Web Crypto API behavior
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import crypto from 'crypto';
import { promisify } from 'util';
import path from 'path';

const pbkdf2Async = promisify(crypto.pbkdf2);

// Encryption constants matching Web Crypto API implementation
const KEY_LENGTH = 32; // 256 bits / 8
const IV_LENGTH = 12; // 96 bits / 8
const SALT_LENGTH = 16; // 128 bits / 8
const PBKDF2_ITERATIONS = 100000;

/**
 * Get master password from environment or prompt
 * In production, this should be securely configured
 */
function getMasterPassword() {
	const password = process.env.SECRET_MASTER_PASSWORD;
	if (!password) {
		console.error('❌ SECRET_MASTER_PASSWORD environment variable not set');
		console.error('   For demo purposes, using default password');
		return 'demo-master-password-change-in-production';
	}
	return password;
}

/**
 * Derive encryption key from password using PBKDF2
 */
async function deriveKey(password, salt) {
	return pbkdf2Async(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Encrypt data using AES-GCM
 */
async function encryptData(data, password) {
	try {
		// Generate random salt and IV
		const salt = crypto.randomBytes(SALT_LENGTH);
		const iv = crypto.randomBytes(IV_LENGTH);

		// Derive key from password
		const key = await deriveKey(password, salt);

		// Create cipher with key and IV
		const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

		// Encrypt the data
		const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

		// Get authentication tag
		const tag = cipher.getAuthTag();

		// Combine encrypted data and tag
		const encryptedWithTag = Buffer.concat([encrypted, tag]);

		return {
			data: encryptedWithTag.toString('base64'),
			iv: iv.toString('base64'),
			salt: salt.toString('base64'),
			algorithm: 'AES-GCM',
			iterations: PBKDF2_ITERATIONS
		};
	} catch (error) {
		throw new Error(`Encryption failed: ${error.message}`);
	}
}

/**
 * Process a single secret file
 */
async function processSecretFile(filePath, masterPassword) {
	try {
		console.log(`🔒 Processing: ${filePath}`);

		// Read the secret file
		const content = await readFile(filePath, 'utf8');

		// Encrypt the content
		const encrypted = await encryptData(content, masterPassword);

		// Determine output filename
		const outputPath = filePath.replace(/\.secret\.(json|md)$/, '.encrypted');

		// Write encrypted file
		await writeFile(outputPath, JSON.stringify(encrypted, null, 2));

		console.log(`✅ Encrypted: ${filePath} → ${outputPath}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to process ${filePath}:`, error.message);
		return false;
	}
}

/**
 * Simple recursive file finder (replacement for glob)
 */
async function findFiles(dir, patterns, ignorePatterns = []) {
	const files = [];

	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);

			// Skip ignored directories
			if (ignorePatterns.some((ignore) => fullPath.includes(ignore))) {
				continue;
			}

			if (entry.isDirectory()) {
				const subFiles = await findFiles(fullPath, patterns, ignorePatterns);
				files.push(...subFiles);
			} else if (entry.isFile()) {
				// Check if file matches any pattern
				const matches = patterns.some((pattern) => {
					const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
					return regex.test(fullPath);
				});

				if (matches) {
					files.push(fullPath);
				}
			}
		}
	} catch (error) {
		// Ignore permission errors for directories we can't read
		if (error.code !== 'EACCES' && error.code !== 'EPERM') {
			throw error;
		}
	}

	return files;
}

/**
 * Find all secret files in the project
 */
async function findSecretFiles() {
	try {
		const patterns = ['.*\\.secret\\.json$', '.*\\.secret\\.md$'];

		const ignorePatterns = ['node_modules', '.git', 'dist', 'build', '.svelte-kit'];

		const files = await findFiles('.', patterns, ignorePatterns);
		return files;
	} catch (error) {
		console.error('❌ Error finding secret files:', error.message);
		return [];
	}
}

/**
 * Main encryption function
 */
async function encryptSecrets() {
	console.log('🔐 Starting secret file encryption...');

	const masterPassword = getMasterPassword();
	const secretFiles = await findSecretFiles();

	if (secretFiles.length === 0) {
		console.log('ℹ️  No secret files found to encrypt');
		return true;
	}

	console.log(`📁 Found ${secretFiles.length} secret files to encrypt:`);
	secretFiles.forEach((file) => console.log(`   - ${file}`));

	let successCount = 0;
	let failureCount = 0;

	for (const file of secretFiles) {
		const success = await processSecretFile(file, masterPassword);
		if (success) {
			successCount++;
		} else {
			failureCount++;
		}
	}

	console.log('\n📊 Encryption Summary:');
	console.log(`   ✅ Successfully encrypted: ${successCount} files`);

	if (failureCount > 0) {
		console.log(`   ❌ Failed to encrypt: ${failureCount} files`);
		return false;
	}

	console.log('🎉 All secret files encrypted successfully!');
	return true;
}

/**
 * Validate environment and dependencies
 */
async function validateEnvironment() {
	// Check Node.js version
	const nodeVersion = process.version;
	const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

	if (majorVersion < 16) {
		console.error('❌ Node.js version 16 or higher is required');
		console.error(`   Current version: ${nodeVersion}`);
		return false;
	}

	// Check required crypto algorithms are available
	const ciphers = crypto.getCiphers();

	if (!ciphers.includes('aes-256-gcm')) {
		console.error('❌ AES-256-GCM cipher not available in this Node.js build');
		return false;
	}

	return true;
}

/**
 * Main execution
 */
async function main() {
	try {
		// Validate environment
		const envValid = await validateEnvironment();
		if (!envValid) {
			process.exit(1);
		}

		// Run encryption
		const success = await encryptSecrets();

		if (!success) {
			console.error('\n❌ Secret encryption failed');
			process.exit(1);
		}

		console.log('\n✅ Secret encryption completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('\n💥 Unexpected error during secret encryption:');
		console.error(error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { encryptSecrets, encryptData, deriveKey };
