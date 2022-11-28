import { format } from 'date-fns';

export function getFileName(file: string) {
	return file.split('/')?.pop()?.split('.')?.shift();
}

export function getPath(parentPath: string, file: string) {
	return `/${parentPath}/${getFileName(file)}`;
}

// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
// TODO figure out is getSlug or this function should be used - getSlug seems more specific and might not even generate a real slug
// TODO replace with magic regex
export function getSlug(str: string) {
	if (str === '') return '';
	const slug = str
		.trim()
		.toLowerCase()
		// remove all chars which aren't characters, numbers or spaces
		.replace(/[^a-zA-Z0-9\s]+/g, '')
		// replace all spaces with dashes
		.replace(/\s+/g, '-');
	return slug;
}

// Won't be tested
export function getRandomItems(items: any[], amount: number) {
	return items.sort(() => 0.5 - Math.random()).slice(0, amount);
}

export function formatDate(date: Date) {
	return format(new Date(date), 'MM/dd/yyyy');
}
