import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Return minimal data for the secret page
	// All authentication and content loading happens client-side for security

	return {
		title: 'Secret Content Access',
		description: 'Access private content with authentication'
		// No sensitive data should be included in server-side props
		// to prevent exposure in HTML source or server logs
	};
};
