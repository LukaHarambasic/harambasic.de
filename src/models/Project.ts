// import { AstroComponentFactory } from "astro/dist/runtime/server";
import { Entry } from "./Entry";
import { EntryCollection } from "./EntryCollection";
import { Link } from "./Link";

export enum ProjectStatus {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}

export class Project extends Entry {
    links: Link[];
    prio: number;
    status: ProjectStatus;
    Content: any

    constructor(title: string, description: string, image: string, tags: string[], published: Date, updated: Date, Content:
        any, links: Link[], prio: number, status: ProjectStatus) {
        super(title, description, image, tags, published, updated)
        this.links = links
        this.prio = prio
        this.status = status
        this.Content = Content
    }
}

export class ProjectCollection extends EntryCollection {

    constructor(entries: Project[]) {
        super(entries)
    }

    // TODO filter for status
    // TODO sort for prio
}