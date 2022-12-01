import { MarkdownHeading } from "astro";
import { AstroComponentFactory } from "astro/dist/runtime/server";
import { Entry } from "./Entry";

export interface TocNode {
    depth: number;
    slug: string;
    text: string;
    children: TocNode[] | null;
}

export class Post extends Entry {
    toc: TocNode[]
    tldr: string
    discussion: string
    Content: AstroComponentFactory

    constructor(title: string, description: string, image: string, tags: string[], published: Date, updated: Date, Content: AstroComponentFactory, markdownHeading: MarkdownHeading[], tldr: string, discussion: string) {
        super(title, description, image, tags, published, updated)
        this.toc = this.generateNestedToc(markdownHeading)
        this.tldr = tldr
        this.discussion = discussion
        this.Content = Content
    }

    // TODO test
    // TODO can this be rewritten in a nicer way?
    // provided by https://codepen.io/Frnak/pen/mdmEjyG?editors=0011
    private generateNestedToc(markdownHeading: MarkdownHeading[]): TocNode[] {
        let latestEntry: TocNode | null;
        let latestParent: TocNode | null;
        const markdownHeadingCopy = JSON.parse(JSON.stringify(markdownHeading));
        if (markdownHeadingCopy.length <= 1) return markdownHeadingCopy;
        const entryDepth = markdownHeading.reduce((acc, item) => {
            return item.depth < acc ? item.depth : acc;
        }, Number.POSITIVE_INFINITY);
        return markdownHeadingCopy.reduce((result, entry) => {
            if (latestEntry && !latestEntry.children) {
                latestEntry.children = [];
            }
            let latestEntryDepth = latestEntry?.depth || 0;
            let latestEntryChildren = latestEntry?.children || [];
            let latestParentChildren = latestParent?.children || [];
            if (entry.depth === entryDepth) {
                entry.children = [];
                result.push(entry);
                latestParent = null;
            } else if (entry.depth === latestEntryDepth + 1) {
                latestEntryChildren.push(entry);
                latestParent = latestEntry;
            } else if (entry.depth === latestEntryDepth) {
                latestParentChildren.push(entry);
            } else {
                console.error('Unexpected Toc behaviour', entry);
            }
            latestEntry = entry;
            return result;
        }, []);
    }
}