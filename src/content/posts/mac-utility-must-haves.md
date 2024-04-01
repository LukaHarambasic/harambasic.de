---
title: Mac utility must haves
description: Explore my essential Mac utilities, including clipboard enhancements, window management, and more.
published: 2024-04-01
updated: 2024-04-01
tags:
  - macOS
  - Tools
tldr: A collection of the utilities I couldn't work without on my Mac. Copy the brew command if you aren't interested in the fluff.
discussion: TBD
---

## Motivation

Over the last few years, I have repeatedly recommended these utilities and shortcuts to friends. Most of them are in developer roles. I used them while coding a lot, but I also used them for pure design and university-related work. The recommendations are stable and versatile. As you'll see below, I currently work as a Product Manager; therefore, most examples focus on that task field. But you can make it your own.

If you are interested in a video walking you thorugh these tools I can recommend [Set up a Mac in 2024 for Power Users and Developers](https://www.youtube.com/watch?v=GK7zLYAXdDs) by [Syntax](https://syntax.fm/), which covers almost everything I describe here.

## The utilities

Every section will start with a bit of motivation of why I use it and then go over how I have set it up and how I use it.

### Screenshots to clipboard

▶︎ [macOS Screenshots](https://support.apple.com/en-us/102646)

I don't know how many screenshots I take per day. They have one thing in common: they are only temporarily relevant. If it needs to be persisted, I handle it differently (e.g., save a website as a PDF). And I don't need such temporary data on my desktop or saved somewhere else. I need it in my clipboard to paste it somewhere, e.g., E-Mail, Slack, or Figma. I can't remember in which macOS version Apple introduced the current screenshot solution, but that was the time I ditched the way more powerful [Snagit](https://www.techsmith.com/screen-capture.html) (I even paid for it). The built-in solution just works. But you need to set it up to do so.

![TODO](/posts/mac-utility-must-haves/apple_screenshots.png)

1. Open the *Screenshot* app.
2. Make sure one of the three buttons on the left is selected.
3. Click *Options* and select under *Save to Clipboard*.

From now on, you can take screenshots with __COMMAND + SHIFT + 4__, which will instantly be saved to your clipboard. You can then paste them as you normally would (__COMMAND + V__), making your workflow more efficient.

Also, an important remark: if you heavily rely on annotations, this might not be the best workflow for you. But if I need to annotate something, I just quickly paste it into Figma and add an arrow or box there.

---

### Clipboard history

▶︎ [Clipy](https://clipy-app.com/)

```bash
brew install --cask clipy
```

You might be asking yourself, what the hell is a clipboard manager? And I was like you, now I can't imagine my life without it. It allows you to access stuff you have been copying. This is helpful when you start doing something, need to jump on something else, copy stuff in between, and then need to continue what you didn't finish. With a clipboard manager, you still have all the things you copied previously accessible. Another use case is when I need to copy colors from one place to another, e.g., from a design file to my code editor; I only copy all the codes once and then paste them in whichever order I need them without switching back and forth between the applications. Windows has had it since Windows 10 was integrated, but Mac still misses this feature.

![TODO](/posts/mac-utility-must-haves/clipy.png)

After you install Clipy, you can use it via __SHIFT + COMMAND + C__. It's just one additional keystroke to what you are used to. It has many customization options, but I only changed a little. I make sure that there are already copied items visible without the need to navigate to a folder first (see screenshot). Therefore, you need to set the *Number of items placed inline* to a decent number, I have it at 10.

A nice side effect is that it cleans the styles of the copied text. For example, copying something from VSCode to Outlook normally takes all the styling. But I can't think of a use case where I want that. Maybe I want the hierarchy of the text but not the styling. Everything should be Markdown.

---

### Switching between windows

▶︎ [AltTab](https://alt-tab-macOS.netlify.app/)

```bash
brew install --cask alt-tab
```

AltTab solves one of my main problems with window switching on macOS: __COMMAND + TAB__ can't handle multiple instances of the same program. I tried multiple virtual desktops, switching between them with gestures, but this worked better with multiple monitors. Besides this benefit, AltTab adds more context to the open windows, a screenshot, and the instance's title.

![ALtTab cycling through multiple windows](/posts/mac-utility-must-haves/alttab.gif)

I highly recommend replacing the default __ALT + COMMAND__ with AltTab. After the installation, it will guide you through the process of replacing it. Below, you can see my *Appearance* settings. That is the outcome of trial and error. You can also turn off the screenshots in the preview.

![AlTab appearance of around 20 settings](/posts/mac-utility-must-haves/alttab_settings.png)

---

### Window management

▶︎ [Rectangle](https://rectangleapp.com/)

```bash
brew install --cask rectangle
```

After being able to switch between all the windows, they need to be organized. One goes to the left half, one to the right half. Another one needs to be maximized without going fullscreen - I don't like the macOS fullscreen and split mode.

![Rectangle resizing multiple windows by dragging them to the side of the screen](/posts/mac-utility-must-haves/rectangle.gif)

Therefore, you either use your mouse to drag a window into one of the hot areas (you can define them in the settings) or double-click the title bar to maximize a window. But I would encourage you to use the keyboard shortcuts. I tend to use the mouse, but I would love to get used to the shortcuts.

![Overview of the Rectangle shortcut settings](/posts/mac-utility-must-haves/rectangle_shortcuts.png)

---

### Better Spotlight

▶︎ [Raycast](https://www.raycast.com/)

```bash
brew install --cask raycast
```

Everything besides this point is something I would recommend to everyone who works on a Mac daily. Raycast is a little bit more nerdy but can also be useful for everyone else. But what is it even? It is an extensible version of the default macOS Spotlight, which is already awesome. But Raycast can do more.

![TODO](/posts/mac-utility-must-haves/raycast.gif)

I use it in some ways, like Spotlight, e.g., to open all my applications, do simple calculations, and make simple currency conversions. But Raycast allows me to install extensions or to use my scripts. One default extension is the emoji search; this gives me the same way to add emojis in every application. I don't need to consider whether I'm in Slack, Notion, Jira, or Gmail. Besides this, here is a short list of other extensions: 

- *Color Picker* - Pick a color everywhere and get the HEX code on your clipboard.
- *Todoist* - Create a task or search through all of them.
- *Shortcut* - Use your macOS/iOS shortcuts, I have some tiny automations I want to share between my Mac and my iPhone. Therefore, having a Shortcut instead of a bash script or something similar that only works on my Mac is easier.
- *Calendar* - See your next events and join calls.

I also use some custom commands for simple automations. For example, to open a specific website with some parameters, below is a simple example of a translation service. But as you can see, this is a bash script, so you can do whatever you want.

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

It also offers solutions for screenshots, clipboard management, and window management. But I don't use these; I use the solutions described above, but hey, maybe that's something for you.

## Useful shortcuts

I use shortcuts besides these utilities—besides copy and paste—on a daily basis. 

__CTRL + L__—In Notion and Figma (I don't know if there are others), it copies the URL of what you currently have open directly to your clipboard. Quickly share a Notion page via Slack or link a Figma screen in a Jira ticket.

__CTRL + K__—This opens a similar command palette like Spotlight/Raycast in multiple applications and websites (e.g., Jira, Figma, Notion, Slack) that lets you perform all kinds of tasks, depending on the application.

## Closing thoughts

Most of these tools have been shipped with Windows for years, which is strange because I need to go through all this every time I have to set up a new macOS. But thanks to Open Source solutions like [Clipy](https://opencollective.com/clipy#backer), [AltTab](https://www.patreon.com/lwouis), and [Rectangle](https://github.com/sponsors/rxhanson) macOS feels way more usable. So think about donating to them or using the other open-source solutions you use on a daily basis. And remember, besides monetary support, you also can contribute to the code base. 
