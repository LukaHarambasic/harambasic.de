import { urlStore } from './urlStore.svelte'

export const getCurrentTag = () => $derived(urlStore.searchParams.get('tag'))

export const toggleTag = (id: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  const currentTag = getCurrentTag()

  if (currentTag === id) {
    searchParams.delete('tag')
  } else {
    searchParams.set('tag', id)
  }

  const url = new URL(window.location.toString())
  url.search = searchParams.toString()
  window.history.pushState({}, '', url.href)
}
