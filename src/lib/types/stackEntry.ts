import type { Entry } from './entry'
import { StackEntryStatus } from './enums'

export interface StackEntry extends Entry {
  url: string
  status: StackEntryStatus
  openSource: boolean
}
