import { z, defineCollection, reference } from 'astro:content'

const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        published: z.coerce.date(),
        updated: z.coerce.date(),
        tags: z.array(reference('tags')),
        tldr: z.string().optional(),
        discussion: z.string().url().optional(),
        category: reference('categories'),
    }),
})

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        published: z.coerce.date(),
        updated: z.coerce.date(),
        prio: z.number(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
        tags: z.array(reference('tags')),
        links: z.array(z.object({
            title: z.string(),
            url: z.string().url(),
        })).optional(),
        category: reference('categories'),
    }),
})

const usesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        published: z.coerce.date(),
        updated: z.coerce.date(),
        tags: z.array(reference('tags')),
        url: z.string().url(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
        openSource: z.boolean().optional(),
        category: reference('categories'),
    }),
})

const tagsCollection = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
})

const categoriesCollection = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
})

export const collections = {
    'posts': postsCollection,
    'projects': projectsCollection,
    'uses': usesCollection,
    'tags': tagsCollection,
    'categories': categoriesCollection,
}