export default async () => {
  const { $content } = require('@nuxt/content')
  const files = await $content({ deep: true }).only(['path']).fetch()
  return files
    .map((file) => {
      if (file.path === '/home') return
      if (file.path === '/index') return '/'
      return file.path
    })
    .filter((path) => path !== undefined)
    .filter((path) => !path.includes('/projects/')) // exclude all projects as they don't have a details page
}