import { readable } from 'svelte/store'

export function createSearchParamsStore() {
  return readable(new URLSearchParams(window.location.search), (set) => {
    const update = () => set(new URLSearchParams(window.location.search))

    window.addEventListener('popstate', update)

    const originalPushState = history.pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      update()
    }

    const originalReplaceState = history.replaceState
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      update()
    }

    return () => {
      window.removeEventListener('popstate', update)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  })
}
