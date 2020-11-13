export default async () => {
  const { $content } = require('@nuxt/content')
  const files = await $content({ deep: true }).only(['path']).fetch()
  return files
    .map((file) => (file.path === '/index' ? '/' : file.path))
    .filter((file) => !file.path.includes('/projects/')) // exclude all projects as they don't have a details page
}
