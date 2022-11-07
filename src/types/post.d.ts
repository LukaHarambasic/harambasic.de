import type { MarkdownInstance } from "astro";

export interface PostMeta {
    title: string;
    description: string;
    publishDate: Date;
    categories: string[];
    tldr: string;
    discussion: string;
}

// TODO I should include a step flatten Post and add and manipulate all required attributes
export interface Post extends MarkdownInstance<Record<string, any>> {
    frontmatter: PostMeta
}