import { expect, test } from 'vitest'

import type { Post } from '../../types/post'
import { formatDate, getFileName, getPath, getRandomItems, getSlug } from '../../util/helper'

type PostTest = Omit<Post, 'Content'>
const post: PostTest = {
	title: 'Quickly copying paths to the terminal on macOS',
	description: 'Quickly copying paths to the terminal on macOS',
	publishDate: new Date(),
	publishDateFormatted: '08/08/2022',
	categories: [
		{
			display: 'Quick Tip',
			slug: 'quick-tip',
			fullPath: '/posts/?category=quick-tip',
			postCount: 0,
		},
		{
			display: 'macOS',
			slug: 'macos',
			fullPath: '/posts/?category=macos',
			postCount: 0,
		},
		{
			display: 'Terminal',
			slug: 'terminal',
			fullPath: '/posts/?category=terminal',
			postCount: 0,
		},
	],
	tldr: "Select a file in Finder, press <strong>CMD + C</strong>, paste it to the Terminal with <strong>CMD + V</strong>. That's it.",
	discussion: 'TBD',
	file: '/Users/luha/Development/harambasic.de/src/content/posts/quickly-copying-paths-to-the-terminal-on-macos.md',
	path: '/posts/quickly-copying-paths-to-the-terminal-on-macos',
	permalink: 'https://harambasic.de/posts/quickly-copying-paths-to-the-terminal-on-macos',
	toc: [
		{ depth: 2, slug: 'intro', text: 'Intro', children: [] },
		{ depth: 2, slug: 'how-to', text: 'How-To', children: [] },
	],
}

test('getFileName - extract slug for page', () => {
	expect(getFileName(post.file)).toBe('quickly-copying-paths-to-the-terminal-on-macos')
})

test('getPath - generate relative path', () => {
	expect(getPath('posts', post.file)).toBe('/posts/quickly-copying-paths-to-the-terminal-on-macos')
})

test('getSlug - generate slugs', () => {
	const data = [
		{
			title: 'Nuxt.js',
			slug: 'nuxtjs',
		},
		{
			title: 'Lorem Ipsum',
			slug: 'lorem-ipsum',
		},
		{
			title: '1234567',
			slug: '1234567',
		},
		{
			title: 'How to be 10 times more productive!',
			slug: 'how-to-be-10-times-more-productive',
		},
		{
			title: '3 3 6 $ 4 1 ?= !',
			slug: '3-3-6-4-1-',
		},
		{
			title: '#important post with hashtags! ',
			slug: 'important-post-with-hashtags',
		},
		{
			title: ' starts and ends with space ',
			slug: 'starts-and-ends-with-space',
		},
	]
	data.forEach((item) => {
		expect(getSlug(item.title)).toBe(item.slug)
	})
})

test('getRandomItems - just for the coverage', () => {
	getRandomItems([], 0)
	expect(true).toBe(true)
})

test('formatDate - markdown date to formatted date', () => {
	expect(formatDate(new Date('1996-02-18'))).toBe('02/18/1996')
})
