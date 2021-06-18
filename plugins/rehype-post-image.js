import visit from 'unist-util-visit'

module.exports = function rehypePostImage() {
  return function transformer(tree, file) {
    visit(tree, 'element', visitor)
    function visitor(node) {
      if (node.tagName === 'img') {
        // Gifs have to be rendered as img not post-image
        if (!node.properties.src.endsWith('gif')) {
          node.tagName = 'post-image'
        }
      }
    }
  }
}
