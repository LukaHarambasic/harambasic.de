# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build

### Code Quality

- `npm run lint` - Check formatting and linting (Prettier + ESLint)
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run Svelte type checking in watch mode

### Testing

- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Run Playwright end-to-end tests (builds and previews first)

### Content Management Scripts

- `npm run newPost` - Generate new blog post scaffold
- `npm run generateFavicons` - Fetch and generate favicon files
- `npm run socialMedia:auto` - Auto-generate social media previews
- `npm run socialMedia:manual` - Generate social media previews manually
- `npm run generateCardImages` - Generate card images (requires .env file)

### Git Hooks & Quality Assurance

- `npm run install-hooks` - Install/update git hooks for automatic quality checks

## Architecture

### SvelteKit Static Site

- **Framework**: SvelteKit 5 with static adapter
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: PostCSS with nested syntax, autoprefixer, and cssnano
- **Images**: Enhanced image processing via @sveltejs/enhanced-img

### Content System

Content is managed in `src/content/` with different types:

- **Posts** (`posts/`) - Blog articles in markdown
- **Projects** (`projects/`) - Portfolio projects with metadata
- **Uses** (`uses/`) - Tools and software recommendations
- **Shareables** (`shareables/`) - Shareable content/bookmarks _INACTIVE_
- **Snippets** (`snippets/`) - Code snippets _INACTIVE_

### Type System

Centralized type definitions in `src/lib/types/`:

- `entry.d.ts` - Base entry interface and metadata structure
- `enums.ts` - Entry types, sort properties, and status enums
- Individual type files for posts, projects, shareables, tags

### Key Concepts

- **Entry System**: Unified content model with `EntryType` enum (POST, PROJECT, USES_ENTRY, SHAREABLE)
- **Metadata Processing**: Front-matter parsing with remark/rehype pipeline
- **Tag System**: Hierarchical tagging across all content types
- **Static Generation**: Full prerendering with 404 error handling

### Directory Structure

- `src/lib/components/` - Reusable Svelte components
- `src/lib/data/` - Data processing utilities
- `src/lib/util/` - Utility functions
- `src/lib/styles/` - Global styles and CSS utilities
- `src/routes/` - SvelteKit file-based routing
- `scripts/` - Node.js build and content generation scripts

### Testing Setup

- **Unit Tests**: Vitest configuration
- **E2E Tests**: Playwright (configured to build and preview before testing)
- Note: Test directory is configured as `e2e/` but may not exist yet

### Build & Deployment

- Static site generation via `@sveltejs/adapter-static`
- PostCSS processing with nested syntax and optimization
- Image optimization and processing
- Prerender error handling for 404s
- **Deployment**: Netlify via standard integration (automatic builds from Git)

## Quality Standards & Git Hooks

### Pre-Commit Quality Gates

This repository enforces strict quality standards through automated git hooks that mirror the GitHub Actions workflows. **All commits must pass these quality checks locally before being allowed:**

#### Required Quality Checks (runs automatically on each commit):

1. **Code Formatting** (`npm run format`)
   - Prettier auto-formatting applied to all files
   - Modified files automatically staged after formatting

2. **Linting with Auto-Fix** (`npm run lint:fix`)
   - ESLint rules applied with automatic fixes
   - Modified files automatically staged after linting

3. **Final Lint Verification** (`npm run lint`)
   - Ensures all linting issues are resolved
   - Fails if unfixable issues remain

4. **Type Checking** (`npm run check`)
   - Svelte and TypeScript type validation
   - Must pass with zero type errors

5. **Unit Tests** (`npm run test`)
   - All Vitest unit tests must pass
   - Zero tolerance for failing tests

6. **Build Verification** (`npm run build`)
   - Production build must complete successfully
   - Ensures no build-time errors

### Git Hook Setup

Install the pre-commit hook:
```bash
npm run install-hooks
```

The hook will:
- ✅ **Auto-fix** formatting and linting issues when possible
- ✅ **Stage changes** made by auto-fixes automatically
- ✅ **Prevent commits** that fail any quality check
- ✅ **Save CI/CD time** by catching issues locally

### Quality Standards Policy

**CRITICAL**: Everything that runs in the GitHub Actions `quality-gate` workflow **MUST** pass locally before commit. This includes:

- All formatting checks (Prettier)
- All linting rules (ESLint)
- Type checking (svelte-check)
- Unit tests (Vitest)
- Build verification

### Bypassing Hooks (Emergency Only)

To temporarily bypass the pre-commit hook (emergencies only):
```bash
git commit --no-verify -m "emergency: bypass hook"
```

**Note**: Bypassed commits will still fail in GitHub Actions if they don't meet quality standards.

### Troubleshooting

#### Common Issues:

1. **Formatting/Linting Failures**: Usually auto-fixed. If not, fix manually and retry commit.
2. **Type Errors**: Fix TypeScript/Svelte type issues manually.
3. **Test Failures**: Fix failing tests before committing.
4. **Build Failures**: Resolve build errors, often related to imports or syntax.

#### Manual Quality Check Commands:

Run individual quality checks manually:
```bash
npm run format      # Fix formatting
npm run lint:fix    # Fix linting
npm run lint        # Check linting
npm run check       # Type checking
npm run test        # Run tests
npm run build       # Verify build
```

#### Hook Management:

```bash
npm run install-hooks    # Install/reinstall hooks
```
