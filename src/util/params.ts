export function setParam(key: string, value: string) {
  const url = new URL(window.location.toString())
  url.searchParams.set(key, value)
  window.history.pushState({}, '', url.href)
}

export function resetParams() {
  const url = new URL(window.location.toString())
  window.history.pushState({}, '', `${url.origin}${url.pathname}`)
}
