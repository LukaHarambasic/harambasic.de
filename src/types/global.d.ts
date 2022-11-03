import type { MarkdownInstance } from "astro";

export {};

declare global {

    interface PostMeta {
        title: string,
        publishDate: Date
    }

    interface Post extends MarkdownInstance<Record<string, any>> {
        frontmatter: PostMeta
    }
    
}
