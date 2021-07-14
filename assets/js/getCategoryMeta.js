export default (categories) => {
  return categories.map((category) => {
    const slug = category.replaceAll(' ', '-').toLowerCase()
    return {
      title: category,
      slug,
      path: `/categories/${slug}`,
    }
  })
}
