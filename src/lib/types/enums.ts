export enum EntryType {
  Bookmark = 'BOOKMARK',
  Post = 'POST',
  Project = 'PROJECT'
}

export enum SortDirection {
  Desc = 'DESC',
  Asc = 'ASC'
}

export enum TagSortProperty {
  Title = 'TITLE',
  Count = 'COUNT'
}

export enum ProjectSortProperty {
  Title = 'TITLE',
  Published = 'PUBLISHED',
  Updated = 'UPDATED',
  Priority = 'PRIORITY'
}

// Don't like the Null here, but there doesn't seem to be another way to have a nullable enum
// TODO replace usage of null with empty to not confuse it with null
export enum ProjectStatus {
  Null = 'NULL',
  Empty = 'EMPTY',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum BookmarkStatus {
  Empty = 'EMPTY',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum BookmarkSortProperty {
  Title = 'TITLE',
  Published = 'PUBLISHED',
  Updated = 'UPDATED'
}

export enum PostSortProperty {
  Title = 'TITLE',
  Published = 'PUBLISHED',
  Updated = 'UPDATED'
}
