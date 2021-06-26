const path = require('path')
const { chromium } = require('playwright')

const generateSocialMediaPreview = async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 })
  const page = await browser.newPage()
  const URL = `file:///${path.join(__dirname, '/template.html')}`
  await page.goto(URL)
  const cardHandle = await page.$('.card')
  await cardHandle.screenshot({ type: 'png', path: 'screenshot.png' })
  await browser.close()
}

generateSocialMediaPreview().then((r) => console.log('done'))
