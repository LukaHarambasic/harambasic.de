import { getSlug } from "../util/helper";
import { EntryType } from "./Entry";

export class Tag {
    title: string;
    slug: string;
    fullPath: string;
    count: number;

    constructor(title: string, type: EntryType) {
        const slug = getSlug(title);
        this.title = title
        this.slug = slug
        this.fullPath = `/${type.toLowerCase()}s/?tag=${slug}`
        this.count = 0
    }
}