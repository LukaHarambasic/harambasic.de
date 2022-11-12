import { MarkdownInstance } from "astro";
import type { List } from "../../types/list";

// TODO test
export function rawToLists(rawLists: MarkdownInstance<Record<string, any>>[]): List[] {
  if (rawLists.length === 0) return []
  return rawLists.map((rawList) => {
    const { title, description, entries } =
      rawList.frontmatter as List;
    return {
      title,
      description,
      entries,
      file: rawList.file
    };
  });
}