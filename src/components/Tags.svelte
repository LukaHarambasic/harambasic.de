<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let { tags } = $props<{
    tags: CollectionEntry<'tags'>[]
  }>()

  let currentTag = $state()

  const toggleSearchParam = (id: string) => {
    console.log('toggle')
    const searchParams = new URLSearchParams(window.location.search)

    if (currentTag === id) {
      searchParams.delete('tag')
    } else {
      searchParams.set('tag', id)
    }

    const url = new URL(window.location.toString())
    url.search = searchParams.toString()
    window.history.pushState({}, '', url.href)

    currentTag = searchParams.get('tag')
  }
</script>

<ul class="tags">
  {#each tags as tag}
    <li>
      <button
        class="tag"
        class:selected={currentTag === tag.id}
        onclick={() => toggleSearchParam(tag.id)}
      >
        {tag?.data?.title}
      </button>
    </li>
  {/each}
</ul>

<style lang="postcss">
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--xs);
    align-items: flex-start;
    justify-content: flex-start;
    .tag {
      display: inline-block;
      text-align: center;
      color: var(--c-font-accent-dark);
      font-weight: 400;
      font-size: var(--font-s);
      text-decoration: none;
      border: none;
      background: transparent;
      transition: transform var(--transition-time) var(--transition-ease);
      font-style: italic;
      &:hover {
        text-decoration-thickness: var(--underline-thickness);
        text-decoration: underline;
        cursor: pointer;
      }
      &:before {
        content: '#';
      }
      &.selected {
        text-decoration-thickness: var(--underline-thickness);
        text-decoration: underline;
      }
    }
  }
</style>
