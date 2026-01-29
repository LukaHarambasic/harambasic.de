export type EnhancedImageData = {
	sources: Record<string, string>;
	img: {
		src: string;
		w: number;
		h: number;
	};
};

type ImageModule = {
	default: EnhancedImageData;
};

export type ImageGlobResult = Record<string, ImageModule>;

export function getImageFromGlob(
	pictures: ImageGlobResult,
	basePath: string,
	imageName: string
): EnhancedImageData | null {
	if (!imageName || imageName === 'TODO') {
		return null;
	}

	const imagePath = `${basePath}${imageName}`;
	const imageModule = pictures[imagePath];

	if (!imageModule) {
		return null;
	}

	const imageData = imageModule.default;

	if (!imageData || typeof imageData !== 'object' || Object.keys(imageData).length === 0) {
		return null;
	}

	return imageData;
}

export function isSvgImage(imageName: string): boolean {
	return imageName?.endsWith('.svg') ?? false;
}
