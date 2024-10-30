export function enumToArray(
  rawEnum: SortDirection | StatusFilter | SortProperty
): { display: string; key: string }[] {
  return Object.keys(rawEnum).map((key) => {
    return {
      display: key,
      key: rawEnum[key],
    }
  })
}
