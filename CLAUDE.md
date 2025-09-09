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
- Image optimization and processing
- Prerender error handling for 404s
- **Deployment**: Netlify via standard integration (automatic builds from Git)
