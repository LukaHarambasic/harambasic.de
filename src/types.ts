import type { categoriesSchema, postSchema, projectsSchema, tagsSchema, usesSchema } from "@content/schemas";
import type { z } from "astro:content";

export type Project = z.infer<typeof projectsSchema>
export type Post = z.infer<typeof postSchema>
export type Use = z.infer<typeof usesSchema>
export type Tag = z.infer<typeof tagsSchema>
export type Category = z.infer<typeof categoriesSchema>