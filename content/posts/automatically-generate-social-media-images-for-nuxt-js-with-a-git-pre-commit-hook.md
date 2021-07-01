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

Nuxt.js has a strongly opinionated directory structure which I like, but somehow it felt wrong to put this script which runs only locally in assets. For that I created a scripts directory (who knows what will be automated next) where all my node scripts will live which aren't part of the website build. This is important as these scripts aren't handled by Nuxt.js which uses webpack with babel. They are executed thorough Node.js which means you can't use `import X from 'x'`, but it also allows you to use `fs`, which means you can interact with the file system.

But let us come to the interesting part, for the sake of simplicity I'll put everything in one file and explain the automatic generation in detail. On my website I have three files to get this working:
1. [util.js](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/util.js) - shared logic
2. [generateAutomatic.js](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/generateAutomatic.js) - automatic image generation for new posts and lists
3. [generateManual.js](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/generateManual.js) - manual image generation by passing a title via the command line

```javascript
const { readdirSync, readFileSync } = require('fs')
const { chromium } = require('playwright')
const path = require('path')

const ROOT_PATH = process.cwd()
const SOCIAL_PATH = `${ROOT_PATH}/static/social`
const POSTS_PATH = `${ROOT_PATH}/content/posts`
const LISTS_PATH = `${ROOT_PATH}/content/lists`

/*
 * Opens an HTML template, sets the title, takes a screenshot and saves it locally as png
 * @param {Page} page
 * @param {string} title
 * @param {string} slug
 */
const generateImage = async (page, title, slug) => {
  const URL = `file:///${path.join(__dirname, '/template.html')}`
  const SCREENSHOT_PATH = `${SOCIAL_PATH}/${slug}.png`
  await page.goto(URL)
  // strange syntax, check https://playwright.dev/docs/api/class-page#page-eval-on-selector for more infos
  await page.$eval('.title', (el, title) => (el.textContent = title), title)
  const cardHandle = await page.$('.card')
  await cardHandle.screenshot({
    type: 'png',
    path: SCREENSHOT_PATH,
  })
}

/*
 * Returns if there is an image for the given slug
 * @param {string} slug
 * @returns {boolean}
 */
const doesImageAlreadyExist = (slug) => {
  const files = readdirSync(SOCIAL_PATH)
  return files.find((file) => file.startsWith(slug))
}

/*
 * Posts and lists contain a title followed by a description in YAML
 * @nuxt/content isn't accessible so this has to be parsed manually
 * Returns the extracted title
 * @param {string} str
 * @returns {string}
 */
const getTitle = (str) => {
  const start = 'title: '
  const end = '\ndescription: '
  return str.substring(str.indexOf(start) + start.length, str.indexOf(end))
}

/*
 * Returns meta data to a given file
 * @params {string} name
 * @params {string} basePath
 * @returns {{name|string,path|string,slug|string}} // not sure how to do this object syntax without defining a type
 */
const fileToMeta = (name, basePath) => {
  return {
    name,
    path: `${basePath}/${name}`,
    slug: name.split('.')[0],
  }
}

/*
 * Instantiate a new browser with playwright, get all potential files (lists, posts)
 * and check if there is already a social media preview image in SOCIAL_PATH
 * if not execute generateImage(), nothing will be returned
 */
const generateSocialMediaPreview = async () => {
  console.log('>> GENERATE SOCIAL MEDIA PREVIEWS <<')
  console.log('🆕 newly generated, 🛑 already exists')
  console.log('-------------------------------------')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const posts = readdirSync(POSTS_PATH).map((name) =>
    fileToMeta(name, POSTS_PATH)
  )
  const lists = readdirSync(LISTS_PATH).map((name) =>
    fileToMeta(name, LISTS_PATH)
  )
  const files = [...posts, ...lists]
  for (const file of files) {
    const content = readFileSync(file.path, 'utf8')
    const title = getTitle(content)
    if (!doesImageAlreadyExist(file.slug)) {
      console.log('🆕', title)
      await generateImage(page, title, file.slug)
    } else {
      console.log('🛑', title)
    }
  }
  await browser.close()
}

/*
 * Entry point for generateSocialMediaPreview() when this file is executed
 */
;(async () => {
  try {
    await generateSocialMediaPreview()
  } catch (error) {
    console.log('Error:', error)
  }
})()
```

I would say this code is quite self explaining, but as I have spent some time with it, I might miss something. Feel free to get in touch on [Twitter](https://twitter.com/luka_harambasic) if you have any questions. But I still need you to show the corresponding [HTML template](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/template.html).

```html
<!DOCTYPE>
<html lang="en">
    <head>
        <title>Hello</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap" rel="stylesheet">
        <style>
            * {box-sizing: border-box;}
            body {font-family: Open Sans, Helvetica Neue, Arial, sans-serif; color: #121218;}
            .card {width: 1200px; height: 630px; background: url("./template.svg") no-repeat; padding: 5rem;}
            .title {font-size: 5rem; font-weight: bold;}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="title">Will be replaced! Wuhu! Party :)</div>
        </div>
    </body>
</html>
```

It's super simple, directly using Google Fonts with a [svg graphic as background](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/template.svg). Thereby only the font has to be styled.

## Automation

- odysse, the same friend also helped me to get my head in the right direction. 
- I still think it is not very sustainable and performant that nuxt images are generated every time you run nuxt generate as the old images won't change.
- so I need to run this locally and the best idea I came up with were git hooks -> run my node script for every commit and only if there is a new file a new image will be generated
- tried pre-commit, husky, native hooks and somehow nothing worked -> here is why https://stackoverflow.com/a/68169136/5438990

## Manual

- For some pages, I would call them singeltons I don't have the required meta data so I also need to run them manually via the command line by passing in a custom title
- thats also why there is a utils file, if you don't need this you easily can keep all of this in one file
