# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build

### Code Quality

- `npm run lint` - Check formatting and linting (Prettier + ESLint + CSS)
- `npm run lint:fix` - Fix linting issues automatically
- `npm run lint:css` - Check CSS property ordering and standards
- `npm run format` - Format code with Prettier and CSS
- `npm run format:css` - Format CSS files with property ordering
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

Git hooks are managed via **Husky** and automatically enforce quality standards.

## Architecture

### SvelteKit Static Site

- **Framework**: SvelteKit 5 with static adapter
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: PostCSS with nested syntax, autoprefixer, cssnano, and CSS property ordering
- **Images**: Enhanced image processing via @sveltejs/enhanced-img
- **CSS Quality**: Automated property ordering and linting with postcss-sorting

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

### Programming Paradigm

- **Functional Programming Only** - Use pure functions, avoid classes and OOP patterns
- Functions should be stateless with clear inputs/outputs
- Prefer composition over inheritance/interfaces
- Use type aliases instead of interfaces where possible
- Avoid side effects, prefer explicit parameter passing

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
- CSS property ordering and linting enforcement
- Image optimization and processing
- Prerender error handling for 404s
- **Deployment**: Netlify via standard integration (automatic builds from Git)

## CSS Quality Standards

### Automated CSS Property Ordering

This project enforces standardized CSS property ordering using `postcss-sorting`:

#### Property Order Hierarchy:

1. **Display & Layout** - `display`, `visibility`, `opacity`
2. **Positioning** - `position`, `top`, `right`, `bottom`, `left`, `z-index`
3. **Box Model** - `margin`, `padding`, `width`, `height`, `size`
4. **Borders** - `border`, `border-radius`, `outline`, `box-shadow`
5. **Flexbox/Grid** - `flex`, `justify-content`, `align-items`, `grid`
6. **Background** - `background` properties (high priority as requested)
7. **Typography** - `color`, `font`, `text-*` properties
8. **Visual Effects** - `list-style`, `table-layout`
9. **Animations** - `transition`, `animation`, `transform`
10. **Miscellaneous** - `cursor`, `user-select`, `overflow`

### CSS Linting Commands

- **`npm run format:css`** - Automatically sorts CSS properties according to standards
- **`npm run lint:css`** - Validates CSS property ordering and reports violations
- **Integration** - CSS linting is automatically included in `npm run lint` and `npm run format`

### Quality Gates

CSS quality is enforced at multiple levels:

1. **Pre-commit Hook** - Automatically formats and validates CSS before commits
2. **GitHub Actions** - CI/CD pipeline includes CSS linting checks
3. **Development** - CSS formatting available on-demand via npm scripts

#### PostCSS Configuration

Located in `postcss.config.mjs`:

- **Environment-aware** - Different processing for development vs production
- **Comprehensive** - Includes nested syntax, property sorting, autoprefixer
- **Production optimized** - cssnano minification for production builds only

## Quality Standards & Git Hooks (Husky)

### Automated Quality Gate Workflow

This repository uses **Husky** to enforce strict quality standards through automated git hooks that mirror the GitHub Actions workflows. The commit process includes:

#### Commit Workflow:

1. **Pre-commit** (`/.husky/pre-commit`): Runs quality checks and auto-fixes
2. **Commit-msg** (`/.husky/commit-msg`): Validates commit message format
3. **Post-commit** (`/.husky/post-commit`): Generates social media previews

### Pre-Commit Quality Gates

**All commits must pass these quality checks locally before being allowed:**

#### Required Quality Checks (runs automatically on each commit):

1. **Code Formatting** (`npm run format`)
   - Prettier auto-formatting applied to all files
   - CSS property ordering and formatting via PostCSS
   - Modified files automatically staged after formatting

2. **Linting with Auto-Fix** (`npm run lint:fix`)
   - ESLint rules applied with automatic fixes
   - Modified files automatically staged after linting

3. **Final Lint Verification** (`npm run lint`)
   - Ensures all linting issues are resolved (ESLint + CSS)
   - Validates CSS property ordering standards
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

### Quality Standards Policy

**CRITICAL**: Everything that runs in the GitHub Actions `quality-gate` workflow **MUST** pass locally before commit. This includes:

- All formatting checks (Prettier)
- All linting rules (ESLint)
- Type checking (svelte-check)
- Unit tests (Vitest)
- Build verification

### Husky Setup

Husky hooks are automatically active in this repository. No additional setup required.

The integrated workflow:

- ✅ **Auto-fixes** formatting and linting issues when possible
- ✅ **Stages changes** made by auto-fixes automatically
- ✅ **Prevents commits** that fail any quality check
- ✅ **Generates social media previews** after successful commits
- ✅ **Saves CI/CD time** by catching issues locally

### Git Hooks Policy

**🚫 CRITICAL: NEVER BYPASS GIT HOOKS**

Git hooks in this repository are **mandatory quality gates** and must NEVER be bypassed under any circumstances. Claude Code is **strictly forbidden** from using `--no-verify` or any other method to bypass git hooks unless explicitly instructed by the user.

**If git hooks fail:**

1. Investigate and fix the underlying issue
2. Run quality checks manually to identify the problem
3. Resolve all failures before attempting to commit again
4. Ask the user for guidance if unable to resolve issues

**The `--no-verify` flag is BANNED** - do not use it without explicit user permission.

**Note**: Git hooks ensure code quality and prevent broken code from entering the repository.

### Troubleshooting

#### Common Issues:

1. **Formatting/Linting Failures**: Usually auto-fixed. If not, fix manually and retry commit.
2. **Type Errors**: Fix TypeScript/Svelte type issues manually.
3. **Test Failures**: Fix failing tests before committing.
4. **Build Failures**: Resolve build errors, often related to imports or syntax.
5. **Social Media Generation**: Post-commit hook automatically generates previews and amends the commit.

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

#### Husky Hook Files:

- `.husky/pre-commit` - Quality gates
- `.husky/commit-msg` - Commit message validation (commitlint)
- `.husky/post-commit` - Social media preview generation
