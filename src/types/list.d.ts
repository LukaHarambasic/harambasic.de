export interface ListEntry {
  title: string;
  description: string;
  logo: string;
  url: string;
  parentSlug: string;
}

export interface List {
  title: string;
  slug: string;
  description: string;
  entries: ListEntry[];
  file: string;
}