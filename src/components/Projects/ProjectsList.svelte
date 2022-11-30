<script lang="ts">
	import { onMount } from 'svelte';
	import { SortDirection, SortProperty } from '../../types/enums';
	import type { Project } from '../../types/project';

	let selectedProject: string = 'all';

	export let projects: Project[];
	let sortedProjects: Project[] = projects; // sortProjects(projects, SortProperty.Title, SortDirection.Desc);

	onMount(() => {
		selectedProject = new URLSearchParams(window.location.search).get('project') || 'all';
	});

	function onSelectProject(projectSlug: string) {
		selectedProject = projectSlug;
		const url = new URL(window.location.toString());
		url.searchParams.set('project', selectedProject);
		window.history.pushState({}, '', url.href);
	}
</script>

<ul>
	{#each sortedProjects as project}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- TODO: should this be a link, a button or add a keydown event -->
		<li class="h-feed" on:click={() => onSelectProject(project.slug)}>
			<img src={project.img} alt="TODO" width="8rem" />
			<div class="content">
				<strong>{project.title}</strong>
			</div>
		</li>
	{/each}
</ul>

<style lang="postcss">
	ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--l);
		li {
			display: flex;
			position: relative;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			transition: var(--transition);
			border-radius: var(--border-radius);
			background: var(--c-surface);
			height: 100%;
			color: var(--c-font);
			text-decoration: none;
			&:hover {
				transform: scale(1.05);
				cursor: pointer;
				svg {
					opacity: 1;
				}
			}
			> img {
				border-radius: var(--border-radius) var(--border-radius) 0 0;
				aspect-ratio: 1 / 1;
				width: 100%;
			}
			> .content {
				padding: var(--l);
				strong {
					display: block;
					margin: 0 0 var(--xs) 0;
					font-weight: 900;
					font-size: var(--font-m);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
				}
			}
		}
	}
</style>
