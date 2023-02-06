import fetch from 'node-fetch'
import { load } from 'cheerio'
import { join } from 'path'
import * as fs from 'fs/promises'

async function directoryExists(path) {
    try {
        const stat = await fs.stat(path);
        return stat.isDirectory();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}


async function fetchFavicons(url) {
    const response = await fetch(url)
    const body = await response.text()
    const $ = load(body)
    const favicons = []
    $('link[rel="icon"]').each(async (i, elm) => {
        console.log(elm.attribs.href)
        const href = elm.attribs.href
        const filename = href.split("/").pop()
        const path = href.startsWith(url) ? href : `${url}${elm.attribs.href}`
        const type = elm.attribs.type
        favicons.push({
            filename,
            path,
            type
        })
    })
    return favicons
};

async function saveFavicons(favicons, slug) {
    favicons.forEach(async (favicon) => {
        const dir = join(process.cwd(), 'src', 'lib', 'images', 'favicons', slug)
        const saveTo = join(dir, favicon.filename)
        const dirExists = await directoryExists(dir)
        if (!dirExists) {
            await fs.mkdir(dir)
        }
        const responses = await fetch(favicon.path)
        const blob = await responses.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(saveTo, buffer)
    })
}

export async function main() {
    const sites = [
        {
            slug: "enpass",
            url: "https://www.enpass.io/"
        },
        {
            slug: "figma",
            url: "https://www.figma.com/"
        },
        {
            slug: "webstorm",
            url: "https://www.jetbrains.com/webstorm/"
        },
    ]
    sites.forEach(async (site) => {
        const favicons = await fetchFavicons(site.url)
        await saveFavicons(favicons, site.slug)
    })
}

main()