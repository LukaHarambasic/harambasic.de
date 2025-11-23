# Technical Documentation

## API Endpoints

### Authentication

- `POST /api/auth` - Authenticate user with passphrase
- `GET /api/session` - Check current session status

### Content Management

- `GET /api/secret/content` - List encrypted content
- `GET /api/secret/content/:slug` - Get specific content

## Implementation Details

The secret content system is built with:

- **SvelteKit** for the framework
- **Web Crypto API** for client-side decryption
- **Node.js crypto** for server-side encryption

## Database Schema

```json
{
	"users": {
		"username": ["word1", "word2", "word3"]
	},
	"content": {
		"slug": "string",
		"title": "string",
		"content": "encrypted_string",
		"metadata": {}
	}
}
```

## Deployment Notes

Remember to:

1. Set secure environment variables
2. Use HTTPS in production
3. Implement rate limiting
4. Add proper logging
