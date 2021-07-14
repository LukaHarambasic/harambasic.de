// https://stackoverflow.com/a/48783927/5438990
const uniqify = (array, key) =>
  array.reduce((acc, curr) => {
    const isObjectAlreadyIn = acc.find((a) => a[key] === curr[key])
    return isObjectAlreadyIn ? acc : acc.push(curr) && acc
  }, [])

export default (posts) => {
  const notUniqCategories = posts.map((post) => post.categories).flat()
  return uniqify(notUniqCategories, 'slug').sort((a, b) => {
    if (a.slug > b.slug) return 1
    if (b.slug > a.slug) return -1
    return 0
  })
}
