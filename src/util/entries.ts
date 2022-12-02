import type { EntryDate } from "../types/entry";
import { EntryType } from "../types/enums";
import type { Project } from "../types/project";
import type { Tag } from "../types/tag";
import { formatDate, getSlug } from "./helper";

export function getTag(title: string, type: EntryType): Tag {
    const slug = getSlug(title);
    return {
        title: title,
        slug: slug,
        fullPath: `/${type.toLowerCase()}s/?tag=${slug}`,
        count: 0,
    }
}

export function getDate(raw: Date): EntryDate {
    return {
        raw,
        display: formatDate(raw)
    }
}

export function getUniqueTags(entries: Project[]): Tag[] {
    const duplicateTags = entries.map(entry => entry.tags).flat()
    return duplicateTags.reduce((unique: Tag[], item: Tag): Tag[] => {
        const tagIndex = unique.findIndex((u) => item.slug === u.slug)
        const isItemInUnique = tagIndex >= 0;
        if (isItemInUnique) {
            unique[tagIndex].count++;
        } else {
            unique.push({
                ...item,
                count: 1,
            });
        }
        return unique;
    }, [])
}

export function getTagBySlug(tags: Tag[], slug: string): Tag {
    const foundTag = tags.find(tag => tag.slug === slug)
    if (foundTag === undefined) {
        throw new Error(`Tag couldn't be found by slug: ${slug}`);
    }
    return foundTag
}