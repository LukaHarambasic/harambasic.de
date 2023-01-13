<header>
  <div class="logo">
    <a href="/">Luka Harambasic</a>
  </div>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/projects">Projects</a></li>
      <li><a href="/bookmarks">Bookmarks</a></li>
      <li><a href="/posts">Posts</a></li>
    </ul>
  </nav>
</header>

<style lang="postcss">
  header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: space-between;
    align-items: flex-start;
  }
  .logo {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    gap: var(--m);
    img {
      size: var(--l);
    }
    a {
      color: var(--c-font);
      font-weight: 900;
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
  nav {
    ul {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: flex-start;
      gap: var(--m);
      li {
        a {
          color: var(--c-font);
          font-weight: 600;
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
    }
  }
</style>
