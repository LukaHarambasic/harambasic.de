import type { MarkdownInstance } from 'astro';
import { SortDirection, SortProperty } from '../../types/enums';
import type { Post } from '../../types/post';
import { formatDate } from '../helper';
import { rawToCategories } from './categories';

// TODO test
export function rawToPosts(rawPosts: MarkdownInstance<Record<string, any>>[]): Post[] {
	return rawPosts.map((rawProject) => {
		const { title, description, publishDate, tldr, discussion } =
			rawProject.frontmatter as Post;
		const rawCategories = rawProject.frontmatter.categories
		return {
			title,
			description,
			publishDate,
			publishDateFormatted: formatDate(publishDate),
			categories: rawToCategories(rawCategories),
			tldr,
			discussion,
			Content: rawProject.Content,
			file: rawProject.file,
		};
	});
}

// TODO test
export function sortPosts(
	posts: Post[],
	property: SortProperty,
	direction: SortDirection
) {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
	if (property === SortProperty.Display) {
		console.error("Posts can't be filtered by Display")
		return posts
	}
	if (property === SortProperty.Count) {
		console.error("Posts can't be filtered by Count")
		return posts
	}
	switch (property) {
		case SortProperty.Date:
			if (direction === SortDirection.Asc) {
				return posts.sort(
					(a: Post, b: Post) =>
						new Date(b.publishDate).valueOf() -
						new Date(a.publishDate).valueOf()
				);
			} else if (direction === SortDirection.Desc) {
				return posts.sort(
					(a: Post, b: Post) =>
						new Date(a.publishDate).valueOf() -
						new Date(b.publishDate).valueOf()
				);
			}
			break;
		case SortProperty.Title:
			if (direction === SortDirection.Asc) {
				return posts.sort((a: Post, b: Post) =>
					b.title.localeCompare(a.title)
				);
			} else if (direction === SortDirection.Desc) {
				return posts.sort((a: Post, b: Post) =>
					a.title.localeCompare(b.title)
				);
			}
			break;
		default:
			return [];
	}
	return [];
}

// TODO test
export function filterPostsByCategory(posts: Post[], categorySlug: string): Post[] {
	if (categorySlug === "all") return posts
	return posts.filter(post => {
		return post.categories.some(category => category.slug === categorySlug)
	})
}
