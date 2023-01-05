import { EntryType } from '$lib/types/enums';
import { join } from 'path';
import * as fs from 'fs/promises';
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
// import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter';

export async function getEntries(entryType: EntryType): Promise<string[]> {
    const folderPath = join(process.cwd(), 'src', 'content', `${entryType.toLowerCase()}s`);
    const fileNames = await fs.readdir(folderPath);
    return await Promise.all(
        fileNames.map(async (fileName) => {
            const filePath = join(folderPath, fileName);
            const file: string = await fs.readFile(filePath, 'utf8');
            return getMarkdown(file)
        })
    );
}

// TODO type: satisfies entry?
async function getMarkdown(raw: string): Promise<string> {
    const result = await unified()
        .use(remarkFrontmatter, ['yaml'])
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(raw)
    return result.toString()
}

// import fs from 'fs';
// import { unified } from 'unified'
// import markdown from 'remark-parse';
// import frontmatter from 'remark-frontmatter';
// import remark2rehype from 'remark-rehype';
// import rehype2html from 'rehype-stringify';
//         .use(markdown)
//     .use(frontmatter)
//     .use(remark2rehype)
//     .use(rehype2html)
