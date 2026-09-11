---
title: I built my own AI assistant
description: Not one general AI. Nine specialized agents, self-hosted on an old MacBook, sharing a memory store.
image: TODO
published: 2026-06-16
updated: 2026-06-16
tags:
  - AI
  - Development
tldr: Assis is my personal AI setup - nine specialized agents in their own containers on a self-hosted server, built on NanoClaw, sharing a single memory store.
discussion: https://www.linkedin.com/feed/update/urn:li:activity:7472585062664925186/
---

_Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7472585062664925186/)._

Over the last few months I built my own AI assistant. Called it Assis.

Not one general AI. Nine specialized agents, each in its own container on a self-hosted server (10-year-old MacBook Pro). Using [NanoClaw](https://nanoclaw.dev) under the hood.

Each agent has a specific job. "brand" helps me remember ideas for posts and acts as a copywriter. "biz" handles consulting invoices and compliance. "proj-meyster" commits code and researches competitors. "life" reads my calendar and messages. "nano" is the general one, the one I talk to most.

They share a memory store. Every fact one agent learns about me is readable by all the others. The system gets (hopefully) a little smarter over time.

The UI is now at v2 and keeps growing. I started with my own Slack workspace where every agent had their own channel, but that model breaks down when you want two things from the same agent around the same time.

Coming up: the orchestration layer, scheduling, notes, kanban, transcription, time tracking, tools (CLI, MCP), a lightweight CRM and more.

What would you want to read about first?
