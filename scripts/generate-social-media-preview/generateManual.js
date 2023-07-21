const { chromium } = require('playwright')
const { getSlug } = require('../../assets/js/getSlug')
const { generateImage } = require('./util.js')

// npm run socialMedia:manual -- --title="TEST"
const manualImageGeneration = async (title) => {
  const slug = getSlug(title)
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await generateImage(page, title, slug)
  console.log('🆕', title)
  await browser.close()
}

;(async () => {
  console.log()
  try {
    const title = process.argv[2].replace('--title=', '')
    await manualImageGeneration(title)
  } catch (error) {
    console.log('Error:', error)
  }
})()
