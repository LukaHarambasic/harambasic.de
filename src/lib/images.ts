import type { ImageMetadata, ImageOutputFormat } from 'astro';

// Shared <Picture> output config - mirrors the old enhanced-img widths/formats.
export const IMAGE_WIDTHS = [400, 640, 1280];
export const IMAGE_FORMATS: ImageOutputFormat[] = ['avif', 'webp'];

/** SVG logos bypass astro:assets optimization and are served from public/. */
export function isSvgImage(imageName: string): boolean {
	return imageName?.endsWith('.svg') ?? false;
}

// Eager glob maps replacing the enhanced-img globs. Raster only (same extension
// set as the old enhanced-img config) - SVGs are intentionally excluded so they
// fall through to the plain <img src="/uses/..."> public path.
const projectImages = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
	{ eager: true }
);
const usesImages = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/img/uses/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
	{ eager: true }
);
const workImages = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/img/work/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
	{ eager: true }
);

function lookup(
	map: Record<string, { default: ImageMetadata }>,
	dir: string,
	name: string
): ImageMetadata | null {
	if (!name || name === 'TODO') return null;
	const mod = map[`/src/assets/img/${dir}/${name}`];
	return mod ? mod.default : null;
}

export function getProjectImage(name: string): ImageMetadata | null {
	return lookup(projectImages, 'projects', name);
}
export function getUsesImage(name: string): ImageMetadata | null {
	return lookup(usesImages, 'uses', name);
}
export function getWorkImage(name: string): ImageMetadata | null {
	return lookup(workImages, 'work', name);
}
