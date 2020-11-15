import global from './global'

const isUndefined = (value) => typeof value === 'undefined'

const title = (meta) =>
  isUndefined(meta)
    ? global.siteTitle
    : `${meta && meta.title} - Luka Harambasic`

export default (meta) => {
  return [
    {
      hid: 'description',
      name: 'description',
      content: (meta && meta.description) || global.siteDesc,
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: (meta && meta.type) || global.siteType,
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: (meta && meta.url) || global.siteUrl,
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: title(meta),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: (meta && meta.description) || global.siteDesc,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: (meta && meta.mainImage) || global.mainImage,
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: (meta && meta.url) || global.siteUrl,
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: title(meta),
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: (meta && meta.description) || global.siteDesc,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: (meta && meta.mainImage) || global.mainImage,
    },
  ]
}
