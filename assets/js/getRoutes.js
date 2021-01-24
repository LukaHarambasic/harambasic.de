export default async () => {
  const { $content } = require('@nuxt/content')
  const files = await $content({ deep: true }).only(['path']).fetch()
  // test for e.g. /cv/settings - as they were previously generated
  const regex = new RegExp('\\/cv\\/.+')
  return files
    .map((file) => {
      if (file.path === '/index') return '/'
      return file.path
    })
    .filter((path) => path !== '/home')
    .filter((path) => !regex.test(path))
    .filter((path) => !path.includes('/projects/')) // exclude all projects as they don't have a details page
}
