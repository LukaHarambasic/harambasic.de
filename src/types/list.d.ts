export interface ListEntry {
  title: string;
  description: string;
  logo: string;
  url: string;
}

export interface List {
  title: string;
  description: string;
  entries: ListEntry[];
  file: string;
}