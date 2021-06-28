---
title: Generate social media images for Nuxt.js with pre-commit hook
description: TBD
publishedAt: 2999-12-30
tags:
- TBD
tldr: TBD
tweet: TBD
---

## What and why?

![Generated social media preview with the script in this post, it shows the title of the post](/social/generate-social-media-images-for-nuxt-with-pre-commit-hook.png)

- generate social media preview images for all pages
- found an article by [David Parks](https://davidparks.dev/blog/social-share-images-in-nuxt-content/) which is based on an article from [Jason Lengstrof](https://www.learnwithjason.dev/blog/auto-generate-social-image) but they use Cloudinary
- I want to generate this images locally and without third party dependencies, for another project I used this article by [Flavio Copes](https://flaviocopes.com/canvas-node-generate-image/) to generate images via node cnavas, but somehow this wasnt working on my machine and also it feels very hacky, multiline text support has to be implemented by yourself
- A friend recommended to me to use a browser automation tool so that I can easily design everything I need with HTML and CSS and in the end take just a screenshot

## How

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
