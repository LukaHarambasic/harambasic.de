import type { MarkdownInstance } from 'astro';
import type { Project } from '../../types/project';

export function rawToProjects(rawProjects: MarkdownInstance<Record<string, any>>[]): Project[] {
    return rawProjects.map((rawProject) => {
        const { title, img, alt, prio, status, links, responsibilities } =
            rawProject.frontmatter as Project;
        return {
            title,
            img,
            alt,
            prio,
            status,
            links,
            responsibilities,
            Content: rawProject.Content,
            file: rawProject.file,
        };
    });
}