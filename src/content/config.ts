import { defineCollection } from 'astro:content'
import {
  categoriesSchema,
  postSchema,
  projectsSchema,
  tagsSchema,
  usesSchema,
} from './schemas'

const postsCollection = defineCollection({
  type: 'content',
  schema: postSchema,
})

const projectsCollection = defineCollection({
  type: 'content',
  schema: projectsSchema,
})

const usesCollection = defineCollection({
  type: 'content',
  schema: usesSchema,
})

const tagsCollection = defineCollection({
  type: 'content',
  schema: tagsSchema,
})

const categoriesCollection = defineCollection({
  type: 'data',
  schema: categoriesSchema,
})

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
  uses: usesCollection,
  tags: tagsCollection,
  categories: categoriesCollection,
}
