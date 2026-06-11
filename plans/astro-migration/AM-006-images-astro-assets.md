# AM-006: Images via astro:assets

**Phase:** 2 - Content Layer | **Size:** S | **Depends on:** AM-005

## Goal

Replace `@sveltejs/enhanced-img` (`<enhanced:img>` + `import.meta.glob` with `{ enhanced: true, w: '1280;640;400' }` in `src/lib/util/enhancedImages.ts`) with Astro's built-in `astro:assets`, preserving responsive widths, formats, and lazy loading.

## Scope / Tasks

1. Create `src/lib/images.ts`:
   - `isSvgImage(name)` - verbatim from `util/images.ts`
   - Eager glob lookup maps replacing `getProjectImage`/`getUsesImage`/`getWorkImage`:
     ```ts
     import type { ImageMetadata } from 'astro';
     const projectImages = import.meta.glob<{ default: ImageMetadata }>(
     	'/src/assets/img/projects/*',
     	{ eager: true }
     );
     export function getProjectImage(name: string): ImageMetadata | null { ... }
     ```
     Same pattern for `uses` and `work`. Return `null` for `'TODO'`/missing, matching today's behavior.
2. Rendering convention (used by AM-008/010/013): raster images go through `<Picture>`/`<Image>` from `astro:assets` with `widths={[400, 640, 1280]}`, `formats={['avif', 'webp']}`, explicit `sizes`, `loading="lazy"`, `decoding="async"` - mirroring what enhanced-img produced. SVG logos bypass optimization: plain `<img src="/uses/{name}">` from `public/` (decided via `isSvgImage`).
3. Profile image `src/assets/img/profile.jpeg`: static import + `<Image>` on the home page (AM-015 covers the home page itself; this ticket only establishes the helper + convention and verifies one usage builds).
4. Post inline images: unchanged - plain static files in `public/posts/[slug]/`, referenced as absolute paths in markdown. Astro's markdown image optimization does not apply to `public/` paths (intentional: parity, and post images include GIFs).
5. Delete `src/lib/util/enhancedImages.ts` and the `EnhancedImageData` type; remove enhanced-img-specific code paths in `util/images.ts` (`getImageFromGlob`).

## Acceptance Criteria

- [ ] `bun run build` emits hashed avif/webp variants at 400/640/1280 for a sample project, uses, and work image
- [ ] `getProjectImage('greenkayak.jpeg')` returns ImageMetadata; `getProjectImage('TODO')` returns null
- [ ] SVG logos render as plain `<img>` with correct `/uses/...` URLs
- [ ] No `enhanced:true` glob options or `<enhanced:img>` references remain

## Notes / Parity traps

- Frontmatter stores only the **filename** (`image: greenkayak.jpeg`); the directory is implied by the content type - keep that contract rather than switching schemas to Astro's `image()` helper, which would require rewriting all frontmatter to relative paths. The glob-map approach is the minimal-change equivalent of today's design.
- `alt` text: projects have `imageAlt`; uses/work fall back to title - preserve current alt-text logic exactly (check each call site when porting pages).
