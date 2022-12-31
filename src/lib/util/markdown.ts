import type { EntryType } from '$lib/types/enums';
import { join } from 'path';
import * as fs from 'fs/promises';
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter';

export async function getEntries(entryType: EntryType): Promise<string[]> {
    const folderPath = join(process.cwd(), 'src', 'content', `${entryType.toLowerCase()}s`);
    const fileNames = await fs.readdir(folderPath);
    return await Promise.all(
        fileNames.map(async (fileName) => {
            const filePath = join(folderPath, fileName);
            return await fs.readFile(filePath, { encoding: 'utf8' });
        })
    );
}

// TODO type: satisfies entry?
export async function getMarkdown(raw: string) {
    return await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(remarkFrontmatter)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(raw)
}
