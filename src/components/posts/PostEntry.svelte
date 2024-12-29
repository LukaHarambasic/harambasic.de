<script lang="ts">
  import RichText from '@components/RichText.svelte'
  import Card from '@components/Card.svelte'
  import Category from '@components/Category.svelte'
  import { type CollectionEntry } from 'astro:content'
  import Tags from '@components/Tags.svelte'

  let { category, tags, children } = $props<{
    entry: CollectionEntry<'posts'>
    category: CollectionEntry<'category'>
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
    <Card class="author card">
      <h3>Author</h3>
      <a href="https://harambasic.de" rel="author" class="p-author h-card"
        >Luka Harambasic</a
      >
    </Card>
    <Card class="category">
      <h3>Category</h3>
      <Category {category} />
    </Card>
    <Card class="tags">
      <h3>Tags</h3>
      <Tags {tags} />
    </Card>
    <Card class="toc card">
      <h3>Table of Content</h3>
      <!-- <PostsTableOfContent nodes={toc} /> -->
    </Card>
  </aside>
  <Card class="tldr">
    <h3>Tl;DR</h3>
    <!-- <BaseCallout prefix="TL;DR">
      {@html tldr}
    </BaseCallout> -->
  </Card>
  <Card class="placeholder card"></Card>
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
    .sidebar {
      grid-area: sidebar;
      gap: var(--l);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      .author {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        a {
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
      }
      .tags {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
        ul {
          display: flex;
          position: relative;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: stretch;
          justify-content: flex-start;
          align-items: flex-start;
          gap: var(--xs);
        }
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
