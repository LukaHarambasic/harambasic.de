---
title: Automatically generate social media images for Nuxt.js with a git pre-commit hook
description: Generate social media images for a nuxt/content project in a git pre-commit hook, this logic can be adapted to any other CMS.
publishedAt: 2021-07-18
categories:
    - Nuxt.js
    - Git
tldr: 'Playwright and husky are a perfect combination. Jump to <a href="https://harambasic.de/posts/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook#how-to-generate-the-images">this section</a> if you are only interested in the implementation without the bla bla.'
tweet: https://twitter.com/luka_harambasic/status/1416875811320307721
---

## Intro

For this website, I want to generate images for social media automatically every time I publish something new. The image for this post looks like this:

![Generated social media preview with the script in this post, it  shows the title of the post](/social/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook.png)

There is a Nuxt.js specific article using Cloudinary by [David Parks](https://davidparks.dev/blog/social-share-images-in-nuxt-content/) which is based on an article by [Jason Lengstrof](https://www.learnwithjason.dev/blog/auto-generate-social-image). I somehow like the idea, but for this website, I want as much control as possible and as few as possible external dependencies, especially on other servers.

With these requirements, I thought about the article by [Flavio Copes](https://flaviocopes.com/canvas-node-generate-image/)  which I used to generate Instagram posts for [Techmob Show](https://techmob.show). You can even get the package on npm - [@techmobshow/generate-podcast-cover](https://www.npmjs.com/package/@techmobshow/generate-podcast-cover). This uses [node-canvas](https://www.npmjs.com/package/canvas) which is okay, but I wouldn't use it again after a friend - [Timon Lukas](https://github.com/TimonLukas) - came up with the idea to use a browser automation tool. The problem with node-canvas are the dependencies, check out what [you have to install](https://github.com/Automattic/node-canvas#compiling). I had a conflict between a local and global version and I wasn't able to fix it. Also, I have to do the styling programmatically, and I even need to handle multi-line text, as it isn't working out of the box.

The final solution is based on [Playwright](https://playwright.dev/) which allows me to write and style a `template.html`, inject the title and take a screenshot. That's what I feel comfortable with and that's fun for me.

## How to generate the images

Nuxt.js has a strongly opinionated directory structure which I like, but somehow it felt wrong to put this script which runs only locally in assets. For that, I created a scripts directory (who knows what will be automated next) where all my node scripts will live which aren't part of the website build. This is important as these scripts aren't handled by Nuxt.js which uses webpack with babel. They are executed through Node.js which means you can't use `import X from 'x'`, but it also allows you to use `fs`, which means you can interact with the file system.

Let us come to the interesting part, for the sake of simplicity I'll put everything in one file and explain the automatic generation in detail. On my website I have three files to get this working:
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

I would say this code is quite self-explaining, but as I have spent some time with it, I might miss something. Feel free to get in touch on [Twitter](https://twitter.com/luka_harambasic) if you have any questions. However, I might not forget the appropriate [HTML template](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/template.html).

```html[template.html]
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

It's super simple, directly using Google Fonts with a [svg graphic as background](https://github.com/LukaHarambasic/harambasic.de/blob/main/scripts/generate-social-media-preview/template.svg). Thereby only the text has to be styled.

## Automation

As I'm forgetful I need to automate the generation. As titles of posts normally won't change this is a one-time job per post. Therefore, I won't want to generate this during the build step on Netlify. This step can happen locally, after a change, before I commit or push something. That's why I thought about a git pre-commit hook. Alternative a GitHub Action could be used which executes the same script and then commits the newly generated files. I stuck to the pre-commit hook for now, but with that, the odyssey began...

I looked in the native git pre-commit hook and I was able to execute the file, but somehow the image generation wasn't triggered. I had the same problem with [pre-commit](https://github.com/observing/pre-commit) and [husky](https://typicode.github.io/husky/#/). Nothing worked. So I wrote my first [Stackoverflow question](https://stackoverflow.com/questions/68153276/git-pre-commit-hook-isnt-executed/68169136#68169136) in a while and asked some friends, what they use and if they have an idea. The same friend who had the idea to use browser automation tools to generate the images also helped me here and found two tickets that Webstorm isn't working with git hooks ([this](https://youtrack.jetbrains.com/issue/IDEA-264817) and [this](https://youtrack.jetbrains.com/issue/IDEA-244581)). That explained why my script was never executed*. For now, I have to commit via command line and not via the Webstorm UI, but hey that is possible. During my research everybody recommended husky, so I tried it again and stuck to it. As the script was now executed the next problem occurred: newly generated files aren't committed. But Stackoverflow has already an [answer](https://stackoverflow.com/a/12802592/5438990) for this. You need a pre-commit and a post-commit hook, read more about this in the linked question. 

I only need to define a new script in my `package.json`. This will be executed in my `post-commit` hook and don't forget to also define a `pre-commit` hook.

```json[package.json]
{
  ...
  "scripts": {
    ...
    "socialMedia:auto": "node scripts/generate-social-media-preview/generateAutomatic.js",
    ...
  }
}
```

```bash[.husky/pre-commit]
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# https://stackoverflow.com/questions/3284292/can-a-git-hook-automatically-add-files-to-the-commit
touch .commit
exit
```

The new script is then called here `npm run socialMedia:auto`.

```bash[.husky/post-commit]
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# https://stackoverflow.com/questions/3284292/can-a-git-hook-automatically-add-files-to-the-commit
if [ -e .commit ]
    then
    rm .commit
    npm run socialMedia:auto
    git add .
    git commit --amend -C HEAD --no-verify
fi
exit
```

## Manual

For some pages, which are unique like home or imprint I also need images, but automating these would be a little bit overkill. The corresponding pages don't even have the required meta data, they could, but currently, they don't have. For that, I wanted a way to generate social media previews manually by passing in a title. 

```json[package.json]
{
  ...
  "scripts": {
    ...
    "socialMedia:manual": "node scripts/generate-social-media-preview/generateManual.js",
    ...
  }
}
```

You only need to add a script to your `package.json` and then parse the arguments to retrieve the title. 

```javascript
const title = process.argv[2].replace('--title=', '')
```

Finally, execute your new command with the according title. And yes somehow the `--` is needed, I just accepted it and didn't ask why.

```bash
npm run socialMedia:manual -- --title="Your preferred title"
```

## Conclusion

Webstorm does some strange things. I'm a big fan of the JetBrain IDEs but didn't consider that they would change the default behavior of git.* But in the end, it works quite well, I learned a lot and I'll consider husky also for some other projects. Playwright showed again why I fall in love with it and why I'll use it for every browser automation project I have. Finally, I also got an idea for another approach: GitHub Actions. But that's something for another post.

<small>*currently it's working with commits via the UI</small>