// https://github.com/Charca/astro-blog-template/blob/main/src/pages/blog/index.astro
// Get by id
// Get X 
// Filter by X
// Sort by X

import { SortDirection, SortProperty } from "../../types/enums";

export async function sortPosts(posts: Post[], property: SortProperty, direction: SortDirection): Promise<Post[]> {
    // TODO I really really dont like it
    // the sorters are kind of stupid and hard to read
    // default return and everyhting went wrong return are similiar - should there even be a default return? 
    switch (property) {
        case SortProperty.Date:
            if (direction === SortDirection.Asc) {
                return posts.sort((a: Post, b: Post) => new Date(b.frontmatter.publishDate).valueOf() - new Date(a.frontmatter.publishDate).valueOf());
            } else if (direction === SortDirection.Desc) {
                return posts.sort((a: Post, b: Post) => new Date(a.frontmatter.publishDate).valueOf() - new Date(b.frontmatter.publishDate).valueOf());
            }
            break;
        case SortProperty.Title:
            if (direction === SortDirection.Asc) {
                return posts.sort((a: Post, b: Post) => b.frontmatter.title.localeCompare(a.frontmatter.title));
            } else if (direction === SortDirection.Desc) {
                return posts.sort((a: Post, b: Post) => a.frontmatter.title.localeCompare(b.frontmatter.title));
            }
            break;
        default:
            return []
    }
    return []
}