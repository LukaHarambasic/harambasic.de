---
title: Automatically generate social media images for Nuxt.js with a git pre-commit hook
description: TBD
publishedAt: 2999-12-30
tags:
- TBD
tldr: TBD
tweet: TBD
---

## Intro

For this website I want to generate images for social media automatically everytime I publish something new. 

![Generated social media preview with the script in this post, it  shows the title of the post](/social/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook.png)

There is an Nuxt.js specific article using Cloudinary by [David Parks](https://davidparks.dev/blog/social-share-images-in-nuxt-content/) which is based on an article by [Jason Lengstrof](https://www.learnwithjason.dev/blog/auto-generate-social-image). I somehow like the idea, but for this website I want as much control as possible and as few as possible external dependencies, especially on other servers. However, I have to admit Davids way of including these images in the components is nice, but only possible due to Cloudinary.

With this requirements I thought about the article by [Flavio Copes](https://flaviocopes.com/canvas-node-generate-image/) which I used to generate Instagram posts for [Techmob Show](https://techmob.show). You can even get the package on npm - [@techmobshow/generate-podcast-cover](https://www.npmjs.com/package/@techmobshow/generate-podcast-cover). This uses [node-canvas](https://www.npmjs.com/package/canvas) which is okay, but I wouldn't use it again after a friend - [Timon Lukas]() - came up with the idea to use a browser automation tool. The problem about node-canvas is about the dependencies, checkout what [you have to install](https://github.com/Automattic/node-canvas#compiling) and somehow I had a conflict between a local and global version and I wasn't able to fix it. Also, I have to do the styling programmatically, and I even need to handle multi line text, it ins't working out of the box.

The final solution is based on [Playwright](https://playwright.dev/) which allows me to write and style a `template.html`, inject the title and take a screenshot. That's what I feel comfortable with and that's fun for me.


## How to generate the images

Nuxt.js has an strongly opinionated directory structure which I like, but somehow it felt wrong to put this script which runs only locally in assets. For that I created a scripts directory (who knows what will be automated next) where all my node scripts will live which aren't part of the website build.

- lives in a new folder called scripts as it is not part of the acutal website build
- get the files which needs generation, so I would call the dynamic content. For me that are my posts and lists.
- get required meta data -> don't have access to nuxt content -> manually getting the title and slug
- manipulate a html file as template, manipulate it with your dynamic date. I only use a title and take a screenshot

## Automation

- odysse, the same friend also helped me to get my head in the right direction. 
- I still think it is not very sustainable and performant that nuxt images are generated every time you run nuxt generate as the old images won't change.
- so I need to run this locally and the best idea I came up with were git hooks -> run my node script for every commit and only if there is a new file a new image will be generated
- tried pre-commit, husky, native hooks and somehow nothing worked -> here is why https://stackoverflow.com/a/68169136/5438990

## Manual

- For some pages, I would call them singeltons I don't have the required meta data so I also need to run them manually via the command line by passing in a custom title
- thats also why there is a utils file, if you don't need this you easily can keep all of this in one file
