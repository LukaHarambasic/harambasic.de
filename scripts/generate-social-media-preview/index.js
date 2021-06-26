const path = require('path')
const fs = require('fs')
const { chromium } = require('playwright')
const { $content } = require('@nuxt/content')

const SOCIAL_PATH = `../../static/social`

const generateSocialMediaPreview = async (title, slug) => {
  console.log('Generate social media preview for: ', title)
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const content = await $content({ deep: true }).only(['path']).fetch()
  const posts = content.filter((path) => path.includes('/posts/'))
  for (const post of posts) {
    console.log(post)
    if (!doesImageAlreadyExist(slug)) {
      await generateImage(page, title, slug)
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

generateSocialMediaPreview('Lorem Ipsum 2', 'lorem_ipsum_2').then((r) =>
  console.log(r)
)
