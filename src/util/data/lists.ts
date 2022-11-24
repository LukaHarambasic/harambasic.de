import { MarkdownInstance } from "astro";

import type { List, ListEntry, } from "../../types/list";
import { getSlug } from "../helper";

// TODO test
export function rawToLists(rawLists: MarkdownInstance<Record<string, any>>[]): List[] {
  if (rawLists.length === 0) return []
  return rawLists.map((rawList) => {
    const { title, description, entries: rawEntries } =
      rawList.frontmatter as List;
    const slug = getSlug(title);
    const entries: ListEntry[] = rawEntries.map(entry => {
      return {
        ...entry,
        parentSlug: slug
      }
    })
    return {
      title,
      slug,
      description,
      file: rawList.file,
      entries,
    };
  });
}

// TODO test
export function getAllEntries(lists: List[]): ListEntry[] {
  return lists.map(list => list.entries).flat()
}

// TODO test
export function filterEntriesByList(listEntries: ListEntry[], listSlug: string): ListEntry[] {
  if (listSlug === "all") return listEntries
  return listEntries.filter(entry => entry.parentSlug === listSlug)
}