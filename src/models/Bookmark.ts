import { Entry } from "./Entry";
import { EntryCollection } from "./EntryCollection";

export enum BookmarkStatus {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}

export class Bookmark extends Entry {
    url: string;
    status: BookmarkStatus;
    openSource: boolean

    constructor(title: string, description: string, image: string, tags: string[], published: Date, updated: Date, url: string, status: BookmarkStatus, openSource: boolean) {
        super(title, description, image, tags, published, updated)
        this.url = url
        this.status = status
        this.openSource = openSource
    }
}

export class BookmarkCollection extends EntryCollection {

    constructor(entries: Bookmark[]) {
        super(entries)
    }

    // TODO filter for status
    // TODO sort for prio
}