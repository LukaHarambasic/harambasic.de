import type { MarkdownInstance } from "astro";

export interface PostMeta {
    title: string;
    description: string;
    publishDate: Date;
    categories: string[];
    tldr: string;
    discussion: string;
}

export interface Post extends MarkdownInstance<Record<string, any>> {
    frontmatter: PostMeta
}