import { EntryType, PostSortProperty, SortDirection } from "$lib/types/enums";
import type { Post } from "$lib/types/post";
import { getRawEntries } from "$lib/util/converter";
import { getPost, getSortedPosts } from "./helper";

// This might seem to be overkill, but therefore it decouples the data gathering from the actual framework
export async function loadPosts(): Promise<Post[]> {
    const rawEntries = await getRawEntries(EntryType.Post)
    const posts = rawEntries.map(getPost)
    return getSortedPosts(posts, PostSortProperty.Published, SortDirection.Desc)
}