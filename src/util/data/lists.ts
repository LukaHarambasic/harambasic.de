import { MarkdownInstance } from 'astro'
import { SortDirection, SortProperty } from '../../types/enums'
import type { List, ListEntry } from '../../types/list'
import { getSlug } from '../helper'

// TODO test
export function rawToLists(rawLists: MarkdownInstance<Record<string, any>>[]): List[] {
	if (rawLists.length === 0) return []
	return rawLists.map((rawList) => {
		const { title, description, entries: rawEntries } = rawList.frontmatter as List
		const slug = getSlug(title)
		const entries: ListEntry[] = rawEntries.map((entry) => {
			return {
				...entry,
				parentSlug: slug,
			}
		})
		return {
			title,
			slug,
			description,
			file: rawList.file,
			entries,
		}
	})
}

// TODO test
export function sortLists(posts: List[], property: SortProperty, direction: SortDirection) {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
	if (property === SortProperty.Display) {
		console.error("Lists can't be filtered by Display")
		return posts
	}
	if (property === SortProperty.Count) {
		console.error("Lists can't be filtered by Count")
		return posts
	}
	if (property === SortProperty.Date) {
		console.error("Lists can't be filtered by Date")
		return posts
	}
	switch (property) {
		case SortProperty.Title:
			if (direction === SortDirection.Asc) {
				return posts.sort((a: List, b: List) => b.title.localeCompare(a.title))
			} else if (direction === SortDirection.Desc) {
				return posts.sort((a: List, b: List) => a.title.localeCompare(b.title))
			}
			break
		default:
			return []
	}
	return []
}
// TODO test
export function sortEntries(posts: ListEntry[], property: SortProperty, direction: SortDirection) {
	// TODO I really really dont like it
	// the sorters are kind of stupid and hard to read
	// default return and everyhting went wrong return are similiar - should there even be a default return?
	if (property === SortProperty.Display) {
		console.error("Entries can't be filtered by Display")
		return posts
	}
	if (property === SortProperty.Count) {
		console.error("Entries can't be filtered by Count")
		return posts
	}
	if (property === SortProperty.Date) {
		console.error("Entries can't be filtered by Date")
		return posts
	}
	switch (property) {
		case SortProperty.Title:
			if (direction === SortDirection.Asc) {
				return posts.sort((a: ListEntry, b: ListEntry) => b.title.localeCompare(a.title))
			} else if (direction === SortDirection.Desc) {
				return posts.sort((a: ListEntry, b: ListEntry) => a.title.localeCompare(b.title))
			}
			break
		default:
			return []
	}
	return []
}

// TODO test
export function getAllEntries(lists: List[]): ListEntry[] {
	return lists.map((list) => list.entries).flat()
}

// TODO test
export function filterEntriesByList(listEntries: ListEntry[], listSlug: string): ListEntry[] {
	if (listSlug === 'all') return listEntries
	return listEntries.filter((entry) => entry.parentSlug === listSlug)
}
