import type { SortProperty, StatusFilter } from '$lib/types/entry'
import type { SortDirection } from '$lib/types/enums'
import { format } from 'date-fns'

// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
// TODO replace with magic regex
export function getSlug(str: string) {
  if (!str) return ''
  const slug = str
    .trim()
    .toLowerCase()
    // remove all chars which aren't characters, numbers or spaces
    .replace(/[^a-zA-Z0-9\s]+/g, '')
    // replace all spaces with dashes
    .replace(/\s+/g, '-')
  return slug
}

// Won't be tested
// TODO items should be gneric not any and the output should be the same type as the input
export function getRandomItems(items: any[], amount: number) {
  return items.sort(() => 0.5 - Math.random()).slice(0, amount)
}

export function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd')
}

export function sortAlphabetical(a: string, b: string): number {
  return a.localeCompare(b)
}

export function sortDate(a: Date, b: Date): number {
  return new Date(b).valueOf() - new Date(a).valueOf()
}

export function sortNumber(a: number, b: number): number {
  return b - a
}

export function enumToArray(rawEnum: SortDirection | StatusFilter | SortProperty): { display: string, key: string }[] {
  return Object.keys(rawEnum).map((key) => {
    return {
      display: key,
      key: rawEnum[key]
    }
  })
}

export function setParam(key: string, value: string) {
  const url = new URL(window.location.toString())
  url.searchParams.set(key, value)
  window.history.pushState({}, '', url.href)
}