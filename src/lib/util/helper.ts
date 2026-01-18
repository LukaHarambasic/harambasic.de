import type { StatusFilter } from '$lib/types/entry';
import type {
	SortDirection,
	PostSortProperty,
	ProjectSortProperty,
	UsesEntrySortProperty,
	ShareableSortProperty,
	SnippetSortProperty
} from '$lib/types/enums';
import { BASE_SORT_PROPERTIES, PROJECT_SORT_PROPERTIES, SORT_DIRECTIONS } from '$lib/types/enums';
import { format } from 'date-fns';

// solution inspired by https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
// implementation inspired by https://futurestud.io/tutorials/node-js-string-replace-all-appearances
export function getSlug(str: string) {
	if (!str) return '';
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
export function getRandomItems<T>(items: T[], amount: number): T[] {
	return items.sort(() => 0.5 - Math.random()).slice(0, amount);
}

export function formatDate(date: Date): string {
	return format(new Date(date), 'yyyy-MM-dd');
}

export function sortAlphabetical(a: string, b: string): number {
	return a.localeCompare(b);
}

export function sortDate(a: Date, b: Date): number {
	return new Date(b).valueOf() - new Date(a).valueOf();
}

export function sortNumber(a: number, b: number): number {
	return b - a;
}

// Runtime validation functions
export function isValidSortProperty<T extends string>(
	value: string,
	validProperties: readonly T[]
): value is T {
	return (validProperties as readonly string[]).includes(value);
}

export function isValidPostSortProperty(value: string): value is PostSortProperty {
	return isValidSortProperty(value, BASE_SORT_PROPERTIES);
}

export function isValidProjectSortProperty(value: string): value is ProjectSortProperty {
	return isValidSortProperty(value, PROJECT_SORT_PROPERTIES);
}

export function isValidUsesEntrySortProperty(value: string): value is UsesEntrySortProperty {
	return isValidSortProperty(value, BASE_SORT_PROPERTIES);
}

export function isValidShareableSortProperty(value: string): value is ShareableSortProperty {
	return isValidSortProperty(value, BASE_SORT_PROPERTIES);
}

export function isValidSnippetSortProperty(value: string): value is SnippetSortProperty {
	return isValidSortProperty(value, BASE_SORT_PROPERTIES);
}

export function isValidSortDirection(value: string): value is SortDirection {
	return isValidSortProperty(value, SORT_DIRECTIONS);
}

// Convert status values to array for UI display
export function statusFilterToArray(): { display: string; key: string }[] {
	const statusValues: StatusFilter[] = ['active', 'inactive', 'all'];
	return statusValues.map((value) => ({
		display: value.charAt(0).toUpperCase() + value.slice(1),
		key: value
	}));
}

export function sortDirectionsToArray(): { display: string; key: string }[] {
	return SORT_DIRECTIONS.map((direction) => ({
		display: direction === 'DESC' ? 'Desc' : 'Asc',
		key: direction
	}));
}

export function sortPropertyToArray(
	sortProperties: readonly string[]
): { display: string; key: string }[] {
	return sortProperties.map((property) => {
		// Capitalize first letter for display
		const display = property.charAt(0).toUpperCase() + property.slice(1);
		return {
			display,
			key: property
		};
	});
}

export function setParam(key: string, value: string) {
	const url = new URL(window.location.toString());
	url.searchParams.set(key, value);
	window.history.pushState({}, '', url.href);
}
