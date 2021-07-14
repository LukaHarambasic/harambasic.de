// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
const getSlug = (str) => {
  return str.replace(/\s+/g, '-').toLowerCase()
}

module.exports = {
  getSlug,
}
