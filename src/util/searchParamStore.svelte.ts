class SearchParamsStore {
  private static instance: SearchParamsStore | null = null;

  searchParams = $state(new URLSearchParams(window.location.search));

  private constructor() {
    console.log('constructor')
    this.setupListeners();
  }

  static getInstance() {
    console.log('getInstance')
    if (!SearchParamsStore.instance) {
      SearchParamsStore.instance = new SearchParamsStore();
    }
    return SearchParamsStore.instance;
  }

  private setupListeners() {
    const update = () => {
      console.log('update')
      this.searchParams = new URLSearchParams(window.location.search);
    };

    window.addEventListener('popstate', update);

    const originalPushState = history.pushState;
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      originalPushState.apply(history, args);
      update();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      originalReplaceState.apply(history, args);
      update();
    };


    // TODO implement destroy
    // window.removeEventListener('popstate', update);
    // history.pushState = originalPushState;
    // history.replaceState = originalReplaceState;

  }
}

export const searchParamsStore = SearchParamsStore.getInstance();