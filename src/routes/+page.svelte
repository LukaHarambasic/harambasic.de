<script lang="ts">
  import Icon from '@iconify/svelte'
  import BaseToClipboardButton from '$lib/components/Base/BaseToClipboardButton.svelte'
  import { getRandomItems } from '$lib/util/helper'
  import type { Project } from '$lib/types/project'
  import type { StackEntry } from '$lib/types/stackEntry'
  import type { Post } from '$lib/types/post'
  import type { PageData } from './$types'
  import type { Shareable } from '$lib/types/shareable'

  export let data: PageData
  const [posts] = data.posts
  const [projects] = data.projects
  const [stack] = data.stack
  const [shareables] = data.shareables

  const randomProjects: Project[] = getRandomItems(projects, 2)
  const randomStack: StackEntry[] = getRandomItems(stack, 3)
  const randomPosts: Post[] = getRandomItems(posts, 2)
  const randomShareables: Shareable[] = getRandomItems(shareables, 4)
</script>

<section class="heyho">
  <div class="inner">
    <img src="../profile.jpeg" alt="Profile of Luka Harambasic" class="profile" />
    <div class="content rich-text">
      <h2>Heyho, I'm Luka!</h2>
      <p>
        Simpler version, interstes and what I do, for more infos send to about page with a text and link to CV. <em>Pinnace</em> holystone
        mizzenmast <a>lorem ipsum</a> quarter crow's nest nipperkin grog yardarm hempen halter furl. Swab barque interloper chantey doubloon
        starboard.
      </p>
    </div>
  </div>
