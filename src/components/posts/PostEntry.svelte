<script lang="ts">
  import RichText from '@components/RichText.svelte'
  import Card from '@components/Card.svelte'
  import Category from '@components/Category.svelte'
  import { type CollectionEntry } from 'astro:content'
  import Tag from '@components/Tag.svelte'

  let { category, tags, children } = $props<{
    entry: CollectionEntry<'posts'>
    category: CollectionEntry<'categories'>
    tags: CollectionEntry<'tags'>
    children: () => any
  }>()
</script>

<article class="h-entry">
  <section class="post">
    <RichText>
      {@render children()}
    </RichText>
  </section>
  <aside class="sidebar">
    <Card>
      <h3>Author</h3>
      <a
        href="https://harambasic.de"
        rel="author"
        class="author p-author h-card">Luka Harambasic</a
      >
    </Card>
    <Card>
      <h3>Category</h3>
      <Category {category} />
    </Card>
    <Card>
      <h3>Tags</h3>
      <ul class="tags">
        {#each tags as tag}
          <li>
            <Tag {tag} />
          </li>
        {/each}
      </ul>
    </Card>
    <Card>
      <h3>Table of Content</h3>
      <!-- <PostsTableOfContent nodes={toc} /> -->
    </Card>
  </aside>
  <Card>
    <h3>Tl;DR</h3>
    <!-- <BaseCallout prefix="TL;DR">
      {@html tldr}
    </BaseCallout> -->
  </Card>
  <Card class="placeholder"></Card>
  <Card>
    <div class="rss rich-text">
      <a href="/posts/rss">RSS Feed</a>
    </div>
  </Card>
</article>

<style lang="postcss">
  article {
    display: grid;
    grid:
      'tldr placeholder' auto
      'post sidebar' 1fr
      'footer footer' auto
      / calc(70% - var(--l)) 30%;
    gap: var(--l);
    width: 100%;
    @media screen and (max-width: 74rem) {
      grid:
        'tldr' auto
        'sidebar' auto
        'post' auto
        'footer' auto
        / 100%;
    }
    .tldr {
      grid-area: tldr;
    }
    .placeholder {
      grid-area: placeholder;
      opacity: 0.5;
      @media screen and (max-width: 74rem) {
        display: none;
      }
    }
    h3 {
      display: inline-block;
      font-weight: 900;
      font-size: var(--font-m);
      line-height: 1;
      font-family: var(--font-family);
      letter-spacing: var(--font-letter-spacing-headline);
    }
    .sidebar {
      grid-area: sidebar;
      gap: var(--l);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      .author {
          color: var(--c-font);
          font-size: var(--font-m);
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
          text-decoration: none;
          &:hover {
            text-decoration: underline;
            text-decoration-thickness: var(--underline-thickness);
          }
      }
      .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--xs);
        align-items: flex-start;
        justify-content: flex-start;
      }
      .toc {
        position: sticky;
        top: var(--l);
      }
    }
    .post {
      grid-area: post;
    }
    footer {
      grid-area: footer;
      text-align: center;
      margin: var(--l) 0 0 0;
    }
  }
</style>
