const { chromium } = require('playwright')
// TODO const { generateImage } = require('./util.js')

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