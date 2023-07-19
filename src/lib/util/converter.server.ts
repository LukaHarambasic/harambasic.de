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
  const folderName = entryType.toLowerCase() === 'stack' ? `${entryType.toLowerCase()}s` : 'stack'
  const folderPath = join(process.cwd(), 'src', 'content', folderName)
  const fileNames = await fs.readdir(folderPath)
  return await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = join(folderPath, fileName)
      return await fs.readFile(filePath, 'utf8')
    })
  )
}

import { visit } from 'unist-util-visit'

type ImageOptions = {
  modules: Record<string, string>
}

function rehypePostImage(options?: ImageOptions | undefined) {
  // https://stackblitz.com/edit/sveltejs-kit-template-default-7tba4y?file=src%2Froutes%2F%2Bpage.svelte
  // https://vitejs.dev/guide/features.html#glob-import1
  const modules = options?.modules || []
  return function transformer(tree: any, file: any) {
    return visit(tree, 'element', visitor)
    function visitor(node: any) {
      if (node.tagName === 'img') {
        const srcAttribute = node.properties.src
        node.properties.src = modules[`/src/lib/images${srcAttribute}`]
      }
    }
  }
}

export async function _getHTML(markdown: string): Promise<string> {
  const modules = import.meta.glob('$lib/images/**/*.{png,jpg,jpeg,gif,svg}', { eager: true, import: 'default' })
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePostImage, { modules })
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
