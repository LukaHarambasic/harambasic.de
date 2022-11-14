import type { Category } from '../../types/category';
import type { Post } from '../../types/post';
import { getSlug } from '../helper';

// TODO test
export function getCategories(posts: Post[]): Category[] {
	const rawCategories = posts.map((post) => post.categories).flat();
	const uniqueCategories = rawCategories.filter(
		(category, index, self) => self.indexOf(category) === index
	);
	return uniqueCategories;
}

// TODO test
export function getPostsByCategory(posts: Post[], category: Category): Post[] {
	return posts.filter((post) => {
		return post.categories.some(postCategory => {
			return postCategory.slug === category.slug
		})
	})
}

// TODO test
export function rawToCategories(rawCategories: string[]): Category[] {
	if (rawCategories.length === 0) return []
	return rawCategories.map((category) => getCategoryByDisplay(category));
}

// TODO test
export function getCategoryByDisplay(display: string): Category {
	const slug = getSlug(display);
	return {
		display,
		slug,
		fullPath: `/categories/${slug}`,
	};
}
