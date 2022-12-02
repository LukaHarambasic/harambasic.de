export enum EntryType {
    List = 'LIST',
    Post = 'POST',
    Project = 'PROJECT',
}

export enum SortDirection {
    Desc = 'DESC',
    Asc = 'ASC',
}

export enum TagSortProperty {
    Title = 'TITLE',
    Count = 'COUNT',
}

export enum ProjectSortProperty {
    Title = 'TITLE',
    Published = 'PUBLISHED',
    Updated = 'UPDATED',
    Priority = 'PRIORITY',
}

// Don't like the Null here, but there doesn't seem to be another way to have a nullable enum
export enum ProjectStatus {
    Null = 'NULL',
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}