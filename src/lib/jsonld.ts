/**
 * Pure builders for schema.org JSON-LD objects rendered via JsonLd.astro.
 * Person is the canonical identity used standalone (home) and as article author.
 */

export type JsonLdSchema = Record<string, unknown>;

const SITE_URL = 'https://harambasic.de';

export function personSchema(): JsonLdSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Luka Harambasic',
		url: SITE_URL,
		jobTitle: 'Product Manager and AI Consultant',
		description:
			'Product and AI consulting: strategy, automation, and product for startups. Based in Copenhagen.',
		sameAs: [
			'https://www.linkedin.com/in/harambasic/',
			'https://github.com/LukaHarambasic',
			'https://bsky.app/profile/harambasic.de'
		]
	};
}

export function websiteSchema(): JsonLdSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Luka Harambasic',
		url: SITE_URL
	};
}

export function articleSchema(params: {
	title: string;
	description: string;
	url: string;
	publishedTime: string;
	image?: string;
}): JsonLdSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: params.title,
		description: params.description,
		url: params.url,
		datePublished: params.publishedTime,
		...(params.image ? { image: params.image } : {}),
		author: personSchema()
	};
}
