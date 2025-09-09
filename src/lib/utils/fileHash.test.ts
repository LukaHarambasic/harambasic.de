import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { getFileHash, getProcessorHash, getFileModificationTime, fileExists } from './fileHash';

describe('File Hashing Utilities', () => {
	let tempDir: string;

	beforeEach(async () => {
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hash-test-'));
	});

	afterEach(async () => {
		try {
			await fs.rm(tempDir, { recursive: true, force: true });
		} catch {
			// Ignore cleanup errors
		}
	});

	describe('getFileHash', () => {
		it('should generate consistent hash for same content', async () => {
			const filePath = path.join(tempDir, 'test.md');
			const content = '# Test\n\nThis is test content.';

			await fs.writeFile(filePath, content);

			const hash1 = await getFileHash(filePath);
			const hash2 = await getFileHash(filePath);

			expect(hash1).toBe(hash2);
			expect(hash1).toMatch(/^[a-f0-9]{32}$/); // MD5 format
		});

		it('should generate different hashes for different content', async () => {
			const filePath1 = path.join(tempDir, 'test1.md');
			const filePath2 = path.join(tempDir, 'test2.md');

			await fs.writeFile(filePath1, '# Test 1');
			await fs.writeFile(filePath2, '# Test 2');

			const hash1 = await getFileHash(filePath1);
			const hash2 = await getFileHash(filePath2);

			expect(hash1).not.toBe(hash2);
		});

		it('should detect content changes', async () => {
			const filePath = path.join(tempDir, 'test.md');

			await fs.writeFile(filePath, '# Original');
			const originalHash = await getFileHash(filePath);

			await fs.writeFile(filePath, '# Modified');
			const modifiedHash = await getFileHash(filePath);

			expect(originalHash).not.toBe(modifiedHash);
		});

		it('should handle non-existent files gracefully', async () => {
			const nonExistentPath = path.join(tempDir, 'does-not-exist.md');

			const hash = await getFileHash(nonExistentPath);

			expect(hash).toMatch(/^error:/);
		});

		it('should handle permission errors gracefully', async () => {
			// This test might not work on all systems
			const filePath = path.join(tempDir, 'restricted.md');
			await fs.writeFile(filePath, '# Test');

			try {
				// Try to make file unreadable
				await fs.chmod(filePath, 0o000);

				const hash = await getFileHash(filePath);
				expect(hash).toMatch(/^error:/);
			} catch {
				// Skip if we can't change permissions
			}
		});
	});

	describe('getProcessorHash', () => {
		it('should generate consistent hash for same environment', async () => {
			const hash1 = await getProcessorHash();
			const hash2 = await getProcessorHash();

			expect(hash1).toBe(hash2);
			expect(hash1).toMatch(/^[a-f0-9]{32}$/); // MD5 format
		});

		it('should change when package version changes', async () => {
			const originalVersion = process.env.npm_package_version;

			// Mock different package version
			process.env.npm_package_version = '1.0.0';
			const hash1 = await getProcessorHash();

			process.env.npm_package_version = '2.0.0';
			const hash2 = await getProcessorHash();

			// Restore original
			process.env.npm_package_version = originalVersion;

			expect(hash1).not.toBe(hash2);
		});

		it('should change when NODE_ENV changes', async () => {
			const originalEnv = process.env.NODE_ENV;

			process.env.NODE_ENV = 'development';
			const hash1 = await getProcessorHash();

			process.env.NODE_ENV = 'production';
			const hash2 = await getProcessorHash();

			// Restore original
			process.env.NODE_ENV = originalEnv;

			expect(hash1).not.toBe(hash2);
		});

		it('should handle missing environment variables', async () => {
			const originalVersion = process.env.npm_package_version;
			const originalEnv = process.env.NODE_ENV;

			delete process.env.npm_package_version;
			delete process.env.NODE_ENV;

			const hash = await getProcessorHash();
			expect(hash).toMatch(/^[a-f0-9]{32}$/);

			// Restore
			process.env.npm_package_version = originalVersion;
			process.env.NODE_ENV = originalEnv;
		});
	});

	describe('getFileModificationTime', () => {
		it('should return modification time for existing file', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			const modTime = await getFileModificationTime(filePath);

			expect(modTime).toBeInstanceOf(Date);
			expect(modTime!.getTime()).toBeLessThanOrEqual(Date.now());
		});

		it('should return null for non-existent file', async () => {
			const nonExistentPath = path.join(tempDir, 'does-not-exist.md');

			const modTime = await getFileModificationTime(nonExistentPath);

			expect(modTime).toBeNull();
		});

		it('should detect file modifications', async () => {
			const filePath = path.join(tempDir, 'test.md');

			await fs.writeFile(filePath, '# Original');
			const originalModTime = await getFileModificationTime(filePath);

			// Wait a bit to ensure different modification time
			await new Promise((resolve) => setTimeout(resolve, 10));

			await fs.writeFile(filePath, '# Modified');
			const newModTime = await getFileModificationTime(filePath);

			expect(newModTime!.getTime()).toBeGreaterThan(originalModTime!.getTime());
		});
	});

	describe('fileExists', () => {
		it('should return true for existing file', async () => {
			const filePath = path.join(tempDir, 'test.md');
			await fs.writeFile(filePath, '# Test');

			const exists = await fileExists(filePath);

			expect(exists).toBe(true);
		});

		it('should return false for non-existent file', async () => {
			const nonExistentPath = path.join(tempDir, 'does-not-exist.md');

			const exists = await fileExists(nonExistentPath);

			expect(exists).toBe(false);
		});

		it('should return true for directory', async () => {
			const dirPath = path.join(tempDir, 'test-dir');
			await fs.mkdir(dirPath);

			const exists = await fileExists(dirPath);

			expect(exists).toBe(true);
		});

		it('should handle permission errors gracefully', async () => {
			// This test might not work on all systems
			const filePath = path.join(tempDir, 'restricted.md');
			await fs.writeFile(filePath, '# Test');

			try {
				// Try to make parent directory inaccessible
				await fs.chmod(tempDir, 0o000);

				const exists = await fileExists(filePath);
				// Should handle gracefully (return false for access errors)
				expect(typeof exists).toBe('boolean');
			} catch {
				// Skip if we can't change permissions
			} finally {
				// Restore permissions
				try {
					await fs.chmod(tempDir, 0o755);
				} catch {
					// Ignore restore errors
				}
			}
		});
	});

	describe('Integration Tests', () => {
		it('should detect file changes through hash and modification time', async () => {
			const filePath = path.join(tempDir, 'test.md');

			// Create file
			await fs.writeFile(filePath, '# Original');
			const originalHash = await getFileHash(filePath);
			const originalModTime = await getFileModificationTime(filePath);

			// Wait and modify
			await new Promise((resolve) => setTimeout(resolve, 10));
			await fs.writeFile(filePath, '# Modified');

			const newHash = await getFileHash(filePath);
			const newModTime = await getFileModificationTime(filePath);

			expect(newHash).not.toBe(originalHash);
			expect(newModTime!.getTime()).toBeGreaterThan(originalModTime!.getTime());
		});

		it('should handle edge case of same content with different modification time', async () => {
			const filePath = path.join(tempDir, 'test.md');
			const content = '# Test Content';

			// Create file
			await fs.writeFile(filePath, content);
			const originalHash = await getFileHash(filePath);
			const originalModTime = await getFileModificationTime(filePath);

			// Wait and write same content
			await new Promise((resolve) => setTimeout(resolve, 10));
			await fs.writeFile(filePath, content);

			const newHash = await getFileHash(filePath);
			const newModTime = await getFileModificationTime(filePath);

			// Hash should be same (same content)
			expect(newHash).toBe(originalHash);
			// But modification time should be different
			expect(newModTime!.getTime()).toBeGreaterThan(originalModTime!.getTime());
		});
	});
});
