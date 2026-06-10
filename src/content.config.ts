import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Frontmatter-only schemas (html/toc come from render(), never frontmatter).
// `image: 'TODO'` is a real value in post frontmatter — the image helpers map it to null.

const employmentType = z.enum(['full-time', 'part-time', 'contract', 'internship']);

// YAML parses unquoted `2025-10-01` as a Date; quoted values stay strings. Normalize
// both to a `yyyy-MM-dd` string so the view-model Position type stays string-based.
const toYmd = (v: string | Date) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10));
const ymd = z.union([z.string(), z.date()]).transform(toYmd);
const ymdNullable = z
	.union([z.string(), z.date(), z.null()])
	.transform((v) => (v == null ? null : toYmd(v)));

// `image:` is sometimes written empty (→ null). Treat empty/missing as 'TODO',
// which the image helpers map to "no image" — same as the old getImageFromGlob.
const imageField = z
	.string()
	.nullish()
	.transform((v) => v ?? 'TODO');

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: imageField,
		published: z.coerce.date(),
		updated: z.coerce.date(),
		tags: z.array(z.string()),
		tldr: z.string().optional(),
		discussion: z.string().optional()
	})
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: imageField,
		imageAlt: z.string().optional(),
		published: z.coerce.date(),
		updated: z.coerce.date(),
		prio: z.number(),
		status: z.enum(['active', 'inactive']),
		links: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
		tags: z.array(z.string()),
		relatedWork: z.array(z.string()).optional()
	})
});

const uses = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/uses' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		url: z.string(),
		status: z.enum(['active', 'inactive']),
		image: imageField,
		// Some entries write `openSource:` with no value → null; coerce to false.
		openSource: z
			.boolean()
			.nullish()
			.transform((v) => v ?? false),
		published: z.coerce.date(),
		updated: z.coerce.date()
	})
});

const work = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: imageField,
		published: z.coerce.date(),
		updated: z.coerce.date(),
		location: z.string(),
		employmentType: employmentType.optional(),
		positions: z.array(
			z.object({
				title: z.string(),
				startDate: ymd,
				endDate: ymdNullable,
				content: z.string(),
				employmentType: employmentType.optional()
			})
		),
		relatedProjects: z.array(z.string()).optional(),
		tags: z.array(z.string())
	})
});

// Dormant collections — defined so their writers (fetch-shareable) and routes-to-be
// validate, but no routes consume them today. Permissive schemas.
const snippets = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/snippets' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		tags: z.array(z.string()).default([]),
		image: z.string().optional(),
		published: z.coerce.date().optional(),
		updated: z.coerce.date().optional()
	})
});

const shareables = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/shareables' }),
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()).nullable().default([]),
		url: z.string().optional(),
		published: z.coerce.date().optional()
	})
});

export const collections = { posts, projects, uses, work, snippets, shareables };
