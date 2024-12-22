class UrlStore {
  private static instance: UrlStore | null = null;

  searchParams = $state(new URLSearchParams(window.location.search));

  private constructor() {
    this.setupListeners();
  }

  static getInstance() {
    if (!UrlStore.instance) {
      UrlStore.instance = new UrlStore();
    }
    return UrlStore.instance;
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
}

export const urlStore = UrlStore.getInstance();