import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import readline from 'readline'
// import { getSlug } from '../../src/lib/util/helper'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const ROOT_PATH = process.cwd()
const TEMPLATE_PATH = `${ROOT_PATH}/scripts/generate-post/template.md`
const POSTS_PATH = `${ROOT_PATH}/src/content/posts`
const IMAGES_PATH = `${ROOT_PATH}/static/posts`

const generatePost = (title) => {
    const template = readFileSync(TEMPLATE_PATH, 'utf8')
    const slug = getSlug(title)
    const post = template.replace('<<TITLE>>', title)
    const FILE_PATH = `${POSTS_PATH}/${slug}.md`
    writeFileSync(FILE_PATH, post)
    const FOLDER_PATH = `${IMAGES_PATH}/${slug}`
    mkdirSync(FOLDER_PATH)
    console.log('The post was successfully generated:', title)
}

;(() => {
    console.log('Creating new post...')
    try {
        rl.question('Post title: ', (title) => {
            generatePost(title)
            rl.close()
        })
        rl.on('close', () => {
            process.exit(0)
        })
    } catch (error) {
        console.log('Error:', error)
    }
})()

// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
export function getSlug(str) {
    if (!str) return ''
    const slug = str
        .trim()
        .toLowerCase()
        // remove all chars which aren't characters, numbers or spaces
        .replace(/[^a-zA-Z0-9\s]+/g, '')
        // replace all spaces with dashes
        .replace(/\s+/g, '-')
    return slug
}
