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
3. Click **Options** and select under **Save to** **Clipboard**.

From now on you can take screenshots with __COMMAND + SHIFT + 4__ and they will end up in your clipboard. You can just paste them how you normaly paste stuff (__COMMAND + V__).

Also an important remark: if you heavily relay on annotations this might not be the best workflow for you. But if I need to annotate something I just quickly paste it in Figma and add an arrow or box there.

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

After beeing able to switch between all the windows they need to be organised. One goes to the left half, one to the right half. Another one needs to be maximized without going fullscreen - I don't like the MacOs fullscreen and split mode.

![Rectangle resizing multiple windows by dragging them to the side of the screen](/posts/mac-utility-must-haves/rectangle.gif)

You therefore either use your mouse to drag a window in one of the hot areas (you can define them in the settings) or to maximize a window you can double click the title bar. But I would encourage you to use the key board shortcuts. I tend to use the mouse, but would love to get used to the shortcuts.

![Overview of the Rectangle shortcut settings](/posts/mac-utility-must-haves/rectangle_shortcuts.png)

---

### Better Spotlight

▶︎ [Raycast](https://www.raycast.com/)

```bash
brew install --cask raycast
```

Everything besides this point is something I would recommend everyone who works on a daily basis on a Mac. Raycast is a little bit more nerdy, but also can be useful for everyone else. But wat is it even? It is an extensible version of the default MacOs Spotlight, which is alrady awesome. But Raycast can just do more.

![TODO](/posts/mac-utility-must-haves/raycast.gif)

I use it in some ways like Spotlight, e.g. to open all my applications, do do simple calculations and simple currency conversions. But Raycast allows me to install extensions or to use my own scripts. One defautl extension is the emoji search, this givs me the same way how to add emojis in every application, I don't need to think about if I'm in Slack, Notion, Jira or Gmail. Besides this here is a short list of other extensions: 

- _Color Picker_ - pick a color everywere and get the HEX code on your clipboard
- _Todoist_ - create a task or search thorugh all of them
- _Shortcut_ - use your MacOs/iOS shortcuts, I have some tiny automations I want to share between my Mac and my iPhone, therefore it's easier to have a Shortcut instead of a bash script or similiar that would only work on my Mac

I also use some custom commands for simple automations. For example to open a specfic website with some paramters, below you can see a super simple example for a translation service. But as you can see this is a bash script, so you can do whatever you want.

```bash
#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title DeepL
# @raycast.mode silent

# Optional parameters:
# @raycast.icon images/deepl.png
# @raycast.argument1 { "type": "text", "placeholder": "From", "percentEncoded": true }
# @raycast.argument2 { "type": "text", "placeholder": "To", "percentEncoded": true }
# @raycast.argument3 { "type": "text", "placeholder": "Text", "percentEncoded": true }
# @raycast.packageName Translations

# Documentation:
# @raycast.description Open DeepL
# @raycast.author Luka Harambasic
# @raycast.authorURL https://harambasic.de

# From & to are the typical language codes, like en, de, da etc.
open "https://www.deepl.com/translator#/$1/$2/$3"
```

![TODO](/posts/mac-utility-must-haves/raycast_deepl.png)

It also offers solutions for screenshots, clipboard management and window management. But I don't use these, I use the solutions described above, but hey maybe that's something for you.

## Useful shortcuts

Besides these utilities there are also to shortcuts - besides copy and paste - I use on a daily basis. 

__CTRL + L__ - In Notion and Figma (don't know if there are others) it copies the URL of what you currently have open directly to your clipboard. Quickly share a Notion page via Slack or link a Figma screen in a Jira ticket.

__CTRL + K__ - This opens in multiple applications and website (e.g. Jira, Figma, Notion, Slack) a similiar command palet like Spotlight/Raycast that let's, depending on the application, perform you all kind of tasks.

## Closing thoughts

Most of these tools are shipped with Windows since years which is kind of strange that I need to go thorugh all of this every time I have to set up a new MacOs. But thanks to Open Source solutions like [Clipy](https://opencollective.com/clipy#backer), [AltTab](https://www.patreon.com/lwouis) and [Rectangle](https://github.com/sponsors/rxhanson) MacOs feels way more usable. So maybe think about donating to them or the other Open Source solutions you use on a daily basis. And don't forget besides monetary support you also can contribute to the code base. 

**Sources**

Screenshot bar: By Apple as I can't take a screenshot of the screenshot tool.
