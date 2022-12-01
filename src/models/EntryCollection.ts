import { sortAlphabetical, sortDate, sortNumber } from "../util/helper";
import type { Entry } from "./Entry";
import type { Project } from "./Project";
import type { Tag } from "./Tag";
import type { Bookmark } from "./Bookmark";
import type { Post } from "./Post";

export enum EntrySortProperty {
    Title = 'TITLE',
    Published = 'PUBLISHED',
    Updated = 'UPDATED',
    Priority = 'PRIORITY',
    Status = 'STATUS'
}

export enum TagSortProperty {
    Title = 'TITLE',
    Count = 'COUNT',
}

export enum SortDirection {
    Desc = 'DESC',
    Asc = 'ASC',
}

export class EntryCollection {
    entries: Project[] | Bookmark[] | Post[];
    tags: Tag[];

    constructor(entries: Project[] | Bookmark[] | Post[]) {
        this.entries = entries
        this.tags = this.getUniqueTags()
    }

    public getSortedEntries(property: EntrySortProperty, direction: SortDirection) {
        const entriesCopy = JSON.parse(JSON.stringify(this.entries))
        switch (property) {
            case EntrySortProperty.Title:
                if (direction === SortDirection.Asc) {
                    return entriesCopy.sort((a: Entry, b: Entry) => sortAlphabetical(a.title, b.title));
                } else if (direction === SortDirection.Desc) {
                    return entriesCopy.sort((a: Entry, b: Entry) => sortAlphabetical(b.title, a.title));
                }
                break;
            case EntrySortProperty.Published:
                if (direction === SortDirection.Asc) {
                    return entriesCopy.sort((a: Entry, t: Entry) => sortDate(t.published.raw, a.published.raw));
                } else if (direction === SortDirection.Desc) {
                    return entriesCopy.sort((a: Entry, b: Entry) => sortDate(a.published.raw, b.published.raw));
                }
                break;
            case EntrySortProperty.Updated:
                if (direction === SortDirection.Asc) {
                    return entriesCopy.sort((a: Entry, b: Entry) => sortDate(b.updated.raw, a.updated.raw));
                } else if (direction === SortDirection.Desc) {
                    return entriesCopy.sort((a: Entry, b: Entry) => sortDate(a.updated.raw, b.updated.raw));
                }
                break;
            default:
                return []
        }
        return []
    };

    public getFilteredEntriesByTagSlug(filterTagSlug: string): Entry[] {
        const entriesCopy = JSON.parse(JSON.stringify(this.entries))
        if (filterTagSlug === 'all') {
            return entriesCopy;
        }
        return entriesCopy.filter((entry): Entry[] => {
            return entry.tags.some((tag) => tag.slug === filterTagSlug);
        });

        return [];
    };

    public getSortedTags(property: TagSortProperty, direction: SortDirection): Tag[] {
        const entriesCopy = JSON.parse(JSON.stringify(this.entries))
        switch (property) {
            case TagSortProperty.Title:
                if (direction === SortDirection.Asc) {
                    return entriesCopy.sort((a: Tag, b: Tag) => sortAlphabetical(a.title, b.title));
                } else if (direction === SortDirection.Desc) {
                    return entriesCopy.sort((a: Tag, b: Tag) => sortAlphabetical(b.title, a.title));
                }
                break;
            case TagSortProperty.Count:
                if (direction === SortDirection.Asc) {
                    return entriesCopy.sort((a: Tag, b: Tag) => sortNumber(b.count, a.count));
                } else if (direction === SortDirection.Desc) {
                    return entriesCopy.sort((a: Tag, b: Tag) => sortNumber(a.count, b.count));
                }
                break;

            default:
                return [];
        }
        return [];
    }

    private getUniqueTags(): Tag[] {
        const entriesCopy = JSON.parse(JSON.stringify(this.entries))
        const duplicateTags = entriesCopy.map(entry => entry.tags).flat()
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
}