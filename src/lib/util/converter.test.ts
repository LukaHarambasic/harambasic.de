import { _getHTML } from '$lib/util/converter.server'
import { expect, test } from 'vitest'

// // TODO provide test data
// test('getFiles - retrieve raw content', async () => {
//   const entries = await getRawEntries(EntryType.Project)
//   expect(true).toBe(true)
// })

test('getHTML - TODO', async () => {
  const markdown =
    'A friend of mine thought that we could do something good with our skills whilst raising awarness for NGOs. I set up our work environment: [Slack](https://slack.com/intl/en-de/), [Google Drive](https://www.google.com/intl/en_in/drive/), [Google Meet](https://meet.google.com/), Website ([Nuxt.js](https://nuxtjs.org/), [Prismic](https://prismic.io/), [Netlify](https://www.netlify.com/)), [Airtable](https://airtable.com/), [Mailchimp](https://mailchimp.com/), and [IFTTT](https://ifttt.com/). Currently, we are shifting our knowledge and task management towards [Notion](https://www.notion.so/).'
  const html =
    '<p>A friend of mine thought that we could do something good with our skills whilst raising awarness for NGOs. I set up our work environment: <a href="https://slack.com/intl/en-de/">Slack</a>, <a href="https://www.google.com/intl/en_in/drive/">Google Drive</a>, <a href="https://meet.google.com/">Google Meet</a>, Website (<a href="https://nuxtjs.org/">Nuxt.js</a>, <a href="https://prismic.io/">Prismic</a>, <a href="https://www.netlify.com/">Netlify</a>), <a href="https://airtable.com/">Airtable</a>, <a href="https://mailchimp.com/">Mailchimp</a>, and <a href="https://ifttt.com/">IFTTT</a>. Currently, we are shifting our knowledge and task management towards <a href="https://www.notion.so/">Notion</a>.</p>' +
    '\n'
  expect(await _getHTML(markdown)).toBe(html)
})
