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
The posts will be linked here after they are published. Some of the posts might be quite small, as I prefer small focused posts if I have a problem I decided to still split them up.

1. **How to automate your podcast and everything around it**
2. [Detect changes in an RSS feed - on the basis of Anchor.fm]()
3. Update the podcast website - [GitHub](https://github.com/Techmob-Show/automation/tree/main/packages/update-website)*
4. [Generate podcast covers]()
5. [Automatically post pictures to Instagram with Playwright]()
6. Wire it all up - [GitHub](https://github.com/Techmob-Show/automation/tree/main/tasks/update-website-and-instagram)*
7. [My monorepo setup with Node.js, Lerna and Typescript]()
8. [How to deploy simple Node.js functions on Kubernetes]()

<small>*I won't write a post about this as it's pretty easy, checkout the repository and let me know if you have questions :)</small>

## How does it work?

![Sequence diagram](/posts/how-to-automate-your-podcast-and-everything-around/sequence.svg)

All actors are only loosely coupled components. If a new podcast episode is detected via the RSS feed from Anchor.fm (1) this information is used in all following steps (2). Persisting the episode is needed for building the website (3), but it could also directly fetch it from the RSS feed during the build step. Our website is a static build with Nuxt.js, for that a new build needs to be triggered after the data was updated (4). Finally, the podcast cover is generated (5) and published on Instagram (6). 

## The motivation

I have a passion for automating boring manual processes. I just need to upload and publish the finished edited episode along with the prepared title and description. After that everything will be handled automatically. If something is automated you can't forget about it! Which brings me to my next motivation: I'm lazy and forgetful. Which comes handy with this passion. Besides, that I also wanted to try something new: Typescript, Browser automation with Node.js & GitHub Actions. In the end I even learned more. And I definitely wouldn't learned it if I wouldn't like to automate stuff like this.


## Conclusion - would I do it again?

It was a lot of fun and I spend some time with a friend and learned a lot about Docker. Tried different setups with GitHub Actions: in one version the code was built and run inside the action and the other took a docker image which was published to Docker Hub via another action. Besides, that I learned how to setup a monorepo with TypeScript and lerna. Since Instagram doesn't give us access to there API I tried three different browser automation tools for node and found my new go to browser automation framework. More about the details in the corresponding articles.

Doing all of this manually would have been way faster. Without any doubt. I think overall I spend 20+ hours on this. I somehow can't believe it myself, but I might have refactored all of this three to four times, tried several deployment methods, tried different frameworks, set up a monorepo, had to use docker. As I'm not an expert in one of this fields I'm quite happy! 

I definitely would do it again! It was fun and maybe it helps someone else :)
