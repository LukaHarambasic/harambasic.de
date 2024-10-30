// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
export function getSlug(str: string) {
  if (!str) return ''
  const slug = str
    .trim()
    .toLowerCase()
    // remove all chars which aren't characters, numbers or spaces
    .replace(/[^a-zA-Z0-9\s]+/g, '')
    // replace all spaces with dashes
    .replace(/\s+/g, '-')
  return slug
}
