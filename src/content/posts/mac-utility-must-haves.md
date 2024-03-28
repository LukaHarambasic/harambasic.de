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

Over the last view years I recommended these utilities and shortcuts to firends. Why not write them down? Adjust it over time and share it with everyone. Checkout what else I use: [Uses](/uses)

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

After you installed Clipy you can use it via **SHIFT + COMMAND + C**. It's just one additional key stroke to what you are used. It comes with a lot of options to customize, but I don't change a lot. I just make sure that there are already copy items visible without the need to navigate to a folder first (see screenshot). Therefore you need to set the _Number of items place inline_ to a decent numnber, I have it at 10.

A nice sideeffect is also that it cleans the styles of the copied text, e.g. copying something from VSCode to Outlook normally takes all the styling. But I can't think about a usecase where I want that. Maybe the hierarchy of the text but not the styling. Everything should be Markdown.

---

### Switching between windows

▶︎ [AltTab](https://alt-tab-macos.netlify.app/)

```bash
brew install --cask alt-tab
```

AltTab solves one of my main problems with window switching on MacOs: **COMMAND + TAB** can't handle multiple instances of the same program. I tried multiple virtual desktops switching between them with gestures. But this didn't work that well with multiple monitors. Besides this benefit AltTab also adds more context to the open windows, a screenshot and the title of the instance.

![ALtTab cycling through multiple windows](/posts/mac-utility-must-haves/alttab.gif)

I highly recommend to just replace the default **ALT + COMMAND** with AltTab. It will guide you after the installation how to do so. And than you can customize it, below you can see my _Appearance_ settings. That is the outcome of trial and error. You also could disable the screenshots in the preview if you prefer that.

![AlTab appearance of around 20 settings](/posts/mac-utility-must-haves/alttab_settings.png)

---

### Window management

▶︎ [Rectangle](https://rectangleapp.com/)

```bash
brew install --cask rectangle
```


shortcuts but i use it mainly for tha snapping with the mouse and full screen when double clicking title

After beeing able to switch between all the windows they need to be organised. One goes to the left half, one to the right half. Another one needs to be maximized without going fullscreen - I don't like the MacOs fullscreen and split mode.

![Rectangle resizing multiple windows by dragging them to the side of the screen](/posts/mac-utility-must-haves/rectangle.gif)

You therefore either use your mouse to drag a window in one of the hot areas (you can define them in the settings) or you can use the key board shortcuts. I tend to use the mouse, but would love to get used to the shortcuts.

![Overview of the Rectangle shortcut settings](/posts/mac-utility-must-haves/rectangle_shortcuts.png)

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

## Useful shortcuts

CTRL + L - copy links

CTRL + K - open a command palet like raycast in other apps

## Closing thoughts

open source, donate, support

- you might quesiton why i still use macos after all

**Sources**

- Screenshot bar: By Apple as I can't take a screenshot of the screenshot tool.
