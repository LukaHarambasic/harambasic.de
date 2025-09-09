#!/usr/bin/env node

/**
 * Cache Statistics Script
 * 
 * Displays information about the content cache including:
 * - Cache size and entry count
 * - Hit/miss statistics 
 * - Cache health and performance metrics
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const CACHE_FILE = '.cache/content/content-cache.json';

async function getCacheStats() {
	try {
		// Check if cache file exists
		if (!(await fileExists(CACHE_FILE))) {
			console.log('📊 Content Cache Statistics');
			console.log('═'.repeat(40));
			console.log('❌ No cache found - run the development server to populate cache');
			return;
		}

		// Read cache file
		const cacheData = JSON.parse(await fs.readFile(CACHE_FILE, 'utf-8'));
		const stats = await fs.stat(CACHE_FILE);

		console.log('📊 Content Cache Statistics');
		console.log('═'.repeat(40));
		console.log(`📁 Cache Location: ${CACHE_FILE}`);
		console.log(`📅 Last Updated: ${stats.mtime.toLocaleString()}`);
		console.log('');

		// Cache metadata
		if (cacheData.metadata) {
			const metadata = cacheData.metadata;
			console.log('📈 Cache Metadata:');
			console.log(`   Version: ${metadata.version}`);
			console.log(`   Total Entries: ${metadata.totalEntries}`);
			console.log(`   Cache Size: ${formatBytes(metadata.totalSize || 0)}`);
			console.log('');
		}

		// Entry breakdown by type
		const entries = cacheData.entries || {};
		const entryTypes = {};
		
		for (const [key, entry] of Object.entries(entries)) {
			const type = entry.entryType;
			if (!entryTypes[type]) {
				entryTypes[type] = [];
			}
			entryTypes[type].push(entry);
		}

		console.log('📋 Content Breakdown:');
		for (const [type, typeEntries] of Object.entries(entryTypes)) {
			console.log(`   ${type.padEnd(10)}: ${typeEntries.length} entries`);
		}
		console.log('');

		// Cache health
		console.log('🏥 Cache Health:');
		const now = new Date();
		let expiredCount = 0;
		let recentCount = 0;
		const maxAge = 1000 * 60 * 60; // 1 hour

		for (const entry of Object.values(entries)) {
			const cacheTime = new Date(entry.cacheTime);
			const age = now.getTime() - cacheTime.getTime();
			
			if (age > maxAge) {
				expiredCount++;
			} else if (age < 1000 * 60 * 15) { // 15 minutes
				recentCount++;
			}
		}

		console.log(`   ✅ Fresh entries (< 15 min): ${recentCount}`);
		console.log(`   ⚠️  Expired entries (> 1 hour): ${expiredCount}`);
		
		const totalEntries = Object.keys(entries).length;
		if (totalEntries > 0) {
			const healthPercent = ((totalEntries - expiredCount) / totalEntries * 100).toFixed(1);
			console.log(`   💚 Cache health: ${healthPercent}%`);
		}
		console.log('');

		// File size breakdown
		const fileSizeStats = await fs.stat(CACHE_FILE);
		console.log('💾 Storage Information:');
		console.log(`   Cache file size: ${formatBytes(fileSizeStats.size)}`);
		console.log(`   Average entry size: ${formatBytes(fileSizeStats.size / Math.max(totalEntries, 1))}`);
		console.log('');

		// Recent entries
		const recentEntries = Object.values(entries)
			.sort((a, b) => new Date(b.cacheTime) - new Date(a.cacheTime))
			.slice(0, 5);

		if (recentEntries.length > 0) {
			console.log('🕒 Most Recently Cached:');
			for (const entry of recentEntries) {
				const cacheTime = new Date(entry.cacheTime);
				const relativeTime = getRelativeTime(cacheTime);
				console.log(`   ${entry.entryType}:${entry.slug} (${relativeTime})`);
			}
			console.log('');
		}

		// Management commands
		console.log('🔧 Cache Management:');
		console.log('   npm run cache:clear  - Clear all cached content');
		console.log('   npm run cache:stats  - Show this statistics report');

	} catch (error) {
		console.error('❌ Error reading cache statistics:', error.message);
	}
}

async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

function formatBytes(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getRelativeTime(date) {
	const now = new Date();
	const diffMs = now - date;
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
}

// Run the script
getCacheStats().catch(console.error);