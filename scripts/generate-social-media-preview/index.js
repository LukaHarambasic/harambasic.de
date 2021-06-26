const path = require('path')
const { readdirSync, readFileSync } = require('fs')
const { chromium } = require('playwright')

const SOCIAL_PATH = `${process.cwd()}/static/social`
const POSTS_PATH = `${process.cwd()}/content/posts`

const generateSocialMediaPreview = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const posts = readdirSync(POSTS_PATH)
  for (const file of posts) {
    const FILE_PATH = `${POSTS_PATH}/${file}`
    const slug = file.replace('.md', '')
    const content = readFileSync(FILE_PATH, 'utf8')
    const title = _getTitle(content)
    if (!_doesImageAlreadyExist(slug)) {
      console.log('Generate social media preview for:', title)
      await _generateImage(page, title, slug)
    } else {
      console.log('Social media preview already exists:', title)
    }
  }
  await browser.close()
}

/*
 * Helper functions
 */

const _doesImageAlreadyExist = (slug) => {
  const files = readdirSync(SOCIAL_PATH)
  return files.find((file) => file.startsWith(slug))
}

const _generateImage = async (page, title, slug) => {
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

const _getTitle = (str) => {
  const start = 'title: '
  const end = '\ndescription: '
  return str.substring(
    str.lastIndexOf(start) + start.length,
    str.lastIndexOf(end)
  )
}

/*
 * Execute
 */

;(async () => {
  try {
    await generateSocialMediaPreview()
  } catch (error) {
    console.log('Error:', error)
  }
})()
