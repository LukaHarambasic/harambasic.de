import { reference, z } from 'astro:content'

export const postSchema = ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  image: image().optional(),
  published: z.coerce.date(),
  updated: z.coerce.date(),
  tags: z.array(reference('tags')),
  tldr: z.string().optional(),
  discussion: z.string().url().optional(),
  category: reference('categories'),
})

export const projectsSchema = ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  image: image(),
  imageAlt: z.string(),
  published: z.coerce.date(),
  updated: z.coerce.date(),
  prio: z.number(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
  tags: z.array(reference('tags')),
  links: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
  category: reference('categories'),
})

export const usesSchema = ({ image }) => z.object({
  title: z.string(),
  description: z.string(),
  image: image().optional(),
  published: z.coerce.date(),
  updated: z.coerce.date(),
  tags: z.array(reference('tags')),
  url: z.string().url(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
  openSource: z.boolean().optional(),
  category: reference('categories'),
})

export const tagsSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export const categoriesSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})
