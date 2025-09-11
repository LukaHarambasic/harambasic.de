import type { RequestEvent } from '@sveltejs/kit';

interface RateLimitEntry {
	count: number;
	resetTime: number;
	blocked: boolean;
	blockUntil?: number;
}

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Max attempts per window
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour block after max attempts exceeded

/**
 * Get client identifier for rate limiting
 * Uses IP address and User-Agent as identifier
 */
function getClientId(event: RequestEvent): string {
	const clientIP = event.getClientAddress();
	const userAgent = event.request.headers.get('user-agent') || 'unknown';
	
	// Create a simple hash of IP + User-Agent
	let hash = 0;
	const str = `${clientIP}:${userAgent}`;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	
	return `${clientIP}:${Math.abs(hash)}`;
}

/**
 * Check if request should be rate limited
 * Returns true if request should be blocked
 */
export function isRateLimited(event: RequestEvent): boolean {
	const clientId = getClientId(event);
	const now = Date.now();
	
	let entry = rateLimitStore.get(clientId);
	
	if (!entry) {
		// First request from this client
		entry = {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW,
			blocked: false
		};
		rateLimitStore.set(clientId, entry);
		return false;
	}

	// Check if client is currently blocked
	if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
		return true; // Still blocked
	}

	// Check if rate limit window has expired
	if (now > entry.resetTime) {
		// Reset the window
		entry.count = 1;
		entry.resetTime = now + RATE_LIMIT_WINDOW;
		entry.blocked = false;
		entry.blockUntil = undefined;
		rateLimitStore.set(clientId, entry);
		return false;
	}

	// Increment counter
	entry.count++;

	// Check if max attempts exceeded
	if (entry.count > MAX_ATTEMPTS) {
		entry.blocked = true;
		entry.blockUntil = now + BLOCK_DURATION;
		rateLimitStore.set(clientId, entry);
		
		console.warn(`Rate limit exceeded for client ${clientId}. Blocked until ${new Date(entry.blockUntil).toISOString()}`);
		return true;
	}

	rateLimitStore.set(clientId, entry);
	return false;
}

/**
 * Get rate limit info for client
 */
export function getRateLimitInfo(event: RequestEvent) {
	const clientId = getClientId(event);
	const entry = rateLimitStore.get(clientId);
	const now = Date.now();

	if (!entry) {
		return {
			remaining: MAX_ATTEMPTS,
			resetTime: now + RATE_LIMIT_WINDOW,
			blocked: false
		};
	}

	const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
	
	return {
		remaining,
		resetTime: entry.resetTime,
		blocked: entry.blocked && entry.blockUntil ? now < entry.blockUntil : false,
		blockUntil: entry.blockUntil
	};
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimit() {
	const now = Date.now();
	
	for (const [clientId, entry] of rateLimitStore.entries()) {
		// Remove entries that have expired and are not blocked
		if (now > entry.resetTime && (!entry.blocked || !entry.blockUntil || now > entry.blockUntil)) {
			rateLimitStore.delete(clientId);
		}
	}
}

// Run cleanup every 30 minutes
setInterval(cleanupRateLimit, 30 * 60 * 1000);