import type { MarkdownInstance } from 'astro';
import { SortDirection, SortProperty } from '../../types/enums';
import type { Post } from '../../types/post';
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
			categories: rawToCategories(rawCategories),
			tldr,
			discussion,
			Content: rawProject.Content,
			file: rawProject.file,
		};
	});
}

// TODO test
export async function sortPosts(
	posts: Post[],
	property: SortProperty,
	direction: SortDirection
): Promise<Post[]> {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
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
