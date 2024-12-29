export default class UrlStore {
  private key: string = '';
  searchParams = $state(new URLSearchParams(window.location.search));
  searchParamId = $derived(this.searchParams.get(this.key));

  constructor(key: string) {
    if (!key || key.trim() === '') {
      throw new Error('Key must be provided and non-empty');
    }
    this.key = key;
    this.setupListeners();
  }

  private setupListeners() {
    const update = () => {
      this.searchParams = new URLSearchParams(window.location.search);
    };
    window.addEventListener('popstate', update);
    const originalPushState = history.pushState;
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      originalPushState.apply(history, args);
      update();
    };
  }

  set(value: string | null) {
    if (value === null) {
      this.searchParams.delete(this.key);
    } else {
      this.searchParams.set(this.key, value);
    }
    history.pushState(
      {},
      '',
      `${window.location.pathname}?${this.searchParams.toString()}`
    );
  }

  toggle(value: string) {
    this.set(this.searchParamId === value ? null : value);
  }

  clear() {
    this.set(null);
  }
}

export const categoryParamStore = new UrlStore('category')
export const tagParamStore = new UrlStore('tag')