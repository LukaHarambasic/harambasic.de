import type { EntryType } from '$lib/types/enums'
import { join } from 'path'
import * as fs from 'fs/promises'
import {remark} from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const processor = remark()
  .use(remarkFrontmatter)
  .use(remarkParseFrontmatter)
  .use(remarkRehype)
  .use(rehypeStringify)
  .freeze();

// TODO still needs to be transformed to the corresponding Entry types
export async function getRawEntries(entryType: EntryType): Promise<any[]> {
  const files = await _getFiles(entryType)
  const entries = await Promise.all(
    files.map(async (file) => {
      const output = processor.processSync(file)
      return { html: output.value, meta: output.data.frontmatter }
    })
  )
  return entries
}

export async function _getFiles(entryType: EntryType): Promise<string[]> {
  const folderName = entryType.toLowerCase() === 'stack_entry' ? 'stack' : `${entryType.toLowerCase()}s`
  const folderPath = join(process.cwd(), 'src', 'content', folderName)
  const fileNames = await fs.readdir(folderPath)
  return await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = join(folderPath, fileName)
      return await fs.readFile(filePath, 'utf8')
    })
  )
}