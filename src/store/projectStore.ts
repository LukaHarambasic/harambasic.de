import { atom } from 'nanostores'
import { formatDate, getSlug, sortAlphabetical, sortDate, sortNumber } from '../util/helper';

enum ProjectSortProperty {
    Title = 'TITLE',
    Published = 'PUBLISHED',
    Updated = 'UPDATED',
    Priority = 'PRIORITY',
}

enum TagSortProperty {
    Title = 'TITLE',
    Count = 'COUNT',
}

enum SortDirection {
    Desc = 'DESC',
    Asc = 'ASC',
}

// Don't like the Null here, but there doesn't seem to be another way to have a nullable enum
enum ProjectStatus {
    Null = 'NULL',
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}

interface Link {
    title: string;
    url: string;
}

interface Tag {
    title: string;
    slug: string;
    fullPath: string;
    count: number;
}

interface EntryDate {
    raw: Date;
    display: string;
}
enum EntryType {
    List = 'LIST',
    Post = 'POST',
    Project = 'PROJECT',
}

interface Entry {
    type: EntryType;
    title: string;
    description: string;
    image: string;
    tags: Tag[];
    published: EntryDate;
    updated: EntryDate;
    slug: string;
    relativePath: string;
    fullPath: string;
}

interface Project extends Entry {
    links: Link[];
    prio: number;
    status: ProjectStatus | null;
    Content: any
}

function getTag(title: string, type: EntryType): Tag {
    const slug = getSlug(title);
    return {
        title: title,
        slug: slug,
        fullPath: `/${type.toLowerCase()}s/?tag=${slug}`,
        count: 0,
    }
}

function getDate(raw: Date): EntryDate {
    return {
        raw,
        display: formatDate(raw)
    }
}

function getUniqueTags(entries: Project[]): Tag[] {
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

// Everything above should be in a different file

const initialTag: Tag = getTag('all', EntryType.Project)

export const inputEntries = atom<Project[]>([])
export const inputTags = atom<Tag[]>([])
export let entries = atom<Project[]>([])
export let tags = atom<Tag[]>([])
export let filterTag = atom<Tag>(initialTag)
export let filterStatus = atom<ProjectStatus>(ProjectStatus.Null)
export let sortProperty = atom<ProjectSortProperty>(ProjectSortProperty.Priority)
export let sortDirection = atom<SortDirection>(SortDirection.Desc)

export function storeProjects(raw: any) {
    const enrichedEntries = raw.map(getProject)
    inputEntries.set(enrichedEntries)
}

export function getTagBySlug(slug: string): Tag {
    const foundTag = inputTags.get().find(tag => tag.slug === slug)
    if (foundTag === undefined) {
        throw new Error(`Tag couldn't be found by slug: ${slug}`);
    }
    return foundTag
}

inputEntries.listen((value: readonly Project[]) => {
    const uniqueTags = getUniqueTags(value as Project[])
    inputTags.set(uniqueTags)
    const sorted = getSortedProjects(value as Project[], sortProperty.get(), sortDirection.get())
    entries.set(sorted)
})

inputTags.listen((value: readonly Tag[]) => {
    tags.set(value as Tag[])
})

filterTag.listen((value: Readonly<Tag>) => {
    const filtered = getFilteredProjects(inputEntries.get(), value, filterStatus.get())
    const sortedAndFiltered = getSortedProjects(filtered, sortProperty.get(), sortDirection.get())
    entries.set(sortedAndFiltered)
})

filterStatus.listen((value: Readonly<ProjectStatus>) => {
    const filtered = getFilteredProjects(inputEntries.get(), filterTag.get(), value)
    const sortedAndFiltered = getSortedProjects(filtered, sortProperty.get(), sortDirection.get())
    entries.set(sortedAndFiltered)
})

sortProperty.listen((value: ProjectSortProperty) => {
    const sorted = getSortedProjects(entries.get(), value, sortDirection.get())
    entries.set(sorted)
})

sortDirection.listen((value: SortDirection) => {
    const sorted = getSortedProjects(entries.get(), sortProperty.get(), value)
    entries.set(sorted)
})

function getSortedProjects(unsorted: Project[], property: ProjectSortProperty, direction: SortDirection): Project[] {
    const entriesCopy = JSON.parse(JSON.stringify(unsorted))
    switch (property) {
        case ProjectSortProperty.Title:
            if (direction === SortDirection.Asc) {
                return entriesCopy.sort((a: Project, b: Project) => sortAlphabetical(a.title, b.title));
            } else if (direction === SortDirection.Desc) {
                return entriesCopy.sort((a: Project, b: Project) => sortAlphabetical(b.title, a.title));
            }
            break;
        case ProjectSortProperty.Published:
            if (direction === SortDirection.Asc) {
                return entriesCopy.sort((a: Project, b: Project) => sortDate(b.published.raw, a.published.raw));
            } else if (direction === SortDirection.Desc) {
                return entriesCopy.sort((a: Project, b: Project) => sortDate(a.published.raw, b.published.raw));
            }
            break;
        case ProjectSortProperty.Updated:
            if (direction === SortDirection.Asc) {
                return entriesCopy.sort((a: Project, b: Project) => sortDate(b.updated.raw, a.updated.raw));
            } else if (direction === SortDirection.Desc) {
                return entriesCopy.sort((a: Project, b: Project) => sortDate(a.updated.raw, b.updated.raw));
            }
            break;
        case ProjectSortProperty.Priority:
            if (direction === SortDirection.Asc) {
                return entriesCopy.sort((a: Project, b: Project) => sortNumber(b.prio, a.prio));
            } else if (direction === SortDirection.Desc) {
                return entriesCopy.sort((a: Project, b: Project) => sortNumber(a.prio, b.prio));
            }
            break;
        default:
            return [];
    }
    return [];
}

function getFilteredProjects(unfiltered: Project[], filteringTag: Tag, filteringStatus: ProjectStatus): Project[] {
    const entriesCopy = JSON.parse(JSON.stringify(unfiltered))
    const showAll = filteringTag.slug === 'all' && filteringStatus === ProjectStatus.Null
    if (showAll) {
        return entriesCopy;
    }
    const onlyFilterTags = filteringTag.slug !== 'all' && filteringStatus === ProjectStatus.Null
    if (onlyFilterTags) {
        return entriesCopy.filter((entry: Project) => {
            return entry.tags.some((tag) => tag.slug === filteringTag.slug);
        });
    }
    const onlyFilterStatus = filteringTag.slug === 'all' && filteringStatus !== ProjectStatus.Null
    if (onlyFilterStatus) {
        return entriesCopy.filter((entry: Project) => entry.status === filteringStatus);
    }
    // TODO
    return entriesCopy.filter((entry): Project[] => {
        const hasTag = entry.tags.some((tag) => tag.slug === filteringTag.slug);
        const hasStatus = entry.status == filterStatus
        return hasTag && hasStatus
    });

}

function getProject(e: any): Project {
    const f = e.frontmatter
    const type = EntryType.Project
    const slug = getSlug(f.title)
    const relativePath = `/${(type).toLowerCase()}s/${slug}`
    const rawTags = ['All', ...f.tags]
    return {
        type,
        title: f.title,
        description: f.description,
        image: f.image,
        tags: rawTags.map(tag => getTag(tag, type)),
        published: getDate(f.published),
        updated: getDate(f.updated),
        Content: e.Content,
        links: f.links,
        prio: f.prio,
        status: f.status,
        slug,
        relativePath,
        fullPath: `https://harambasic.de${relativePath}`,
    }
}