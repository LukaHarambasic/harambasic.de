import { expect, test } from 'vitest';
import { load } from '../projects/api';

// TODO provide test data
test('TO BE REMOVED', async () => {
    const posts = await load()
    console.log(posts)
    expect(true).toBe(true);
});
