export function getSlug(page: any) {
    return page.file.split('/').pop().split('.').shift();
}
export function getPath(parentPath: string, page: any) {
    return `/${parentPath}/${getSlug(page)}`;
}
