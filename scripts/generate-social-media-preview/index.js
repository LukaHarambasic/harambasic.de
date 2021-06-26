const path = require('path')
const fs = require('fs')
const { readdir, readFile } = fs.promises
const { chromium } = require('playwright')

const SOCIAL_PATH = `../../static/social`
const POSTS_PATH = `../../content/posts`

const generateSocialMediaPreview = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const posts = await readdir(POSTS_PATH)
  for (const file of posts) {
    const FILE_PATH = `${POSTS_PATH}/${file}`
    const slug = file.replace('.md', '')
    const content = await readFile(FILE_PATH, 'utf8')
    const title = getTitle(content)
    if (!doesImageAlreadyExist(slug)) {
      console.log('Generate social media preview for:', title)
      await generateImage(page, title, slug)
    } else {
      console.log('Image does already exist:', title)
    }
  }
  await browser.close()
  return true
}

const doesImageAlreadyExist = (slug) => {
  const files = fs.readdirSync(SOCIAL_PATH)
  return files.find((file) => file.startsWith(slug))
}

const generateImage = async (page, title, slug) => {
  const URL = `file:///${path.join(__dirname, '/template.html')}`
  const SCREENSHOT_PATH = `${SOCIAL_PATH}/${slug}.png`
  await page.goto(URL)
  // strange syntax, check https://playwright.dev/docs/api/class-page#page-eval-on-selector for more infos
  await page.$eval('.title', (el, title) => (el.textContent = title), title)
  const cardHandle = await page.$('.card')
  await cardHandle.screenshot({
    type: 'png',
    path: SCREENSHOT_PATH,
  })
}

const getTitle = (str) => {
  const start = 'title: '
  const end = '\ndescription: '
  return str.substring(
    str.lastIndexOf(start) + start.length,
    str.lastIndexOf(end)
  )
}

generateSocialMediaPreview().then((r) =>
  console.log('Generate social media preview has finished:', r)
)
