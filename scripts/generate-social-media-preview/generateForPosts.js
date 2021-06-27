const { readdirSync, readFileSync } = require('fs')
const { chromium } = require('playwright')
const {
  doesImageAlreadyExist,
  generateImage,
  getTitle,
  POSTS_PATH,
} = require('./util.js')

const generateSocialMediaPreview = async () => {
  console.log('>> GENERATE SOCIAL MEDIA PREVIEWS <<')
  console.log('🆕 newly generated, 🛑 already exists')
  console.log('-------------------------------------')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const posts = readdirSync(POSTS_PATH)
  for (const file of posts) {
    const FILE_PATH = `${POSTS_PATH}/${file}`
    const slug = file.replace('.md', '')
    const content = readFileSync(FILE_PATH, 'utf8')
    const title = getTitle(content)
    if (!doesImageAlreadyExist(slug)) {
      console.log('🆕', title)
      await generateImage(page, title, slug)
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
