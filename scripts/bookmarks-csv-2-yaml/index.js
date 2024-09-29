import { join } from 'path';
import * as fs from 'fs/promises';

function getSlug(str) {
	if (!str) return '';
	const slug = str
		.trim()
		.toLowerCase()
		// remove all chars which aren't characters, numbers or spaces
		.replace(/[^a-zA-Z0-9\s]+/g, '')
		// replace all spaces with dashes
		.replace(/\s+/g, '-');
	return slug;
}

export async function main() {
	const saveTo = join(process.cwd(), 'src', 'content', 'bookmarks');
	const csv = await fs.readFile(
		join(process.cwd(), 'scripts', 'bookmarksCSV2YAML', 'table.csv'),
		'utf8'
	);
	const lines = csv.split('\n');
	console.log(lines.length);
	lines.forEach((line) => {
		const [title, tag, description, url, status, image, openSource, updated, published] =
			line.split(';');
		console.log(title, tag, description, url, status, image, openSource, updated, published);
		const content = `---
title: ${title}
description: "${description}"
tags: 
  - ${tag}
url: ${url}
status: ${status}
image: ${image}
openSource: ${openSource}
updated: ${updated}
published: ${published}
---
`;
		fs.writeFile(join(saveTo, `${getSlug(title)}.md`), content, 'utf8');
	});
}

main();
