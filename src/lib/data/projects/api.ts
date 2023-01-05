import { EntryType } from "$lib/types/enums";
import type { Project } from "$lib/types/project";
import { getRawEntries } from "$lib/util/converter";

export async function load(): Promise<Project[]> {
    const rawEntries = await getRawEntries(EntryType.Post)
    const entries: Project[] = rawEntries.map(({ html, meta }) => {
        return {
            html,
            ...meta
        };
    })
    return entries
}