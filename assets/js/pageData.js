import { getSlug } from './getSlug'
import global from './globals'

export const generatePageData = (title, description, type) => {
  if (title && title.length > 60) {
    console.warn(
      `getMeta - title shouldn't be longer than 60 chars for seo, has ${title.length}: ${title}`
    )
  }
  const completeTitle =
    title === '' || typeof title === 'undefined'
      ? global.title
      : `${title} - ${global.title}`
  const url = title ? `${global.baseURL}/${getSlug(title)}` : global.baseURL
  const socialImageUrl = title
    ? `${global.baseURL}/${global.socialFolder}/${getSlug(title)}.png`
    : `${global.baseURL}/${global.socialFolder}/${global.img}`
  return {
    title: completeTitle,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: description ?? global.desc,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: type ?? global.type,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: url ?? global.baseURL,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: completeTitle ?? global.title,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: description ?? global.desc,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: socialImageUrl ?? global.img,
      },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: url ?? global.baseURL,
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: completeTitle ?? global.title,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: description ?? global.desc,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: socialImageUrl ?? global.img,
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        content: completeTitle ?? global.title,
      },
    ],
  }
}
