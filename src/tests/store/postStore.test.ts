import { _getPost } from '../../store/postStore';
import { EntryType } from '../../types/enums';
import type { Post } from '../../types/post';
import { getDate } from '../../util/entries';
import { getSlug } from '../../util/helper';
import { expect, test } from 'vitest';

test('getPost - from raw to Post', () => {
	const raw: any = {
		frontmatter: {
			title: 'Quickly copying paths to the terminal on macOS',
			description: 'Quickly copying paths to the terminal on macOS',
			image: 'path/image.png',
			tags: ['Quick Tip', 'macOS', 'Terminal'],
			published: '2020-12-21',
			updated: '2022-12-21',
			tldr: "Select a file in Finder, press <strong>CMD + C</strong>, paste it to the Terminal with <strong>CMD + V</strong>. That's it.",
			discussion: 'https://mstdn.social',
		},
		getHeadings() {
			return [
				{ depth: 2, slug: 'intro', text: 'Intro' },
				{ depth: 2, slug: 'how-to', text: 'How-To' },
			];
		},
		Content: {},
	};
	const generatedPost = _getPost(raw);

	const shouldPost: Post = {
		type: EntryType.Post,
		slug: getSlug('Quickly copying paths to the terminal on macOS'),
		image: 'path/image.png',
		title: 'Quickly copying paths to the terminal on macOS',
		description: 'Quickly copying paths to the terminal on macOS',
		published: getDate('2020-12-21'),
		updated: getDate('2022-12-21'),
		Content: {},
		tags: [
			{
				title: 'Quick Tip',
				slug: 'quick-tip',
				fullPath: '/posts/?tag=quick-tip',
				count: 0,
			},
			{
				title: 'macOS',
				slug: 'macos',
				fullPath: '/posts/?tag=macos',
				count: 0,
			},
			{
				title: 'Terminal',
				slug: 'terminal',
				fullPath: '/posts/?tag=terminal',
				count: 0,
			},
		],
		tldr: "Select a file in Finder, press <strong>CMD + C</strong>, paste it to the Terminal with <strong>CMD + V</strong>. That's it.",
		discussion: 'https://mstdn.social',
		relativePath: '/posts/quickly-copying-paths-to-the-terminal-on-macos',
		fullPath: 'https://harambasic.de/posts/quickly-copying-paths-to-the-terminal-on-macos',
		toc: [
			{ depth: 2, slug: 'intro', text: 'Intro', children: [] },
			{ depth: 2, slug: 'how-to', text: 'How-To', children: [] },
		],
	};
	// Maybe break down to attributes??
	expect(generatedPost).toStrictEqual(shouldPost);
});
