// provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
export default (list) => {
  let latestEntry = null
  let latestParent = null
  const listCopy = JSON.parse(JSON.stringify(list))
  if (listCopy.length <= 1) return listCopy
  return listCopy.reduce((result, entry) => {
    if (latestEntry && !latestEntry.children) {
      latestEntry.children = []
    }
    if (entry.depth === 2) {
      entry.children = []
      result.push(entry)
      latestParent = null
    } else if (entry.depth === latestEntry.depth + 1) {
      latestEntry.children.push(entry)
      latestParent = latestEntry
    } else if (entry.depth === latestEntry.depth) {
      latestParent.children.push(entry)
    } else {
      console.error('Unexpected')
    }
    latestEntry = entry
    return result
  }, [])
}
