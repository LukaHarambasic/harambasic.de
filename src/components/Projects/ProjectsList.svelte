<script lang="ts">
	import { onMount } from 'svelte';
	import { SortDirection, SortProperty } from '../../types/enums';
	import type { Project, Responsibility } from '../../types/project';

	let selectedProject: string = 'all';

	export let projects: Project[];
	let sortedProjects: Project[] = projects; // sortProjects(projects, SortProperty.Title, SortDirection.Desc);

	let responsibilities: Responsibility[] = [];

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

<section>
	<aside class="responsibilities">
		<h2>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="#000000"
				viewBox="0 0 256 256"
				><rect width="32" height="32" fill="none" /><path
					d="M42.1,48H213.9a8,8,0,0,1,5.9,13.4l-65.7,72.3a7.8,7.8,0,0,0-2.1,5.4v56.6a7.9,7.9,0,0,1-3.6,6.7l-32,21.3a8,8,0,0,1-12.4-6.6v-78a7.8,7.8,0,0,0-2.1-5.4L36.2,61.4A8,8,0,0,1,42.1,48Z"
					fill="none"
					stroke="#000000"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="24"
				/></svg
			> Responsibilities
		</h2>
		<ol>
			<li>
				<button class:selected={selectedProject === 'all'} on:click={() => onSelectProject('all')}>
					All ({projects.length})</button
				>
			</li>
			{#each responsibilities as responsibility}
				<li>
					<button
						class:selected={onSelectProject === responsibility.slug}
						on:click={() => onSelectProject(responsibility.slug)}
					>
						{responsibility.display} ({responsibility.projectCount})
					</button>
				</li>
			{/each}
		</ol>
	</aside>
	<div class="projects">
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
	</div>
</section>

<style lang="postcss">
	section {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--xl);
		> .responsibilities {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			gap: var(--m);
			/* TODO align */
			width: 12rem;
			ol {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: stretch;
				gap: var(--s);
				li {
					button {
						margin: 0;
						border: none;
						background: none;
						padding: 0;
						color: var(--c-font-accent-dark);
						font-size: var(--font-s);
						&:hover {
							cursor: pointer;
							text-decoration: underline;
							text-decoration-thickness: var(--underline-thickness);
						}
						&.selected {
							text-decoration: underline;
							text-decoration-thickness: var(--underline-thickness);
							&:hover {
								text-decoration: none;
							}
						}
					}
				}
			}
		}
	}

	.projects {
		ul {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--xl);
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
	}
</style>
