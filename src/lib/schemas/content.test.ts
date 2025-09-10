import { expect, test, describe } from 'vitest';
import {
	RawEntrySchema,
	PostSchema,
	ProjectSchema,
	UsesEntrySchema,
	ShareableSchema,
	TocNodeSchema,
	LinkSchema,
	ContentStatusSchema,
	EntryTypeSchema,
	getSchemaForType,
	ENTRY_SCHEMAS
} from './content';
import type { RawEntry, Post, Project, UsesEntry, Shareable, TocNode, Link } from './content';

describe('Content Schemas', () => {
	describe('TocNodeSchema', () => {
		test('should validate correct TOC node', () => {
			const validTocNode: TocNode = {
				depth: 2,
				slug: 'test-heading',
				value: 'Test Heading'
			};

			const result = TocNodeSchema.safeParse(validTocNode);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(validTocNode);
		});

		test('should validate TOC node with children', () => {
			const validTocNode: TocNode = {
				depth: 1,
				slug: 'parent-heading',
				value: 'Parent Heading',
				children: [
					{
						depth: 2,
						slug: 'child-heading',
						value: 'Child Heading'
					}
				]
			};

			const result = TocNodeSchema.safeParse(validTocNode);

			expect(result.success).toBe(true);
			expect(result.data?.children).toHaveLength(1);
		});

		test('should fail for invalid depth', () => {
			const invalidTocNode = {
				depth: 7, // Invalid depth (max is 6)
				slug: 'test-heading',
				value: 'Test Heading'
			};

			const result = TocNodeSchema.safeParse(invalidTocNode);

			expect(result.success).toBe(false);
		});
	});

	describe('LinkSchema', () => {
		test('should validate correct link', () => {
			const validLink: Link = {
				title: 'Test Link',
				url: 'https://example.com'
			};

			const result = LinkSchema.safeParse(validLink);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(validLink);
		});

		test('should fail for invalid URL', () => {
			const invalidLink = {
				title: 'Test Link',
				url: 'not-a-url'
			};

			const result = LinkSchema.safeParse(invalidLink);

			expect(result.success).toBe(false);
		});

		test('should fail for empty title', () => {
			const invalidLink = {
				title: '',
				url: 'https://example.com'
			};

			const result = LinkSchema.safeParse(invalidLink);

			expect(result.success).toBe(false);
		});
	});

	describe('ContentStatusSchema', () => {
		test('should validate valid status values', () => {
			expect(ContentStatusSchema.safeParse('active').success).toBe(true);
			expect(ContentStatusSchema.safeParse('inactive').success).toBe(true);
			expect(ContentStatusSchema.safeParse('all').success).toBe(true);
		});

		test('should fail for invalid status', () => {
			expect(ContentStatusSchema.safeParse('invalid').success).toBe(false);
			expect(ContentStatusSchema.safeParse('').success).toBe(false);
		});
	});

	describe('EntryTypeSchema', () => {
		test('should validate valid entry types', () => {
			expect(EntryTypeSchema.safeParse('post').success).toBe(true);
			expect(EntryTypeSchema.safeParse('project').success).toBe(true);
			expect(EntryTypeSchema.safeParse('uses').success).toBe(true);
			expect(EntryTypeSchema.safeParse('shareable').success).toBe(true);
		});

		test('should fail for invalid entry type', () => {
			expect(EntryTypeSchema.safeParse('invalid').success).toBe(false);
			expect(EntryTypeSchema.safeParse('').success).toBe(false);
		});
	});

	describe('RawEntrySchema', () => {
		const validRawEntry: RawEntry = {
			html: '<p>Test content</p>',
			toc: [],
			title: 'Test Title',
			description: 'This is a test description that is long enough',
			image: '/test-image.jpg',
			tags: ['test'],
			published: '2024-01-01T00:00:00.000Z',
			updated: '2024-01-01T00:00:00.000Z'
		};

		test('should validate correct raw entry', () => {
			const result = RawEntrySchema.safeParse(validRawEntry);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(validRawEntry);
		});

		test('should fail for missing required fields', () => {
			const invalidRawEntry = {
				...validRawEntry,
				title: '' // Empty title
			};

			const result = RawEntrySchema.safeParse(invalidRawEntry);

			expect(result.success).toBe(false);
		});

		test('should fail for invalid date format', () => {
			const invalidRawEntry = {
				...validRawEntry,
				published: 'invalid-date'
			};

			const result = RawEntrySchema.safeParse(invalidRawEntry);

			expect(result.success).toBe(false);
		});

		test('should accept both YYYY-MM-DD and ISO datetime formats', () => {
			const rawEntryWithDateOnly = {
				...validRawEntry,
				published: '2024-01-01',
				updated: '2024-01-02'
			};

			const rawEntryWithISO = {
				...validRawEntry,
				published: '2024-01-01T00:00:00.000Z',
				updated: '2024-01-02T12:30:45.123Z'
			};

			expect(RawEntrySchema.safeParse(rawEntryWithDateOnly).success).toBe(true);
			expect(RawEntrySchema.safeParse(rawEntryWithISO).success).toBe(true);
		});

		test('should fail for empty tags array', () => {
			const invalidRawEntry = {
				...validRawEntry,
				tags: []
			};

			const result = RawEntrySchema.safeParse(invalidRawEntry);

			expect(result.success).toBe(false);
		});

		test('should validate with optional fields', () => {
			const rawEntryWithOptional: RawEntry = {
				...validRawEntry,
				url: 'https://example.com',
				status: 'active',
				tldr: 'This is a TLDR summary',
				prio: 100
			};

			const result = RawEntrySchema.safeParse(rawEntryWithOptional);

			expect(result.success).toBe(true);
			expect(result.data?.url).toBe('https://example.com');
			expect(result.data?.status).toBe('active');
		});
	});

	describe('PostSchema', () => {
		const validPost: Post = {
			type: 'post',
			slug: 'test-post',
			relativePath: '/posts/test-post',
			fullPath: 'https://example.com/posts/test-post',
			title: 'Test Post',
			description: 'This is a test post description',
			image: '/test-image.jpg',
			tags: [
				{
					display: 'Test',
					slug: 'test',
					relativePath: '/tags/test',
					count: 1,
					type: 'post'
				}
			],
			published: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			updated: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			toc: [],
			tldr: 'This is a test TLDR',
			discussion: 'https://example.com/discussion',
			html: '<p>Test content</p>'
		};

		test('should validate correct post', () => {
			const result = PostSchema.safeParse(validPost);

			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('post');
		});

		test('should fail for wrong type', () => {
			const invalidPost = {
				...validPost,
				type: 'project'
			};

			const result = PostSchema.safeParse(invalidPost);

			expect(result.success).toBe(false);
		});

		test('should fail for short TLDR', () => {
			const invalidPost = {
				...validPost,
				tldr: 'Short'
			};

			const result = PostSchema.safeParse(invalidPost);

			expect(result.success).toBe(false);
		});
	});

	describe('ProjectSchema', () => {
		const validProject: Project = {
			type: 'project',
			slug: 'test-project',
			relativePath: '/projects/test-project',
			fullPath: 'https://example.com/projects/test-project',
			title: 'Test Project',
			description: 'This is a test project description',
			image: '/test-image.jpg',
			tags: [
				{
					display: 'Test',
					slug: 'test',
					relativePath: '/tags/test',
					count: 1,
					type: 'project'
				}
			],
			published: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			updated: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			links: [
				{
					title: 'Project Link',
					url: 'https://github.com/example/project'
				}
			],
			prio: 100,
			status: 'active',
			html: '<p>Project content</p>',
			imageAlt: 'Test project screenshot'
		};

		test('should validate correct project', () => {
			const result = ProjectSchema.safeParse(validProject);

			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('project');
		});

		test('should fail for empty links array', () => {
			const invalidProject = {
				...validProject,
				links: []
			};

			const result = ProjectSchema.safeParse(invalidProject);

			expect(result.success).toBe(false);
		});

		test('should fail for priority out of range', () => {
			const invalidProject = {
				...validProject,
				prio: 1001 // Over max
			};

			const result = ProjectSchema.safeParse(invalidProject);

			expect(result.success).toBe(false);
		});
	});

	describe('UsesEntrySchema', () => {
		const validUsesEntry: UsesEntry = {
			type: 'uses',
			slug: 'test-tool',
			relativePath: '/uses/test-tool',
			fullPath: 'https://example.com/uses/test-tool',
			title: 'Test Tool',
			description: 'This is a test tool description',
			image: '/test-image.jpg',
			tags: [
				{
					display: 'Tool',
					slug: 'tool',
					relativePath: '/tags/tool',
					count: 1,
					type: 'uses'
				}
			],
			published: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			updated: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			url: 'https://example.com/tool',
			status: 'active',
			openSource: true
		};

		test('should validate correct uses entry', () => {
			const result = UsesEntrySchema.safeParse(validUsesEntry);

			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('uses');
		});

		test('should fail for invalid URL', () => {
			const invalidUsesEntry = {
				...validUsesEntry,
				url: 'not-a-url'
			};

			const result = UsesEntrySchema.safeParse(invalidUsesEntry);

			expect(result.success).toBe(false);
		});
	});

	describe('ShareableSchema', () => {
		const validShareable: Shareable = {
			type: 'shareable',
			slug: 'test-shareable',
			relativePath: '/shareables/test-shareable',
			fullPath: 'https://example.com/shareables/test-shareable',
			title: 'Test Shareable',
			description: 'This is a test shareable description',
			tags: [
				{
					display: 'Article',
					slug: 'article',
					relativePath: '/tags/article',
					count: 1,
					type: 'shareable'
				}
			],
			published: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			updated: {
				raw: new Date('2024-01-01'),
				display: 'January 1, 2024'
			},
			url: 'https://example.com/article',
			comment: 'This is a great article about testing'
		};

		test('should validate correct shareable', () => {
			const result = ShareableSchema.safeParse(validShareable);

			expect(result.success).toBe(true);
			expect(result.data?.type).toBe('shareable');
		});

		test('should not require image field', () => {
			// Shareables omit the image field from BaseEntry
			expect('image' in validShareable).toBe(false);

			const result = ShareableSchema.safeParse(validShareable);

			expect(result.success).toBe(true);
		});

		test('should fail for empty comment', () => {
			const invalidShareable = {
				...validShareable,
				comment: ''
			};

			const result = ShareableSchema.safeParse(invalidShareable);

			expect(result.success).toBe(false);
		});
	});

	describe('getSchemaForType', () => {
		test('should return correct schema for each type', () => {
			expect(getSchemaForType('post')).toBe(PostSchema);
			expect(getSchemaForType('project')).toBe(ProjectSchema);
			expect(getSchemaForType('uses')).toBe(UsesEntrySchema);
			expect(getSchemaForType('shareable')).toBe(ShareableSchema);
		});
	});

	describe('ENTRY_SCHEMAS', () => {
		test('should contain all entry type schemas', () => {
			expect(ENTRY_SCHEMAS.post).toBe(PostSchema);
			expect(ENTRY_SCHEMAS.project).toBe(ProjectSchema);
			expect(ENTRY_SCHEMAS.uses).toBe(UsesEntrySchema);
			expect(ENTRY_SCHEMAS.shareable).toBe(ShareableSchema);
		});
	});
});
