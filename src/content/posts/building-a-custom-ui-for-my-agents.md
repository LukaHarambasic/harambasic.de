---
title: Building a custom UI for my agents
description: Why I moved from Slack channels per agent to a custom chat interface, and what I got out of it.
image: TODO
published: 2026-06-22
updated: 2026-06-22
tags:
  - AI
  - Development
tldr: I built a custom UI for my NanoClaw agents after the Slack-per-channel model broke down. The result gives me transparency, extensibility, and a setup that fits my mental model.
discussion: https://www.linkedin.com/feed/update/urn:li:activity:7474759341280198656/
---

_Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7474759341280198656/)._

The [Assis](/posts/i-built-my-own-ai-assistant) setup started with a simple Slack workspace. A dedicated space where every agent had its own channel. Then I'd want two things from the same agent at the same time, and the whole model broke down.

So I built v1: a custom UI to interact via chat with the agents, not via a third-party app. But I still didn't really know what I wanted, and I adapted too much of the previous mental model into it.

When NanoClaw v2 came out I used the opportunity to start fresh with v2.

Three things I really like about where it landed:

1. **Transparency.** I can see every tool call, every scheduled task in a proper UI. Incredibly helpful for debugging.
2. **Extensibility.** It now also supports task management, note taking, transcripts, a lightweight CRM, time tracking, and custom in-chat components for things like tasks or transcripts.
3. **Personalized.** It fits my mental model exactly: how I want to interact with agents, which shortcuts to use, how fuzzy the search should be.

Did I check a single line of code? No. Did I rewrite the architecture and develop a clear mental model of what's happening under the hood? Yes.

Also feels good to build something scrappy for once: no user management (Tailscale handles access), no settings, no pressure to polish every pixel.
