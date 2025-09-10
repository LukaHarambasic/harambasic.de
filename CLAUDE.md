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

## Functional Programming Guidelines

### Core Principles

#### ✅ Functional Programming Only

- **Pure functions with clear inputs/outputs**
- **Avoid classes and OOP patterns**
- **Prefer composition over inheritance**
- **Use type aliases instead of interfaces where possible**
- **No side effects - prefer explicit parameter passing**

#### ✅ Simplicity Over Complexity

- **"Boring and obvious" solutions preferred**
- **Single responsibility per function**
- **Avoid premature abstractions**
- **If you need to explain it, it's too complex**

#### ✅ Pragmatic Over Dogmatic

- **Solo project for a small private website**
- **Adapt to project reality, not enterprise patterns**
- **Simple solutions that work > complex "best practices"**

### Architectural Patterns to Follow

#### ✅ Current Good Patterns

**Pure Data Transformation Functions:**

```typescript
// ✅ Good - Pure function, clear input/output
export function filterByTag(entry: Entry, filterTagSlug: string): boolean {
	if (filterTagSlug === 'all') return true;
	return entry.tags.some((tag) => tag.slug === filterTagSlug);
}

// ✅ Good - Stateless data processing
export function getPost(rawEntry: RawEntry): Post | null {
	try {
		return {
			type: 'post',
			slug: getSlug(rawEntry.title),
			title: rawEntry.title
			// ... pure transformation
		};
	} catch (error) {
		return null;
	}
}
```

**Service Interfaces (Simple):**

```typescript
// ✅ Good - Simple interface, pure functions
export interface ContentService {
	getEntries(entryType: EntryType): Promise<RawEntry[]>;
	getEntry(entryType: EntryType, slug: string): Promise<RawEntry | null>;
}
```

**Union Types Over Enums:**

```typescript
// ✅ Good - Simple union type
export type EntryType = 'post' | 'project' | 'uses' | 'shareable';

// ✅ Good - Union type with constants
export type ContentStatus = 'active' | 'inactive' | 'all';
```

#### ❌ Patterns to Avoid

**Complex OOP Architectures:**

```typescript
// ❌ Avoid - Unnecessary abstraction for solo project
class ContentRepositoryFactory {
	createRepository(type: string): AbstractContentRepository {
		// Complex factory patterns not needed
	}
}

// ❌ Avoid - Over-engineered interfaces
interface AdvancedContentProcessor {
	withCache(): this;
	withValidation(): this;
	withTransformation(): this;
	// Builder patterns add complexity
}
```

**Over-Engineering:**

```typescript
// ❌ Avoid - Premature optimization
class ContentCacheManager {
	private cache = new Map();
	async invalidate() {
		/* complex cache logic */
	}
	// Caching adds state and complexity
}

// ❌ Avoid - Unnecessary abstraction
interface GenericQueryBuilder<T> {
	where(fn: (item: T) => boolean): this;
	orderBy(key: keyof T): this;
	// Generic query builders for simple filtering
}
```

### Development Guidelines

#### Issue Creation Standards

**✅ Good Issues:**

- Focus on maintainability and simplification
- Solve actual problems, not theoretical ones
- Follow "boring and obvious" principle
- Examples: Bug fixes, performance improvements, test coverage

**❌ Issues to Avoid:**

- Enterprise patterns (repositories, factories, builders)
- Premature optimizations (caching, advanced build tools)
- Over-abstraction (generic utilities, design systems)
- Complex architectural refactors without clear benefit

#### Code Review Checklist

When reviewing code changes, ask:

- [ ] Does this follow pure function principles?
- [ ] Is this the simplest solution that works?
- [ ] Would this be obvious to someone reading it in 6 months?
- [ ] Does this solve a real problem or is it theoretical?
- [ ] Is the complexity justified by the benefit?

#### Architecture Decision Framework

When implementing new features, choose based on:

1. **Testability** - Can I easily test this pure function?
2. **Readability** - Is this boring and obvious?
3. **Consistency** - Does this match existing functional patterns?
4. **Simplicity** - Is this the simplest solution that works?
5. **Reversibility** - How hard to change later?

### Function Organization Standards

#### ✅ Current Good Structure

```
src/lib/
├── types/           # Type definitions (union types, interfaces)
├── util/            # Pure utility functions
├── data/            # Data transformation functions
├── processors/      # Pure content transformation
├── services/        # Simple service interfaces
└── components/      # Svelte components (functional)
```

#### Function Organization

- **One function per export when possible**
- **Group related pure functions in same file**
- **Keep functions small and focused**
- **Use descriptive function names**

### Testing Strategy (Functional)

#### ✅ Easy to Test (Pure Functions)

```typescript
// ✅ Easy - Pure function with predictable output
describe('filterByTag', () => {
	it('should return true for matching tag', () => {
		const entry = { tags: [{ slug: 'typescript' }] };
		expect(filterByTag(entry, 'typescript')).toBe(true);
	});
});
```

#### ❌ Hard to Test (Stateful/Complex)

```typescript
// ❌ Hard - Complex state, side effects, mocking needed
describe('AdvancedCacheManager', () => {
	it('should invalidate cache when file changes', async () => {
		// Complex test setup, file system mocking, etc.
	});
});
```

### Quality Gates (Functional)

#### Pre-commit Checklist

- [ ] New functions are pure (predictable input/output)
- [ ] No unnecessary classes or complex OOP patterns
- [ ] Functions have single responsibility
- [ ] Code is "boring and obvious"
- [ ] Tests are simple and fast

#### Issue Review Criteria

Before creating new issues, ask:

- [ ] Is this solving a real, measured problem?
- [ ] Is the proposed solution the simplest that works?
- [ ] Does this align with solo project needs?
- [ ] Would this add or reduce complexity?

### Migration Guidelines

When updating existing code:

1. **Start with utilities** - Pure functions are easiest to migrate
2. **Extract pure functions from complex code**
3. **Replace classes with function compositions**
4. **Convert interfaces to type aliases where appropriate**
5. **Remove unused abstractions**

### Success Metrics

#### Code Quality Indicators

- ✅ Most functions are pure (no side effects)
- ✅ Low complexity scores in linting
- ✅ Fast, reliable tests
- ✅ Easy to understand code reviews
- ✅ Minimal abstraction layers

#### Anti-patterns to Watch For

- ❌ Issues proposing complex architectures
- ❌ Pull requests adding many abstraction layers
- ❌ Tests that require extensive mocking
- ❌ Code that needs long explanations
- ❌ "Enterprise patterns" in a personal project

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
