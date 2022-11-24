import { MarkdownInstance } from "astro";

import type { List, ListEntry, } from "../../types/list";
import { getSlug } from "../helper";

// TODO test
export function rawToLists(rawLists: MarkdownInstance<Record<string, any>>[]): List[] {
  if (rawLists.length === 0) return []
  return rawLists.map((rawList) => {
    const { title, description, entries } =
      rawList.frontmatter as List;
    return {
      title,
      slug: getSlug(title),
      description,
      entries,
      file: rawList.file
    };
  });
}

export function getAllEntries(lists: List[]): ListEntry[] {
  return lists.map(list => list.entries).flat()
}