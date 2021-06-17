import visit from 'unist-util-visit'

module.exports = function rehypePostImage() {
  return function transformer(tree, file) {
    visit(tree, 'element', visitor)
    function visitor(node) {
      if (node.tagName === 'img') {
        console.log(node)
        node.tagName = 'post-image'
        // console.log('rehype:', 'img -> content-img', node.properties.src)
      }
    }
  }
}
