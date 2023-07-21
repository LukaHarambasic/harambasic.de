<script lang="ts">
  import BaseCallout from '$lib/components/Base/BaseCallout.svelte'
  import PostsTableOfContent from './TableOfContent.svelte'
  import type { Post } from '$lib/types/post'
  import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte'

  export let post: Post
  const { title, published, updated, tldr, tags, description, image, slug, relativePath, fullPath, toc, html } = post
</script>

<article class="post h-entry">
  <!-- TODO the 4 section could be split up in dedicated files -->
  <div class="placeholder card"></div>
  <div class="tags card">
    <BaseHeadlineIcon title="Tags" icon="ph:hash-bold" />
    <ul>
      {#each tags as tag}
        <li>
          <a href={tag.relativePath} title={tag.display} class="link">
            {tag.display}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="toc">
    <div class="content card">
      <PostsTableOfContent nodes={toc} />
    </div>
  </div>
  <div class="tldr">
    <BaseCallout prefix="TL;DR">
      {@html tldr}
    </BaseCallout>
  </div>
  <section class="post">
    <div class="content rich-text e-content">
      {@html html}
    </div>
  </section>
  <footer class="rich-text">
    <div class="follow">
      <!-- TODO links -->
      If you have any thoughts or questions feel free to share them in
      <a href="https://TODO.com">this thread</a> or send me an
      <a href="https://TODO.com">email</a>. And if you want to stay up to date you can subscribe to the
      <a href="https://TODO.com">RSS feed</a>.
    </div>
    <div class="author">
      <a href="https://harambasic.de" rel="author" class="p-author h-card">by Luka Harambasic</a>
    </div>
  </footer>
</article>

<style lang="postcss">
  article {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    grid-template-columns: 70ch 1fr;
    grid-template-areas: 'tldr placeholder' 'post tags' 'post toc' 'footer footer';
    column-gap: var(--l);
    row-gap: var(--l);
    .placeholder {
      grid-area: placeholder;
      opacity: 0.5;
    }
    .tags {
      grid-area: tags;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      strong {
        font-weight: 900;
        font-size: var(--font-l);
        line-height: 1.2;
        font-family: var(--font-family);
        letter-spacing: var(--font-letter-spacing-headline);
      }
      ul {
        display: flex;
        position: relative;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--xs);
        li {
          a {
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
          }
        }
      }
    }
    .toc {
      grid-area: toc;
      .content {
        position: sticky;
        top: var(--l);
        strong {
          display: block;
          margin: 0 0 var(--m) 0;
          font-weight: 900;
          font-size: var(--font-l);
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
        }
      }
    }
    .tldr {
      grid-area: tldr;
    }
    .post {
      grid-area: post;
    }
    footer {
      grid-area: footer;
      border-radius: var(--border-radius);
      background: var(--c-surface);
      padding: var(--l);
      .author {
        text-align: center;
        a {
          font-weight: 900;
          font-size: var(--font-s);
          line-height: 1.2;
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
          text-decoration: none;
          &:hover {
            text-decoration: underline;
            text-decoration-thickness: var(--underline-thickness);
          }
        }
      }
    }
  }
</style>
