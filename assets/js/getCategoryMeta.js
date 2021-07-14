export default (categories) => {
  console.log('---------')
  return categories.map((category) => {
    console.log(category)
    const slug = category.replaceAll(' ', '-').toLowerCase()
    console.log(slug)
    return {
      title: category,
      slug,
      path: `/categories/${slug}`,
    }
  })
}
