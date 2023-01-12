import { EntryType } from '$lib/types/enums';
import { getRawEntries } from '$lib/util/converter';
import { expect, test } from 'vitest';

// TODO provide test data
test('getFiles - retrieve raw content', async () => {
	const entries = await getRawEntries(EntryType.Project);
	expect(true).toBe(true);
});

// test('getMarkdown - TODO', async () => {
//     const file = '---\n' +
//         'title: Active Ambassadors\n' +
//         'image: ./src/assets/images/projects/active-ambassadors.png\n' +
//         'description: TODO Lorem Ipsum\n' +
//         'published: 2020-12-21\n' +
//         'updated: 2020-12-21\n' +
//         'prio: 90\n' +
//         'status: INACTIVE\n' +
//         'links:\n' +
//         '  - display: Website\n' +
//         '    href: https://active-ambassadors.org/\n' +
//         '  - display: Instagram\n' +
//         '    href: https://www.instagram.com/active_ambassadors/\n' +
//         '  - display: LinkedIn\n' +
//         '    href: https://www.linkedin.com/company/active-ambassadors\n' +
//         'tags:\n' +
//         '  - Co-Founder\n' +
//         '  - Design\n' +
//         '  - Website\n' +
//         '  - Process Automation\n' +
//         '---\n' +
//         '\n' +
//         'A friend of mine thought that we could do something good with our skills whilst raising awarness for NGOs. I set up our work environment: [Slack](https://slack.com/intl/en-de/), [Google Drive](https://www.google.com/intl/en_in/drive/), [Google Meet](https://meet.google.com/), Website ([Nuxt.js](https://nuxtjs.org/), [Prismic](https://prismic.io/), [Netlify](https://www.netlify.com/)), [Airtable](https://airtable.com/), [Mailchimp](https://mailchimp.com/), and [IFTTT](https://ifttt.com/). Currently, we are shifting our knowledge and task management towards [Notion](https://www.notion.so/).'
//     console.log(await getMarkdown(file))
//     expect(true).toBe(true);
// });
