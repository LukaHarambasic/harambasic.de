import { z } from 'zod';

// Secret content types following functional programming patterns

export type SecretUser = {
	identifier: string;
	passphrase: [string, string, string];
};

export type SecretUsers = Record<string, [string, string, string]>;

export type SecretContent = {
	slug: string;
	title: string;
	content: string;
	published: Date;
	updated?: Date;
	tags?: string[];
};

export type EncryptedFile = {
	data: string;
	iv: string;
	salt: string;
	algorithm: string;
	iterations: number;
};

export type AuthenticationState = {
	isAuthenticated: boolean;
	userIdentifier: string | null;
	sessionExpiry: number | null;
};

export type SecretContentMeta = {
	slug: string;
	title: string;
	published: Date;
	updated?: Date;
	tags?: string[];
};

// Zod validation schemas for runtime validation

export const SecretUserSchema = z.object({
	identifier: z.string().min(1, 'Identifier cannot be empty'),
	passphrase: z.tuple([
		z.string().min(1, 'First word cannot be empty'),
		z.string().min(1, 'Second word cannot be empty'),
		z.string().min(1, 'Third word cannot be empty')
	])
});

export const SecretUsersSchema = z.record(
	z.string().min(1, 'User identifier cannot be empty'),
	z.tuple([
		z.string().min(1, 'First word cannot be empty'),
		z.string().min(1, 'Second word cannot be empty'),
		z.string().min(1, 'Third word cannot be empty')
	])
);

export const SecretContentSchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
	title: z.string().min(1, 'Title cannot be empty'),
	content: z.string().min(1, 'Content cannot be empty'),
	published: z.date(),
	updated: z.date().optional(),
	tags: z.array(z.string()).optional()
});

export const EncryptedFileSchema = z.object({
	data: z.string().min(1, 'Encrypted data cannot be empty'),
	iv: z.string().min(1, 'IV cannot be empty'),
	salt: z.string().min(1, 'Salt cannot be empty'),
	algorithm: z.string().min(1, 'Algorithm cannot be empty'),
	iterations: z.number().min(1, 'Iterations must be positive')
});

export const AuthenticationStateSchema = z.object({
	isAuthenticated: z.boolean(),
	userIdentifier: z.string().nullable(),
	sessionExpiry: z.number().nullable()
});

export const SecretContentMetaSchema = z.object({
	slug: z.string().min(1, 'Slug cannot be empty'),
	title: z.string().min(1, 'Title cannot be empty'),
	published: z.date(),
	updated: z.date().optional(),
	tags: z.array(z.string()).optional()
});

// Authentication form validation schemas

export const AuthFormSchema = z.object({
	identifier: z.string().min(1, 'User identifier is required').max(50, 'Identifier too long'),
	word1: z.string().min(1, 'First word is required').max(50, 'Word too long'),
	word2: z.string().min(1, 'Second word is required').max(50, 'Word too long'),
	word3: z.string().min(1, 'Third word is required').max(50, 'Word too long')
});

export type AuthFormData = z.infer<typeof AuthFormSchema>;

// Session management constants
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SESSION_STORAGE_KEY = 'secret-auth-session';

// File naming constants
export const SECRET_FILE_PATTERNS = {
	USERS: 'users.secret.json',
	CONTENT: /^.+\.secret\.md$/,
	ENCRYPTED_USERS: 'users.encrypted',
	ENCRYPTED_CONTENT: /^.+\.encrypted$/
} as const;

// Error types for better error handling
export type SecretAuthError =
	| 'INVALID_CREDENTIALS'
	| 'USER_NOT_FOUND'
	| 'DECRYPTION_FAILED'
	| 'SESSION_EXPIRED'
	| 'VALIDATION_ERROR';

export type SecretContentError =
	| 'CONTENT_NOT_FOUND'
	| 'DECRYPTION_FAILED'
	| 'INVALID_FORMAT'
	| 'ACCESS_DENIED';

// Helper type guards for runtime type checking

export function isSecretUser(data: unknown): data is SecretUser {
	try {
		SecretUserSchema.parse(data);
		return true;
	} catch {
		return false;
	}
}

export function isSecretUsers(data: unknown): data is SecretUsers {
	try {
		SecretUsersSchema.parse(data);
		return true;
	} catch {
		return false;
	}
}

export function isSecretContent(data: unknown): data is SecretContent {
	try {
		SecretContentSchema.parse(data);
		return true;
	} catch {
		return false;
	}
}

export function isEncryptedFile(data: unknown): data is EncryptedFile {
	try {
		EncryptedFileSchema.parse(data);
		return true;
	} catch {
		return false;
	}
}

export function isAuthenticationState(data: unknown): data is AuthenticationState {
	try {
		AuthenticationStateSchema.parse(data);
		return true;
	} catch {
		return false;
	}
}

export function isAuthFormData(data: unknown): data is AuthFormData {
	try {
		AuthFormSchema.parse(data);
		return true;
	} catch {
		return false;
	}
}
