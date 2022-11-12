export function getFileName(page: any) {
	return page.file.split('/').pop().split('.').shift();
}

export function getPath(parentPath: string, page: any) {
	return `/${parentPath}/${getFileName(page)}`;
}

// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
// TODO figure out is getSlug or this function should be used - getSlug seems more specific and might not even generate a real slug
// TODO replace with magic regex
export function getSlug(str: string) {
	if (str === '') return '';
	return (
		str
			.trim()
			.toLowerCase()
			// remove all chars which aren't characters, numbers or spaces
			.replace(/[^a-zA-Z0-9\s]+/g, '')
			// replace all spaces with dashes
			.replace(/\s+/g, '-')
	);
}

export function getRandomItems(items: any[], amount: number) {
	return items.sort(() => 0.5 - Math.random())
		.slice(0, amount);
}