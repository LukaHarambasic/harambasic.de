import type { MarkdownHeading, MarkdownInstance } from 'astro'
import { SortDirection, SortProperty } from '../../types/enums'
import type { Post, TocNode } from '../../types/post'
import { formatDate } from '../helper'
import { rawToCategories } from './categories'

// TODO test
export function rawToPosts(rawPosts: MarkdownInstance<Record<string, any>>[]): Post[] {
	return rawPosts.map((rawPost): Post => {
		const { title, description, publishDate, tldr, discussion } = rawPost.frontmatter as Post
		const rawCategories = rawPost.frontmatter.categories
		const fileName = rawPost?.file?.split('/')?.pop()?.split('.')?.shift()
		const path = `/posts/${fileName}`
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
		}
	})
}

// TODO test
export function sortPosts(posts: Post[], property: SortProperty, direction: SortDirection) {
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
						new Date(b.publishDate).valueOf() - new Date(a.publishDate).valueOf()
				)
			} else if (direction === SortDirection.Desc) {
				return posts.sort(
					(a: Post, b: Post) =>
						new Date(a.publishDate).valueOf() - new Date(b.publishDate).valueOf()
				)
			}
			break
		case SortProperty.Title:
			if (direction === SortDirection.Asc) {
				return posts.sort((a: Post, b: Post) => b.title.localeCompare(a.title))
			} else if (direction === SortDirection.Desc) {
				return posts.sort((a: Post, b: Post) => a.title.localeCompare(b.title))
			}
			break
		default:
			return []
	}
	return []
}

// TODO test
export function filterPostsByCategory(posts: Post[], categorySlug: string): Post[] {
	if (categorySlug === 'all') return posts
	return posts.filter((post) => {
		return post.categories.some((category) => category.slug === categorySlug)
	})
}

// TODO test
// TODO can this be rewritten in a nicer way?
// provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
function getNestedToc(list: MarkdownHeading[]): TocNode[] {
	let latestEntry: TocNode | null
	let latestParent: TocNode | null
	const listCopy = JSON.parse(JSON.stringify(list))
	if (listCopy.length <= 1) return listCopy
	const entryDepth = list.reduce((acc, item) => {
		return item.depth < acc ? item.depth : acc
	}, Number.POSITIVE_INFINITY)
	return listCopy.reduce((result, entry) => {
		if (latestEntry && !latestEntry.children) {
			latestEntry.children = []
		}
		let latestEntryDepth = latestEntry?.depth || 0
		let latestEntryChildren = latestEntry?.children || []
		let latestParentChildren = latestParent?.children || []
		if (entry.depth === entryDepth) {
			entry.children = []
			result.push(entry)
			latestParent = null
		} else if (entry.depth === latestEntryDepth + 1) {
			latestEntryChildren.push(entry)
			latestParent = latestEntry
		} else if (entry.depth === latestEntryDepth) {
			latestParentChildren.push(entry)
		} else {
			console.error('Unexpected Toc behaviour', entry)
		}
		latestEntry = entry
		return result
	}, [])
}
