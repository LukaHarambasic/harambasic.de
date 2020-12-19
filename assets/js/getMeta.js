import global from './global'

// string constructors
const title = (title) => `${title} - Luka Harambasic`

const url = (url) => `${global.baseURL}${url}`

// helper
const inputOrGlobal = (input, global) =>
  input === '' || typeof input === 'undefined' ? global : input

export default (meta) => {
  if (!meta) return []
  return [
    {
      hid: 'description',
      name: 'description',
      content: inputOrGlobal(meta.description, global.desc),
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: inputOrGlobal(meta.type, global.type),
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: inputOrGlobal(url(meta.url), global.baseURL),
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: inputOrGlobal(title(meta.title), global.title),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: inputOrGlobal(meta.description, global.desc),
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: inputOrGlobal(meta.img, global.img),
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: inputOrGlobal(url(meta.url), global.baseURL),
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: inputOrGlobal(title(meta.title), global.title),
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: inputOrGlobal(meta.description, global.desc),
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: inputOrGlobal(meta.img, global.img),
    },
  ]
}
