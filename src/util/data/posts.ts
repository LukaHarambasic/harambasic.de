import type { MarkdownHeading, MarkdownInstance } from 'astro';
import type { Post, TocNode, Category } from '../../types/post';
import { SortDirection, SortProperty } from '../../types/enums';
import { formatDate, getSlug } from '../helper';

// TODO test
export function rawToPosts(rawPosts: MarkdownInstance<Record<string, any>>[]): Post[] {
	return rawPosts.map((rawPost): Post => {
		const { title, description, publishDate, tldr, discussion } = rawPost.frontmatter as Post;
		const rawCategories = rawPost.frontmatter.categories;
		const fileName = rawPost?.file?.split('/')?.pop()?.split('.')?.shift();
		const path = `/posts/${fileName}`;
		return {
			title,
			description,
			publishDate,
			publishDateFormatted: formatDate(publishDate),
			categories: rawToCategories(rawCategories),
			tldr,
			discussion,
			Content: rawPost.Content,
			file: rawPost.file,
			path,
			permalink: `https://harambasic.de${path}`,
			toc: getNestedToc(rawPost.getHeadings()),
		};
	});
}

// TODO test
export function sortPosts(posts: Post[], property: SortProperty, direction: SortDirection) {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
	if (property === SortProperty.Display) {
		console.error("Posts can't be filtered by Display");
		return posts;
	}
	if (property === SortProperty.Count) {
		console.error("Posts can't be filtered by Count");
		return posts;
	}
	switch (property) {
		case SortProperty.Date:
			if (direction === SortDirection.Asc) {
				return posts.sort(
					(a: Post, b: Post) =>
						new Date(b.publishDate).valueOf() - new Date(a.publishDate).valueOf()
				);
			} else if (direction === SortDirection.Desc) {
				return posts.sort(
					(a: Post, b: Post) =>
						new Date(a.publishDate).valueOf() - new Date(b.publishDate).valueOf()
				);
			}
			break;
		case SortProperty.Title:
			if (direction === SortDirection.Asc) {
				return posts.sort((a: Post, b: Post) => b.title.localeCompare(a.title));
			} else if (direction === SortDirection.Desc) {
				return posts.sort((a: Post, b: Post) => a.title.localeCompare(b.title));
			}
			break;
		default:
			return [];
	}
	return [];
}

// TODO test
export function filterPostsByCategory(posts: Post[], categorySlug: string): Post[] {
	if (categorySlug === 'all') return posts;
	return posts.filter((post) => {
		return post.categories.some((category) => category.slug === categorySlug);
	});
}

// TODO test
// TODO can this be rewritten in a nicer way?
// provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
function getNestedToc(list: MarkdownHeading[]): TocNode[] {
	let latestEntry: TocNode | null;
	let latestParent: TocNode | null;
	const listCopy = JSON.parse(JSON.stringify(list));
	if (listCopy.length <= 1) return listCopy;
	const entryDepth = list.reduce((acc, item) => {
		return item.depth < acc ? item.depth : acc;
	}, Number.POSITIVE_INFINITY);
	return listCopy.reduce((result, entry) => {
		if (latestEntry && !latestEntry.children) {
			latestEntry.children = [];
		}
		let latestEntryDepth = latestEntry?.depth || 0;
		let latestEntryChildren = latestEntry?.children || [];
		let latestParentChildren = latestParent?.children || [];
		if (entry.depth === entryDepth) {
			entry.children = [];
			result.push(entry);
			latestParent = null;
		} else if (entry.depth === latestEntryDepth + 1) {
			latestEntryChildren.push(entry);
			latestParent = latestEntry;
		} else if (entry.depth === latestEntryDepth) {
			latestParentChildren.push(entry);
		} else {
			console.error('Unexpected Toc behaviour', entry);
		}
		latestEntry = entry;
		return result;
	}, []);
}

// TODO test
export function getCategories(posts: Post[]): Category[] {
	const rawCategories = posts.map((post) => post.categories).flat();
	const uniqueCategories = rawCategories.reduce(
		(unique: Category[], item: Category): Category[] => {
			const categoryIndex = unique.findIndex((u) => item.slug === u.slug);
			const isItemInUnique = categoryIndex >= 0;
			if (isItemInUnique) {
				unique[categoryIndex].count++;
			} else {
				unique.push({
					...item,
					count: 1,
				});
			}
			return unique;
		},
		[]
	);
	return sortCategories(uniqueCategories, SortProperty.Display, SortDirection.Desc);
}

// TODO test
export function sortCategories(
	categories: Category[],
	property: SortProperty,
	direction: SortDirection
) {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
	if (property === SortProperty.Date) {
		console.error("Categories can't be filtered by Date");
		return categories;
	}
	if (property === SortProperty.Title) {
		console.error("Categories can't be filtered by Title");
		return categories;
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
				return categories.sort((a: Category, b: Category) => b.display.localeCompare(a.display));
			} else if (direction === SortDirection.Desc) {
				return categories.sort((a: Category, b: Category) => a.display.localeCompare(b.display));
			}
			break;
		default:
			return [];
	}
	return [];
}

// TODO test
// TODO is that one even in use?
export function getPostsByCategory(posts: Post[], category: Category): Post[] {
	return posts.filter((post) => {
		return post.categories.some((postCategory) => {
			return postCategory.slug === category.slug;
		});
	});
}

// TODO test
function rawToCategories(rawCategories: string[]): Category[] {
	if (rawCategories.length === 0) return [];
	return rawCategories.map((category) => {
		const slug = getSlug(category);
		return {
			display: category,
			slug,
			fullPath: `/posts/?category=${slug}`,
			count: 0,
		}
	});
}