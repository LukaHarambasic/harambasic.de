import { urlStore } from './urlStore.svelte'

export const getCurrentCategory = () => $derived(urlStore.searchParams.get('category'))

export const toggleCategory = (id: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  const currentCategory = getCurrentCategory()

  if (currentCategory === id) {
    searchParams.delete('category')
  } else {
    searchParams.set('category', id)
  }

  const url = new URL(window.location.toString())
  url.search = searchParams.toString()
  window.history.pushState({}, '', url.href)
}
