<script lang="ts">
  import type { PageData } from './$types'
  import type { Project } from '$lib/types/project'
  import { filterAndSort } from '$lib/data/projects/helper'
  import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { setParam } from '$lib/util/helper'
  import Entries from '$lib/components/Entries/Entries.svelte'
  import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte'
  import EntriesTags from '$lib/components/Entries/EntriesTags.svelte'
  import EntriesFilter from '$lib/components/Entries/EntriesFilter.svelte'
  import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte'
  import BaseTag from '$lib/components/Base/BaseTag.svelte'
  import BaseModal from '$lib/components/Base/BaseModal.svelte'

  export let data: PageData
  const [entries, tags] = data.projects

  $: filterTagSlug = 'all'
  $: filterStatus = ProjectStatus.All
  $: sortProperty = ProjectSortProperty.Priority
  $: sortDirection = SortDirection.Desc
  $: filteredAndSorted = filterAndSort(entries, filterTagSlug, filterStatus, sortProperty, sortDirection)
  $: projectSlug = ''
  $: activeProject = entries.find((entry) => entry.slug === projectSlug);

  function onProperty(event: { detail: ProjectSortProperty }) {
    sortProperty = event.detail
  }

  function onDirection(event: { detail: SortDirection }) {
    sortDirection = event.detail
  }

  function onTag(event: { detail: string }) {
    filterTagSlug = event.detail
  }

  function onStatus(event: { detail: ProjectStatus }) {
    filterStatus = event.detail
  }

  // For full static rendering searchparams has to be accessed in onMount
  onMount(() => {
    filterTagSlug = $page.url.searchParams.get('tag') || 'all'
    filterStatus = ($page.url.searchParams.get('status') as ProjectStatus) || ProjectStatus.All
    sortProperty = ($page.url.searchParams.get('property') as ProjectSortProperty) || ProjectSortProperty.Priority
    sortDirection = ($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc
    projectSlug = ($page.url.searchParams.get('slug') as string) || ''
    openModal()
	});

  let showModal = false;

  function openModal(project?: Project) {
    console.log("openModal", project)
    if(project) {
      setParam('slug', project.slug)
      projectSlug = project.slug
      showModal = true;
    } else if (projectSlug && !project) {
      showModal = true;
    }
  }
</script>

<Entries>
  <EntriesSidebar slot="sidebar">
    <EntriesSorter propertiesEnum={ProjectSortProperty} propertiesDefault={ProjectSortProperty.Priority} on:propertyChange={onProperty} on:directionChange={onDirection} />
    <EntriesFilter statusEnum={ProjectStatus} on:statusChange={onStatus} />
    <EntriesTags {tags} on:tagChange={onTag} />
  </EntriesSidebar>
  <ul class="entries" slot="entries">
    {#each filteredAndSorted as entry, index}
	    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
      <li 
        class="h-feed card no-spacing"
        data-highlighted={index < 4} 
        on:click={() => openModal(entry)}
      >
        {#if index < 4}
          <img src="/projects/{entry.image}" alt="{entry.imageAlt}" width="8rem" />
        {/if}
        <div class="content">
          <strong>{entry.title}</strong>
          <p>{entry.description}</p>
          <ul class="tags">
            {#each entry.tags as tag}
              <li>
                <BaseTag tag={tag} />
              </li>
            {/each}
          </ul>
        </div>
      </li>
    {/each}
  </ul>
</Entries>

<!-- This is not in the normal dom flow -->
<BaseModal bind:showModal>
  {#if activeProject}
    <div class="modal">
      <img src="projects/{activeProject.image}" alt={activeProject.imageAlt} width="8rem" />
      <div class="content">
        <h2>{activeProject.title}</h2>
        <ul class="tags">
          {#each activeProject.tags as tag}
            <li>
              <BaseTag tag={tag} />
            </li>
          {/each}
        </ul>
        <div class="rich-text">
          {@html activeProject.html}
        </div>
        <ul class="links rich-text">
          {#each activeProject.links as link}
            <li>
              <a href="{link.url}" target="_blank" rel="noopener noreferrer">{link.title}</a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</BaseModal>

<style lang="postcss">
  .entries {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--l);
    @media screen and (max-width: 62rem) {
      grid-template-columns: 1fr;
    }
    li {
      display: flex;
      position: relative;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      transition: var(--transition);
      height: 100%;
      color: var(--c-font);
      text-decoration: none;
      &[data-highlighted="false"] {
        grid-column: span 2;
      }
      &[data-highlighted="true"] {
        @media screen and (max-width: 62rem) {
          grid-column: span 2;
        }
      }
      &:hover {
        transform: scale(0.97);
        cursor: pointer;
        > img {
          filter: grayscale(0);
        }
      }
      > img {
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        aspect-ratio: 1 / 1;
        width: 100%;
        filter: grayscale(1);
      }
      > .content {
        padding: var(--l);
        strong {
          display: block;
          margin: 0 0 var(--xxs) 0;
          font-weight: 900;
          font-size: var(--font-m);
          line-height: 1.2;
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
        }
        p {
          margin: 0 0 var(--s) 0;
          line-height: 1.5;
          font-size: var(--font-m);
        }
        .tags {
          flex-base: 100%;
          display: flex;
          flex-grow: 1;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: stretch;
          justify-content: flex-start;
          align-items: flex-start;
          gap: var(--xs);
        }
      }
    }
  }
  .modal {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    @media screen and (max-width: 64rem) {
      flex-direction: column;
    }
    > img {
      border-radius: var(--border-radius);
      aspect-ratio: 1 / 1;
      size: 20rem;
      @media screen and (max-width: 48rem) {
        width: 100%;
        height: auto;
      }
    }
    > .content {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      h2 {
        font-weight: 900;
        font-size: var(--font-xl);
        line-height: 1.2;
        font-family: var(--font-family);
        letter-spacing: var(--font-letter-spacing-headline);
        margin: 0 0 0 0;
      }
      .tags {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--xs);
        margin: 0 0 var(--m) 0;
      }
      .rich-text {
        margin: 0 0 var(--m) 0;
      }
      .links {
        flex-base: 100%;
        display: flex;
        flex-grow: 1;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--m);
      }
    }
  }
</style>