</section>
<section class="featured">
  <div class="posts group">
    <h3 class="section-label">
      <span>Posts</span>
      <Icon icon="ph:files-bold" />
    </h3>
    <ul>
      {#each randomPosts as post}
        <li>
          <a class="card text" href={post.relativePath}>
            <Icon icon="ph:arrow-circle-right-bold" />
            <strong>{post.title}</strong>
            <time class="date dt-published" datetime={post?.published?.raw?.toString()}>
              {post.published.display}
            </time>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="lists group">
    <h3 class="section-label">
      <span>Stack</span>
      <Icon icon="ph:clipboard-text-bold" />
    </h3>
    <ul>
      {#each randomStack as stackEntry}
        <li>
          <a class="card text" href={stackEntry.url}>
            <Icon icon="ph:arrow-square-out-bold" />
            <strong>{stackEntry.title}</strong>
            <p>{stackEntry.description}</p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="project group">
    <h3 class="section-label">
      <span>Projects</span>
      <Icon icon="ph:projector-screen-chart-bold" />
    </h3>
    <ul>
      {#each randomProjects as project}
        <li>
          <a class="card no-spacing image" href="/projects">
            <Icon icon="ph:arrow-circle-right-bold" />
            <!-- TODO ./../lib/images/projects/techmobshow.svg -->
            <img src="projects/{project.image}" alt={project.title} width="8rem" />
            <div class="content">
              <strong>{project.title}</strong>
              <p>{project.description}</p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="shareables group">
    <h3 class="section-label">
      <span>Shareables</span>
      <Icon icon="ph:share-bold" />
    </h3>
    <ul>
      {#each randomShareables as shareable}
        <li>
          <a class="card text" href={shareable.url}>
            <Icon icon="ph:arrow-square-out-bold" />
            <strong>{shareable.title}</strong>
            <time class="date dt-published" datetime={shareable?.published?.raw?.toString()}>
              {shareable.published.display}
            </time>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>
<section class="contact" id="contact">
  <div class="group">
    <div class="meta">
      <strong>E-Mail</strong>
      <small>luka@harambasic.de</small>
    </div>
    <div class="segmented-buttons">
      <a href="mailto:luka@harambasic.de" class="button">Write</a>
      <BaseToClipboardButton toClipboard="luka@harambasic.de">Copy</BaseToClipboardButton>
    </div>
  </div>
  <div class="group">
    <div class="meta">
      <strong>Platforms</strong>
      <small>Get in touch!</small>
    </div>
    <div class="segmented-buttons">
      <a href="https://TODO.com" class="button">Signal</a>
      <a href="https://www.linkedin.com/in/harambasic/" class="button">LinkedIn</a>
      <a href="https://github.com/LukaHarambasic" class="button">GitHub</a>
      <a href="https://mstdn.social/TODO" class="button">Mastodon</a>
    </div>
  </div>
  <div class="group">
    <div class="meta">
      <strong>Book a time</strong>
      <small>Wanna talk?</small>
    </div>
    <div class="segmented-buttons">
      <a href="https://cal.com/luhara/p" class="button">Book</a>
    </div>
  </div>
</section>

<style lang="postcss">
  .heyho {
    display: flex;
    position: relative;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    width: var(--layout-l);
    margin: var(--xl) 0;
    .inner {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: flex-end;
      gap: var(--l);
      .profile {
        size: 10rem;
        border-radius: var(--border-radius);
      }
      .content {
        h2 {
          margin: 0 0 0.5rem 0;
          font-weight: 900;
          font-size: var(--font-l);
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
        }
        p {
          font-weight: normal;
          line-height: 1.5;
        }
      }
    }
  }
  .featured {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    width: 100%;
    .group {
      position: relative;
      h3 {
        display: flex;
        position: absolute;
        top: 1.8rem;
        left: -11rem;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: flex-end;
        align-items: center;
        gap: 0.25rem;
        width: 10rem;
        height: 1.5rem;
        font-weight: 600;
        font-size: var(--font-m);
        font-family: var(--font-family);
        letter-spacing: var(--font-letter-spacing-headline);
        text-align: right;
        span {
          line-height: 1;
        }
        :global(svg) {
          size: 1.5rem;
        }
      }
      > ul {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
        gap: var(--l);
        > li {
          flex: 1 1 auto;
          &:first-child:nth-last-child(1),
          &:first-child:nth-last-child(1) ~ li {
            width: 100%;
          }
          &:first-child:nth-last-child(2),
          &:first-child:nth-last-child(2) ~ li {
            width: calc(100% / 2);
          }
          &:first-child:nth-last-child(3),
          &:first-child:nth-last-child(3) ~ li {
            width: calc(100% / 3);
          }
          &:first-child:nth-last-child(4),
          &:first-child:nth-last-child(4) ~ li {
            width: calc(100% / 4);
          }
          .card {
            display: block;
            position: relative;
            transition: var(--transition);
            border-radius: var(--border-radius);
            background: var(--c-surface);
            height: 100%;
            color: var(--c-font);
            text-decoration: none;
            &:hover {
              transform: scale(0.97);
              cursor: pointer;
              cursor: pointer;
              :global(svg) {
                opacity: 1;
              }
            }
            :global(svg) {
              size: var(--l);
              position: absolute;
              top: var(--m);
              right: calc((-1) * var(--m));
              opacity: 0;
              transition: var(--transition);
              border: 4px solid var(--c-light);
              border-radius: 100%;
              background: var(--c-light);
            }
            &.text {
              padding: var(--l);
            }
            &.image {
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-content: stretch;
              justify-content: flex-start;
              align-items: stretch;
              gap: 0;
              > img {
                border-radius: var(--border-radius) 0 0 var(--border-radius);
                aspect-ratio: 1 / 1;
                width: 12rem;
                height: 12rem;
              }
              > .content {
                padding: var(--l);
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-content: stretch;
                align-items: stretch;
              }
            }
          }
          > a {
            strong {
              display: block;
              font-weight: 900;
              font-size: var(--font-m);
              line-height: 1.2;
              font-family: var(--font-family);
              letter-spacing: var(--font-letter-spacing-headline);
            }
            time {
              display: inline-block;
              margin: 0 0 var(--xs) 0;
              font-weight: 400;
              font-size: var(--font-s);
              text-decoration: none;
              font-style: italic;
            }
            p,
            .description {
              margin: var(--xs) 0 0 0;
              line-height: 1.5;
              font-size: var(--font-m);
            }
          }
        }
      }
    }
  }
  .contact {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    width: var(--layout-m);
    margin: var(--xl) 0;
    .group {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--c-surface);
      padding: var(--l);
      .meta {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
        strong {
          margin: 0 0 var(--xs) 0;
          font-weight: 900;
          font-size: var(--font-m);
          line-height: 1.2;
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
        }
        small {
          font-size: var(--font-s);
        }
      }
    }
  }
</style>
