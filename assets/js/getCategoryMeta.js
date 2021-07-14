import getSlug from './getSlug'

export default (categories) => {
  return categories.map((category) => {
    const slug = getSlug(category)
    return {
      title: category,
      slug,
      path: `/categories/${slug}`,
    }
  })
}
