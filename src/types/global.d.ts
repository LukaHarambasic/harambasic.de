import type { MarkdownInstance } from "astro";

export {};

declare global {

    interface PostMeta {
        title: string;
        description: string;
        publishDate: Date;
        categories: string[];
        tldr: string;
        discussion: string;
    }

    interface Post extends MarkdownInstance<Record<string, any>> {
        frontmatter: PostMeta
    }
    
}
