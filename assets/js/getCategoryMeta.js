// needs to be required as it is also used in a plan node script
const { getSlug } = require('./getSlug.js')

const getCategoryMeta = (categories) => {
  return categories.map((category) => {
    const slug = getSlug(category)
    return {
      title: category,
      slug,
      path: `/categories/${slug}`,
    }
  })
}

module.exports = { getCategoryMeta }
