---
title: Build your custom search engine in your browser
description: I show you why custom search engines in your browser are a nice tool and how I use them.
image: /posts/custom-search-engines-in-your-browser/header.png
alt: Show the usage of a custom search engine with dict.cc on top of my website.
publishedAt: 2021-06-20
tags:
- Google Chrome
- Firefox
- Search engine
- Trick
tldr: In less than a minute you can set up custom search engines in your browser to speed up your day-to-day tasks.
tweet: https://twitter.com/luka_harambasic/status/1406703914045542405
---

A friend - [Sebastian Furkert](https://www.linkedin.com/in/sebastian-furkert/) - showed me this little trick during our studies. With this, you can build your own search engine. Okay, that might sound a little over the top, but basically, that's what you're doing. If you often search on the same websites this can save you a lot of time.

From my point of view, there are two use cases: search and find. I would define searching that you are open for the outcome and don't know what to expect. You want to find something if you are looking for something specific, something expected, something with an identifier.

There are many other ways how you can achieve this, but if you are signed-in in Chrome your search engines will be synced across multiple devices. You could use Keyboard Maestro (macOS) or Auto Hotkey (Window) to trigger something like this from everywhere.

## Examples

![GIF: Use custom search engine in Google Chrome](/posts/custom-search-engines-in-your-browser/usage.gif)

### Search

A selection of websites where you search. I use some of them almost daily and others are here to show you what's possible.

- Translation services
  - [dict.cc](https://www.dict.cc/)*
  - [DeepL](https://www.deepl.com/)*
- Documentations
  - [MDN Web Docs](https://developer.mozilla.org/en-US/)
  - [Android Developers](https://developer.android.com/)
- Misc
  - [GitHub](https://github.com/)
  - [Youtube](https://www.youtube.com/)
  
### Find

If you have a unique identifier you can find it. I don't even want to know how much time the Jira shortcut has saved me in the last year.

- Tickets/Issues
  - [Jira](https://www.atlassian.com/de/software/jira)*
  - [GitHub](https://github.com/)

<small>*I use these multiple times a week.</small>

## How to add a custom search engines

![GIF: Add a new custom search engine to Google Chrome](/posts/custom-search-engines-in-your-browser/add.gif)

1. Right-click in the URL bar (not sure how to name the thing where you put the URL)
2. Click on `Manage search engines...`
3. Click on `Add`
    1. Set a `Search engine` title, e.g. `GitHub`
    2. Set a `Keyword` to trigger your search engine, e.g. `gh`
    3. Set a `URL with %s in place of query` and replace the search term by `%s`
4. That's it!

You can use every website which reflects search results or identifiers in the URL. There are examples where you can't use this as the search is only an overlay and won't manipulate the URL, e.g. [https://vuejs.org/v2/guide/](https://vuejs.org/v2/guide/).

![Firefox search engine shortcuts](/posts/custom-search-engines-in-your-browser/firefox.png)

You can use the same concept on Firefox it's just called **Search Shortcuts**.
