import type { z } from 'zod'
import type {
  categoriesSchema,
  postSchema,
  projectsSchema,
  tagsSchema,
  usesSchema,
} from '@content/schemas'

// I have no idea why for colelctions that contain an image this other way of inferring the type is needed
export type Project = z.infer<ReturnType<typeof projectsSchema>>
export type Post = z.infer<ReturnType<typeof postSchema>>
export type Use = z.infer<ReturnType<typeof usesSchema>>
export type Tag = z.infer<typeof tagsSchema>
export type Category = z.infer<typeof categoriesSchema>
