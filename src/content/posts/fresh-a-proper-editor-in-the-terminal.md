---
title: fresh - a proper editor inside the terminal
description: When you're running agents on a server, you need a real editor. fresh is a terminal IDE that actually feels like one.
image: TODO
published: 2026-06-05
updated: 2026-06-05
tags:
  - Tools
  - AI
tldr: fresh is a terminal IDE with a file explorer, fuzzy file finder, git diff, and LSP support. Actual editor feel, inside the terminal.
discussion: https://www.linkedin.com/feed/update/urn:li:activity:7468594982656905217/
---

_Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7468594982656905217/)._

Yesterday I wrote about [Agent of Empires](/posts/agent-of-empires-close-your-laptop), which handles the persistent session problem when running agents on a server. But there's another problem once you're in that setup: you also want to see what the agents are actually doing. Browse files, check folder structures, make a small edit.

AOE handles sessions well, but it's not an editor. I kept defaulting back to nano or just catting files in the terminal. Not great.

Then I found [fresh](https://github.com/nicholasgasior/fresh).

Terminal IDE with a file explorer, fuzzy file finder, git diff, and LSP support. Actual editor feel, inside the terminal. You can even click on the UI elements with the mouse.

I never expected to get a proper UI in the terminal. But here we are.

If you're running agents on a remote server, AOE keeps the sessions alive and fresh gives you something decent to work in when you need to poke around. Good combo.
