import { formatDate } from '@util/date'
import { reference, z } from 'astro:content'
import type { ImageFunction } from 'astro:content'

export const baseEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
  published: z.coerce.date().transform((val) => ({
    raw: val,
    formatted: formatDate(val),
  })),
  updated: z.coerce.date().transform((val) => ({
    raw: val,
    formatted: formatDate(val),
  })),
  tags: z.array(reference('tags')),
  category: reference('categories'),
})

export const postSchema = baseEntrySchema.extend({
  tldr: z.string().optional(),
  discussion: z.string().url().optional(),
})

export const projectsSchema = ({ image }: { image: ImageFunction }) =>
  baseEntrySchema.extend({
    image: image(),
    imageAlt: z.string(),
    prio: z.number(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
    links: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
  })

export const usesSchema = ({ image }: { image: ImageFunction }) =>
  baseEntrySchema.extend({
    image: image().optional(),
    url: z.string().url(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
    openSource: z.boolean().optional(),
  })

export const tagsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export const categoriesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})
