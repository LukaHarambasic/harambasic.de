import { EntryType } from "$lib/types/enums"
import { _getFiles, _getMeta, _getHTML } from "./converter.server"
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { visit } from "unist-util-visit"
import rehypePrism from 'rehype-prism'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

const images: string[] = []

// Just a tmp function until the following bug in vite is fixed and a new sveltekit version is released
// https://github.com/sveltejs/kit/issues/5240
export async function getImages() {
    console.log("getImages")
    // TODO I think I need this also for projects or bookmarks
    const files = await _getFiles(EntryType.Post)
    const entries = await Promise.all(
        files.map(async (file) => {
            const [markdown, meta] = await _getMeta(file)
            await _getImages(markdown)
            // TODO somehow I get an array with all images for every image
            return images[0]
        })
    )
    return entries
}

function rehypeImagePerEntry() {
    // https://stackblitz.com/edit/sveltejs-kit-template-default-7tba4y?file=src%2Froutes%2F%2Bpage.svelte
    // https://vitejs.dev/guide/features.html#glob-import1
    return function transformer(tree: any, file: any) {
        return visit(tree, 'element', visitor)
        function visitor(node: any) {
            if (node.tagName === 'img') {
                images.push(node.properties.src)
            }
        }
    }
}

async function _getImages(markdown: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeImagePerEntry)
        .use(rehypePrism, { plugins: ['line-numbers'] })
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(markdown)
    return result.value as string
}