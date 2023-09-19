<script lang="ts">
import type { Tag } from "$lib/types/tag"

export let tag: Tag
export let selected: boolean = false
</script>


<button
    on:click
    class="tag"
    title={tag.display} 
    class:selected={selected}
>
    {tag.display}
</button>

<style lang="postcss">
.tag {
    display:inline-block;
    text-align:center;
    color: var(--c-font-accent-dark);
    font-weight: 400;
    font-size: var(--font-s);
    text-decoration: none;
    padding: var(--xxs) var(--s);
    border-radius: var(--border-radius);
    background: var(--c-surface-accent);
    border: var(--border);
    transition: transform var(--transition-time) var(--transition-ease);
    &:hover {
        text-decoration: none;
        font-weight: bold;
        transform: scale(1.05);
    }
    &::before {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }
    &.selected {
        font-weight: bold;
    }
}
</style>