---
title: Close your laptop without killing your agent
description: How Agent of Empires fixed the persistent session problem when running Claude Code on a remote server.
image: TODO
published: 2026-06-04
updated: 2026-06-04
tags:
  - Tools
  - AI
tldr: Agent of Empires is a terminal UI that keeps your Claude Code sessions alive on a server so you can close your laptop without losing your work.
discussion: https://www.linkedin.com/feed/update/urn:li:activity:7468232596267675648/
---

_Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7468232596267675648/)._

You've probably seen the memes. People in the tech scene who can't close their laptops anymore because their beloved agent would stop working. I've been one of them.

I run Claude Code on a Ubuntu server (10-year-old MacBook). Works great, except the moment I close the SSH connection, the session dies. For me as a UI person that was a bit unexpected. I learned you can use tmux to keep sessions alive, and it technically works, but the UX is rough. I'm not someone who memorises 40 key combos by heart.

Then I found [Agent of Empires](https://github.com/nathanbrake/agent-of-empires) by Nathan Brake.

AOE is a terminal UI that lets you run multiple Claude Code sessions on a server, switch between them cleanly, and most importantly, close your laptop and have the sessions keep running. You come back, SSH in, pick up exactly where you left off. Like Conductor but for the terminal.

That's it. That's the whole thing. Simple, and it solves the exact problem I had.

Do you have any tools to share? Always looking for the next one.
