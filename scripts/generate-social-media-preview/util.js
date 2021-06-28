/*
 * https://medium.com/@Sergeon/using-javascript-in-your-git-hooks-f0ce09477334
 * https://dev.to/krzysztofkaczy9/do-you-really-need-husky-247b
 * https://dev.to/krzysztofkaczy9/do-you-really-need-husky-247b
 * https://faun.pub/why-using-pre-push-git-hooks-with-husky-is-not-always-a-good-idea-6233b8afcf83
 * https://medium.com/@satya164/improving-nodejs-workflow-with-git-hooks-40996830619f
 * https://stackoverflow.com/questions/48301280/how-to-manually-run-a-git-pre-commit-hook-without-attempting-a-commit
 */

const path = require('path')
const { readdirSync } = require('fs')

const ROOT_PATH = process.cwd()
const SOCIAL_PATH = `${ROOT_PATH}/static/social`
const POSTS_PATH = `${ROOT_PATH}/content/posts`
const LISTS_PATH = `${ROOT_PATH}/content/lists`

const doesImageAlreadyExist = (slug) => {
  const files = readdirSync(SOCIAL_PATH)
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
  return str.substring(str.indexOf(start) + start.length, str.indexOf(end))
}

const fileToMeta = (name, basePath) => {
  return {
    name,
    path: `${basePath}/${name}`,
    slug: name.split('.')[0],
  }
}

module.exports = {
  SOCIAL_PATH,
  POSTS_PATH,
  LISTS_PATH,
  doesImageAlreadyExist,
  generateImage,
  getTitle,
  fileToMeta,
}
