---
title: Mac utility must haves
description: TBD
image: TODO
published: 2999-12-09
updated: 2999-12-09
tags:
  - TBD
tldr: A collection of the utilities I couldn't work with on my Mac. Copy brew command if not interested in the fluff.
discussion: TBD
---

## Motivation

Over the last view years I recommended these utilities to firends and some even come back after months/years and thank me for that. Why not write them down, adjust it over time and share it with everyone. I won't do this for all of the stuff I use, but if you want to see more check out my [stack](/stack).

## The utilities

Every section will start with a little motivation of why I use it and than goes over to how I have set it up and how I use it.

### Screenshots to clipboard

▶︎ [MacOs Screenshots](https://support.apple.com/en-us/102646)

I don't know how may screenshots I take per day. They have one thing in common, they are only temporarely relevant. If it is something that that needs to be persisted I handle it differently (e.g. save a website as a PDF). And I don't need such temporary data on my desktop or saved somewhere else. I need it in my clipboard to paste it somehwere, e.g. E-Mail, Slack or Figma. I can't remember in which MacOs version Apple introduced the current screenshot solution, but that was the time I ditched the way more powerful [Snagit](https://www.techsmith.com/screen-capture.html) (I even paid for it). The build-in solution just works. But you need to set it up to do so.

![TODO](/posts/mac-utility-must-haves/apple_screenshots.png)

1. Open the **Screenshot** app.
2. Make sure one of the three buttons on the left is selected.
3. Click **Options** and select **Clipboard** under **Save to**.

And from now on all your screenshots will be in your clipboard. You can just paste them how you normaly paste stuff.

Also an important remark: if you heavily relay on annotations this might not be the best workflow for you. But If I need to add something I just quickly paste it in Figma and add an arrow or box there.

---

### Clipboard history

▶︎ [Clipy](https://clipy-app.com/)

```bash
brew install --cask clipy
```

You might be asking yourself, what the hell is a clipboard manager. And I was like you, now I can't imagine my life without it. It allows you to access stuff you have been copying. This is helpful when you start doing something, need to jump on something else copy stuff in between and than need to continue what you didn't finish. With a clipboard manager you still have all the things you copied previously accessible. Another use case is when I need to copy colors form one place to another, e.g. from a desing file to code, I than only copy all the codes once and than paste them in which ever order I need tehm wihtout switchign back and forth between the application. Windows has it since Windows 10 integrated, but Mac still misses this feature.

![TODO](/posts/mac-utility-must-haves/clipy.png)

TODO: Maybe gif?

After you installed Clipy you can use it via **SHIFT + COMMAND + C**. It's just one additional key stroke to what you are used. It comes with a lot of options to customize, but I don't change a lot. I just make sure that there are already copy items visible without the need to navigate to a folder first (see screenshot). Therefore you need to set the _Number of items place inline_ to a decent numnber, I have it at 10.

A nice sideeffect is also that it cleans the styles of the copied text, e.g. copying something from VSCode to Outlook normally takes all the styling. But I can't think about a usecase where I want that. Maybe the hierarchy of the text but not the styling. Everything should jsut be Markdown.

---

### Switching between windows

▶︎ [AltTab](https://alt-tab-macos.netlify.app/)

```bash
brew install --cask alt-tab
```

like windows, mutliple instances of the same program

---

### Window management

▶︎ [Rectangle](https://rectangleapp.com/)

```bash
brew install --cask rectangle
```

shortcuts but i use it mainly for tha snapping with the mouse and full screen when double clicking title

---

### Better Spotlight

▶︎ [Raycast](https://www.raycast.com/)

```bash
brew install --cask raycast
```

nerdy, but also something for everyone

- opening applications
- doing calculations
- currency calculations
- emoji search

and a lot of other thigns via plugins

but you also can trigger apple shortcuts, so you can build with the nice apple ui automations that you than easily can trigger from there

dont use clipboard and screenshots

## Closing thoughts

open source, donate, support

**Sources**

- Screenshot bar: By Apple as I can't take a screenshot of the screenshot tool.
