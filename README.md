# Harambasic.de

## Goals

- [ ] Completly accessible
- [ ] Blazing fast - 100 Lighthouse score
- [ ] Build on web standards
- [ ] Use same URL structure as before
- [ ] Framework agnostic - no hard dependencies
- [ ] Tests: Unit & one E2E per main page
- [ ] Integration: Store data from the web (e.g. Toots, Twitter, GitHub, Spotify) in files in the repo
 
## Pages

- Index
    - Picture + Intro
    - 1 project
    - 3 posts
    - 1 list
    - Contact
- Projects
    - Galery / Slider
    - Linkable
- Resources
    - Overview: show every item
    - Filter per category
    - Sort
    - Categories
        - Development
        - Digital tools
        - Hardware
        - Snippets
        - Bookmarks
- Consumption
    - Podcasts
    - Youtube
    - Spotify
- Blog
    - Featured post
    - Filter per tag
    - Sort
- Guestbook
- Feed like on Polywork aka Changelog


## Good & not so good

## Good

* structure or the freedom to decide
* typescript integration, postcss integration > I think this might be vite under the hood
* complete control over dom, e.g. LayoutHead.astro
* easy to adjust meta data > DefaultLayout.astro
* astro-icon is a blast
* astro iamge exists and does an okay job

## In between

* JSX, still not a big fan, but it does it job

### Not so good

* astro image
    * whole path needs to be efined in frontmatter, cant assemble it on the go
    * picture cant handle svg, which could expected - but it just breaks without an error
    * not sure where to store files public vs assets/images
* interactivity
    * I want simple filtering, but this won't work with an .astro file without alpine.js
    * But for that simple task I don't want to include vue or similiar
* alpine.js integration
    * would be nice, but i dont like that is than globally available which is for me a little bit against the concept of astro
* accessing .glob outside of .astro files
* error messages are sometimes of > vite see issue
* not easy to set up eslint and prettier, need to check how it is done in the astro repo even if it is part of the docu why not an add command like for other libaries
* vs code auto complete always does the wrong stuff
* recursive component in astro doesnt seem to work, siwtched to svelte
