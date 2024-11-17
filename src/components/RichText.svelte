<script lang="ts">
  let { children } = $props<{
    children: () => any
  }>()
</script>

<div class="rich-text">
  {@render children()}
</div>

<style lang="postcss">
  :global(.rich-text) {
    line-height: 1.75;

    /* Apply styles to all descendants */
    :global(*) {
      overflow-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
    }

    /* Image styles */
    :global(img) {
      max-width: 100%;
      height: auto;
      object-fit: contain;
      border-radius: var(--border-radius);
    }

    /* Heading styles */
    :global(h2) {
      margin: var(--xl) 0 var(--m) 0;
      width: 30ch;
      font-weight: 900;
      font-size: var(--font-xl);
      line-height: 1.2;
      font-family: var(--font-family);
      letter-spacing: var(--font-letter-spacing-headline);

      @media screen and (max-width: 28rem) {
        width: 100%;
      }

      &:first-of-type {
        margin: 0 0 var(--m) 0;
      }
    }

    :global(h3) {
      margin: var(--l) 0 var(--m) 0;
      width: 30ch;
      font-weight: 900;
      font-size: var(--font-l);
      line-height: 1.2;
      font-family: var(--font-family);
      letter-spacing: var(--font-letter-spacing-headline);

      @media screen and (max-width: 30rem) {
        width: 100%;
      }
    }

    /* Paragraph and list styles */
    > :global(p) {
      margin-bottom: var(--l);

      &:last-child {
        margin-bottom: 0;
      }
    }

    > :global(ul) {
      margin-bottom: var(--l);

      &:last-child {
        margin-bottom: 0;
      }
    }

    > :global(ol) {
      margin-bottom: var(--l);

      &:last-child {
        margin-bottom: 0;
      }
    }

    > :global(blockquote) {
      margin-bottom: var(--l);

      &:last-child {
        margin-bottom: 0;
      }
    }

    /* Horizontal rule */
    :global(hr) {
      border: none;
      height: 2px;
      border-radius: 10rem;
      background: var(--c-surface-accent);
      margin: var(--l) 0;
    }

    /* Anchor styles */
    :global(a) {
      color: var(--c-font);
      text-decoration: underline;
      text-decoration-thickness: var(--underline-thickness);

      &:hover {
        text-decoration: none;
      }
    }

    /* Strong and emphasis */
    :global(strong) {
      font-weight: 900;
    }

    :global(em) {
      font-style: italic;
    }

    /* List styles */
    > :global(ul),
    > :global(ol) {
      margin: var(--l) 0 var(--l) var(--l);
      width: 50ch;

      @media screen and (max-width: 50rem) {
        width: calc(100% - var(--l));
      }

      /* Nested lists */
      :global(ul),
      :global(ol) {
        margin: 0 0 0 var(--l);
      }

      :global(li) {
        margin: var(--xs) 0 0 0;
      }
    }

    :global(ul) {
      list-style: disc;
    }

    :global(ol) {
      list-style: decimal;
    }

    /* Blockquote styles */
    :global(blockquote) {
      border-radius: var(--border-radius);
      background: var(--c-surface);
      padding: var(--l);

      :global(p):last-of-type {
        margin: 0;
      }
    }
  }
</style>
