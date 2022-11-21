import type { Category } from '../../types/category';
import { SortDirection, SortProperty } from '../../types/enums';
import type { Post } from '../../types/post';
import { getSlug } from '../helper';

// TODO test
export function getCategories(posts: Post[]): Category[] {
	const rawCategories = posts.map((post) => post.categories).flat();
	const uniqueCategories = rawCategories.reduce((unique: Category[], item: Category): Category[] => {
		const categoryIndex = unique.findIndex(u => item.slug === u.slug)
		const isItemInUnique = categoryIndex >= 0
		if (isItemInUnique) {
			unique[categoryIndex].postCount++
		} else {
			unique.push({
				...item,
				postCount: 1
			})
		}
		return unique
	}, [])
	return sortCategories(uniqueCategories, SortProperty.Display, SortDirection.Desc);
}

export function sortCategories(
	categories: Category[],
	property: SortProperty,
	direction: SortDirection
) {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
	if (property === SortProperty.Date) {
		console.error("Categories can't be filtered by Date")
		return categories
	}
	if (property === SortProperty.Title) {
		console.error("Categories can't be filtered by Title")
		return categories
	}
	switch (property) {
		case SortProperty.Count:
			if (direction === SortDirection.Asc) {
				return categories.sort((a: Category, b: Category) => b.postCount - a.postCount);
			} else if (direction === SortDirection.Desc) {
				return categories.sort((a: Category, b: Category) => a.postCount - b.postCount);
			}
			break;
		case SortProperty.Display:
			if (direction === SortDirection.Asc) {
				return categories.sort((a: Category, b: Category) =>
					b.display.localeCompare(a.display)
				);
			} else if (direction === SortDirection.Desc) {
				return categories.sort((a: Category, b: Category) =>
					a.display.localeCompare(b.display)
				);
			}
			break;
		default:
			return [];
	}
	return [];
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
		fullPath: `/posts/?category=${slug}`,
		postCount: 0,
	};
}
