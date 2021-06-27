import global from './globals'

// string constructors
const title = (title) => `${title} - Luka Harambasic`

const url = (url) => `${global.baseURL}${url}`

// helper
const parameterOrGlobal = (parameter, global) =>
  parameter === '' || typeof parameter === 'undefined' ? global : parameter

export default (meta) => {
  if (!meta) return []
  if (meta.title && meta.title.length > 60) {
    throw new Error(
      `getMeta - title shouldn't be longer than 60 chars for seo, has ${meta.title.length}: ${meta.title}`
    )
  }
  return [
    {
      hid: 'description',
      name: 'description',
      content: parameterOrGlobal(meta.description, global.desc),
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: parameterOrGlobal(meta.type, global.type),
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: parameterOrGlobal(url(meta.url), global.baseURL),
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: parameterOrGlobal(title(meta.title), global.title),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: parameterOrGlobal(meta.description, global.desc),
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${global.baseURL}${parameterOrGlobal(meta.img, global.img)}`,
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: parameterOrGlobal(url(meta.url), global.baseURL),
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: parameterOrGlobal(title(meta.title), global.title),
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: parameterOrGlobal(meta.description, global.desc),
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: `${global.baseURL}${parameterOrGlobal(meta.img, global.img)}`,
    },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: parameterOrGlobal(meta.imgAlt, global.imgAlt),
    },
  ]
}
