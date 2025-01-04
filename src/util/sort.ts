export function sortAlphabetical(a: string, b: string): number {
  return a.localeCompare(b)
}

export function sortDate(a: Date, b: Date): number {
  return new Date(b).valueOf() - new Date(a).valueOf()
}

export function sortNumber(a: number, b: number): number {
  return b - a
}
