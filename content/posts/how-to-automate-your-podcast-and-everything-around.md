---
title: How to automate your podcast and everything around it #nodejs #typescript
description: TBD
image: /posts/how-to-automate-your-podcast-and-everything-around/tbd.png
alt: TBD
publishedAt: 3000-01-30
tags:
- Podcast
- Automate
tldr: TBD
tweet: TBD
---

Together with two friends I'm hosting the podcast: [Techmob Show](https://techmob.show). As a developer I'm lazy, and I love to automate stuff. This post is about the general motivation behind all of this, and the kick off for all small series. Most of the following steps are worth an article while some others aren't.
The posts will be linked here after they are published.

1. How to automate your podcast and everything around it (this post)
2. Detect changes in an RSS feed - on the basis of Anchor.fm
3. Update the podcast website - [GitHub](https://github.com/Techmob-Show/automation/tree/main/packages/update-website)*
4. Generate podcast covers
5. Automatically post pictures to Instagram with Playwright
6. Wire it all up - [GitHub](https://github.com/Techmob-Show/automation/tree/main/tasks/update-website-and-instagram)*
7. My monorepo setup with Node.js, Lerna and Typescript
8. How to deploy simple Node.js functions on Kubernetes


<small>*I won't write a post about this as it's pretty easy, checkout the repository and let me know if you have questions :)</small>

## How does it work?

![Sequence diagram](/posts/how-to-automate-your-podcast-and-everything-around/sequence.svg)

All actors are only loosely coupled components. If a new podcast episode is detected via the RSS feed from Anchor.fm (1) this information is used in all following steps (2). Persisting the episode is needed for building the website (3), but it could also directly fetch it from the RSS feed during the build step, I might change this. Our website is a static build with Nuxt.js, for that a new build needs to be triggered after the data was updated (4). Finally, the podcast cover is generated (5) and published on Instagram (6).

## My motivation

- I love to automate stuff
- Learn something new: Docker, GitHub Actions, TypeScript, Monorepo
- I'm lazy

## Conclusion - would I do it again?

- it's fun 
- could to it 1000times before this automation is faster

<base-callout>TBD</base-callout>

<base-thanks>TBD</base-thanks>
