import { getSlug } from "../util/helper";
import { EntryDate } from "./EntryDate";
import { Tag } from "./Tag";

export enum EntryType {
    List = 'LIST',
    Post = 'POST',
    Project = 'PROJECT',
}

export class Entry {
    static type: EntryType;
    title: string;
    description: string;
    image: string;
    tags: Tag[];
    published: EntryDate;
    updated: EntryDate;
    slug: string;
    relativePath: string;
    fullPath: string;

    constructor(title: string, description: string, image: string, tags: string[], published: Date, updated: Date) {
        Entry.type = this.constructor.name as EntryType
        this.title = title
        this.description = description
        this.image = image
        this.tags = tags.map(tag => new Tag(tag, Entry.type))
        this.published = new EntryDate(published)
        this.updated = new EntryDate(updated)
        this.slug = getSlug(title)
        this.relativePath = `/${(Entry.type).toLowerCase()}s/${this.slug}`
        this.fullPath = `https://harambasic.de${this.relativePath}`
    }
}