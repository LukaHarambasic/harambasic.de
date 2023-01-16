import type { EntryType } from '$lib/types/enums'
import { join } from 'path'
import * as fs from 'fs/promises'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'


// TODO still needs to be transformed to the corresponding Entry types
export async function getRawEntries(entryType: EntryType): Promise<any[]> {
  const files = await _getFiles(entryType)
  const entries = await Promise.all(
    files.map(async (file) => {
      const [markdown, meta] = await _getMeta(file)
      const html = await _getHTML(markdown)
      return { html, meta }
    })
  )
  return entries
}

export async function _getFiles(entryType: EntryType): Promise<string[]> {
  const folderPath = join(process.cwd(), 'src', 'content', `${entryType.toLowerCase()}s`)
  const fileNames = await fs.readdir(folderPath)
  return await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = join(folderPath, fileName)
      return await fs.readFile(filePath, 'utf8')
    })
  )
}

export async function _getHTML(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrism, { plugins: ['line-numbers'] })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown)
  //TODO type html?
  return result.value as string
}

export async function _getMeta(frontmatter: string): Promise<[string, object]> {
  const { content, data } = await matter(frontmatter)
  return [content, data]
}
