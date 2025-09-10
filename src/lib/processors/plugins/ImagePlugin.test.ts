import { describe, it, expect } from 'vitest';
import { createImagePlugin } from './ImagePlugin';

describe('ImagePlugin', () => {
	describe('Plugin Creation', () => {
		it('should create plugin with default config', () => {
			const plugin = createImagePlugin();
			expect(plugin).toBeTypeOf('function');
			expect(plugin.name).toBe('rehypeEnhanceImage');
		});

		it('should create plugin with enhance disabled', () => {
			const plugin = createImagePlugin({ enhance: false });
			expect(plugin).toBeTypeOf('function');
		});

		it('should create plugin with enhance enabled', () => {
			const plugin = createImagePlugin({
				enhance: true,
				responsive: false,
				quality: 80
			});
			expect(plugin).toBeTypeOf('function');
		});

		it('should create plugin with full configuration', () => {
			const plugin = createImagePlugin({
				enhance: true,
				responsive: true,
				sizes: '(max-width: 768px) 100vw, 50vw',
				quality: 85,
				formats: ['webp', 'avif', 'jpeg']
			});
			expect(plugin).toBeTypeOf('function');
		});
	});

	describe('Configuration Options', () => {
		it('should handle empty configuration', () => {
			const plugin = createImagePlugin({});
			expect(plugin).toBeTypeOf('function');
		});

		it('should handle undefined configuration', () => {
			const plugin = createImagePlugin();
			expect(plugin).toBeTypeOf('function');
		});

		it('should handle partial configuration', () => {
			const plugin = createImagePlugin({ enhance: true });
			expect(plugin).toBeTypeOf('function');
		});
	});
});
