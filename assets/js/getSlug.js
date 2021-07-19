// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
const getSlug = (str) => {
  return (
    str
      .trim()
      .toLowerCase()
      // remove all chars which aren't characters, numbers or spaces
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      // replace all spaces with dashes
      .replace(/\s+/g, '-')
  )
}

module.exports = {
  getSlug,
}
