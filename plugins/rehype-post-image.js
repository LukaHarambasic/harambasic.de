import visit from 'unist-util-visit'

module.exports = function rehypePostImage() {
  return function transformer(tree, file) {
    visit(tree, 'element', visitor)
    function visitor(node) {
      if (node.tagName === 'img') {
        node.tagName = 'post-image'
      }
    }
  }
}
