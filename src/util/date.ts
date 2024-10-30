export function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd')
}
