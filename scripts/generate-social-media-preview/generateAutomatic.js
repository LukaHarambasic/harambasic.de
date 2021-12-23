const { readdirSync, readFileSync } = require('fs')
const fm = require('front-matter')
const yaml = require('js-yaml')
const { chromium } = require('playwright')
const { getCategoriesUniq } = require('../../assets/js/getCategoriesUniq')
const { getCategoryMeta } = require('../../assets/js/getCategoryMeta.js')
const {
  doesImageAlreadyExist,
  generateImage,
  fileToMeta,
  ROOT_PATH,
} = require('./util.js')

const POSTS_PATH = `${ROOT_PATH}/content/posts`
const LISTS_PATH = `${ROOT_PATH}/content/lists`

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
    const data = readFileSync(file.path, 'utf8')
    const content = file.type === 'md' ? fm(data) : yaml.load(data)
    const title = file.type === 'md' ? content.attributes.title : content.title
    if (!doesImageAlreadyExist(file.slug)) {
      console.log('🆕 Post/List:', title)
      await generateImage(page, title, file.slug)
    } else {
      console.log('🛑 Post/List:', title)
    }
  }
  // Categories aren't stored in files so they need a special treatment
  const rawCategories = posts.map((post) => {
    const data = readFileSync(post.path, 'utf8')
    const content = fm(data)
    return {
      ...content.attributes,
      categories: getCategoryMeta(content.attributes.categories),
    }
  })
  const categories = getCategoriesUniq(rawCategories)
  for (const category of categories) {
    if (!doesImageAlreadyExist(category.slug)) {
      console.log('🆕 Category:', category.title)
      await generateImage(page, category.title, category.slug)
    } else {
      console.log('🛑 Category:', category.title)
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
