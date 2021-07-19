import { getSlug } from '@/assets/js/getSlug'

describe('getSlug', () => {
  test('Titles are converted to slugs', () => {
    const data = [
      {
        title: 'Nuxt.js',
        slug: 'nuxtjs',
      },
      {
        title: 'Lorem Ipsum',
        slug: 'lorem-ipsum',
      },
      {
        title: '1234567',
        slug: '1234567',
      },
      {
        title: 'How to be 10 times more productive!',
        slug: 'how-to-be-10-times-more-productive',
      },
      {
        title: '3 3 6 $ 4 1 ?= !',
        slug: '3-3-6-4-1-',
      },
      {
        title: '#important post with hashtags! ',
        slug: 'important-post-with-hashtags',
      },
      {
        title: ' starts and ends with space ',
        slug: 'starts-and-ends-with-space',
      },
    ]
    data.forEach((item) => {
      expect(getSlug(item.title)).toEqual(item.slug)
    })
  })
})
