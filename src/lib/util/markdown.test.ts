import { EntryType } from '$lib/types/enums';
import { getEntries } from '$lib/util/markdown';
import { expect, test } from 'vitest';

// TODO provide test data
test('getFiles - retrieve raw content', async () => {
    const entries = await getEntries(EntryType.Project)
    console.log(entries.length)
    console.log(entries[0])
    expect(true).toBe(true);
});

test('getMarkdown - TODO', async () => {
    const file = ''
    expect(true).toBe(true);
});