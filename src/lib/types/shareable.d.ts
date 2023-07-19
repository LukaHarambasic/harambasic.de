import type { Entry } from './entry'

export interface Shareable extends Omit<Entry, 'image'> {
  url: string
  comment: string
}
