import { expect, test } from 'vitest'
import { sortAlphabetical } from './helper'

test('sortAlphabetical - a to z', async () => {
    expect(sortAlphabetical('a', 'z')).toBe(-1)
    expect(sortAlphabetical('a', 'a')).toBe(0)
    expect(sortAlphabetical('z', 'a')).toBe(1)
})