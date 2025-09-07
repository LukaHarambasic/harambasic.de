import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			// TypeScript strict rules
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-var-requires': 'error',

			// General code quality
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-alert': 'error',
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
			'no-script-url': 'error',

			// Best practices
			eqeqeq: ['error', 'always'],
			curly: ['error', 'all'],
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-arrow-callback': 'error',
			'no-throw-literal': 'error'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			// Allow let in Svelte for props and state (Svelte 5 runes)
			'prefer-const': 'off'
		}
	},
	{
		// Relaxed rules for scripts
		files: ['scripts/**/*.js', 'svelte.config.js'],
		rules: {
			'no-console': 'off' // Allow console in scripts
		}
	},
	{
		// Relaxed rules for test files
		files: ['**/*.test.ts', '**/*.spec.ts', 'e2e/**/*.ts'],
		rules: {
			'no-console': 'off' // Allow console in tests
		}
	}
);
