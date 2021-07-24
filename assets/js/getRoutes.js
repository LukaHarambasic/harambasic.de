import { getCategoriesUniq } from './getCategoriesUniq'

export default async () => {
  const { $content } = require('@nuxt/content')
  const files = await $content({ deep: true })
    .only(['path', 'categories'])
    .fetch()
  const posts = files.filter((post) => post.path.includes('posts'))
  const categories = getCategoriesUniq(posts)
  // test for e.g. /cv/settings - as they were previously generated
  // TODO, needs a little refactoring: https://eslint.org/docs/rules/prefer-regex-literals
  // eslint-disable-next-line prefer-regex-literals
  const regex = new RegExp('\\/cv\\/.+')
  return [...files, ...categories]
    .map((file) => {
      if (file.path === '/index') return '/'
      return file.path
    })
    .filter((path) => path !== '/home')
    .filter((path) => !regex.test(path))
    .filter((path) => !path.includes('/projects/')) // exclude all projects as they don't have a details page
}
