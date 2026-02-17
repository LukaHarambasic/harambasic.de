import { resolve as kitResolve } from '$app/paths';

/** Resolve a path with base. Cast needed: SvelteKit's resolve expects strict route union; our paths come from dynamic data. */
export function resolvePath(path: string): string {
	return (kitResolve as (path: string) => string)(path);
}
