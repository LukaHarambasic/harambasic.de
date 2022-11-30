import { AstroComponentFactory } from 'astro/dist/runtime/server/render';

export interface Tag {
    display: string;
    slug: string;
    fullPath: string;
    count: number;
}

export interface Tags {
    children: Tag[];
    convert: (children) => any;
}

export interface EntryDate {
    raw: Date;
    display: string;
}

export interface Entry {
    title: string;
    description: string;
    tags: Tags;
    published: EntryDate;
    updated: EntryDate;
    Content: AstroComponentFactory;
    relativePath: string;
    fullPath: string;
}

export interface Entries {
    children: Entry[];
    convert: (children) => any;
}