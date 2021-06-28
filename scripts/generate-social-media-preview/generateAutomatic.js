const { readdirSync, readFileSync } = require('fs')
const { chromium } = require('playwright')
const {
  doesImageAlreadyExist,
  generateImage,
  getTitle,
  fileToMeta,
  POSTS_PATH,
  LISTS_PATH,
} = require('./util.js')

const generateSocialMediaPreview = async () => {
  console.log('>> GENERATE SOCIAL MEDIA PREVIEWS <<')
  console.log('🆕 newly generated, 🛑 already exists')
  console.log('-------------------------------------')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const posts = readdirSync(POSTS_PATH).map((name) =>
    fileToMeta(name, POSTS_PATH)
  )
  const lists = readdirSync(LISTS_PATH).map((name) =>
    fileToMeta(name, LISTS_PATH)
  )
  const files = [...posts, ...lists]
  for (const file of files) {
    const content = readFileSync(file.path, 'utf8')
    const title = getTitle(content)
    if (!doesImageAlreadyExist(file.slug)) {
      console.log('🆕', title)
      await generateImage(page, title, file.slug)
    } else {
      console.log('🛑', title)
    }
  }
  await browser.close()
}

;(async () => {
  try {
    await generateSocialMediaPreview()
  } catch (error) {
    console.log('Error:', error)
  }
})()
