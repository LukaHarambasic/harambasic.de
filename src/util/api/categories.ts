import type { Category } from '../../types/category';
import { Post } from '../../types/post';
import { getSlug } from '../helper';

// TODO test
export function getCategories(posts: Post[]): Category[] {
	const rawCategories = posts.map((post) => post.frontmatter.categories).flat();
	const uniqueCategories = rawCategories.filter(
		(category, index, self) => self.indexOf(category) === index
	);
	const categories: Category[] = uniqueCategories.map((category) => getCategoryByDisplay(category));
	return categories;
}

// TODO test
export function getPostsByCategory(posts: Post[], category: Category): Post[] {
	return posts.filter((post) => post.frontmatter.categories.includes(category.display));
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
