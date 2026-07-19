---
title: Beautiful websites for almost free with Lovable
description: How I build small websites for friends, family, and side projects with Lovable, Netlify, and a bit of Claude Code polish.
image: TODO
published: 2026-07-19
updated: 2026-07-19
tags:
  - Tools
  - Development
tldr: "For simple websites the fastest path I have found: prompt it in Lovable, deploy the exported code to Netlify, then use Claude Code (or similar) for the small tweaks Lovable can't quite nail. The whole stack costs about as much as the domain."
---

## Motivation

I keep getting asked the same question by friends and family: "I need a small website, what do I do?" Sometimes it's for a portfolio, sometimes for a family business, sometimes for a side project. Almost never is it a case where a full CMS, a design system, or a proper agency budget makes sense. What they actually want is a few nice pages that load fast, look good on mobile, and don't cost anything to keep running.

Over the last year I have landed on a stack that fits that shape almost perfectly. It's boring, it's cheap, and the output is honestly better than a lot of what you get from freelancers charging four figures. I want to write it down here so I can stop explaining it in DMs.

## The stack

The three pieces are:

1. **Lovable** for generating the site.
2. **Netlify** for hosting.
3. **Claude Code** (or Cursor, or whatever you like) for the small edits Lovable is bad at.

That's it. No CMS, no framework decisions, no design system meeting. You prompt, you deploy, you tweak.

## Step 1: Prompt it in Lovable

[Lovable](https://lovable.dev) generates a React site from a text prompt. You describe what you want, it produces the code and a live preview, you iterate.

The trick to getting a good result is being specific about the parts a designer would think about. Instead of "a website for a construction company", give it:

- The name and one sentence about what the company does.
- A rough sitemap. "Home, services, projects, contact." That's enough.
- A vibe or references. "Feels like a small Copenhagen architecture studio. Warm, off-white, serif headings, one accent color."
- Content, even if it's a placeholder. Real names, real service descriptions, a real address. Lovable-generated lorem ipsum is worse than your own draft.

You iterate the same way you'd give feedback to a designer. "The hero is too tall, cut it in half." "Change the accent to a deeper red." "Add a section between services and contact that lists past projects with a photo grid." It picks up small changes quickly and doesn't lose the rest of the site.

Here are a few examples I built exactly this way:

- [meyster.work](https://meyster.work), for a friend running workshops.
- [adiadi.art](https://adiadi.art), for the artist Adina.
- [ivo-bau.de](https://ivo-bau.de), my father's construction business.
- [zimmer-ludwigshafen.com](https://zimmer-ludwigshafen.com), a small carpentry shop.

Each of them took a couple of hours in Lovable, plus a bit of tweaking afterwards. None of them cost more than the domain.

## Step 2: Ship it via Netlify

Lovable can host the preview for you, but the moment you want a real domain and a proper deployment story, export the code and put it on [Netlify](https://netlify.com). Lovable has a GitHub integration that pushes the project to a repo, and Netlify has a one-click "deploy from GitHub" flow. You connect them once, point your domain at Netlify, and every future change deploys automatically.

Why Netlify and not Lovable's own hosting:

- You own the code. If Lovable changes pricing or disappears, you still have a working site.
- Custom domains and DNS are boring and reliable.
- The free tier is generous enough that none of the sites above pay for hosting.
- You get a proper CI/CD pipeline for free, which matters the moment you want to make changes without going back through Lovable.

The only recurring cost is the domain. Everything else fits in the free tier.

## Step 3: Tweak with Claude Code

Lovable is amazing at getting you 90% of the way. The last 10% is where it struggles: pixel-level layout fixes, cross-browser quirks, adding an obscure meta tag for a specific platform, tightening the tailwind config, wiring up a contact form endpoint. Anything that needs precision rather than generation.

That's where I switch to [Claude Code](https://claude.com/code). I clone the repo, open it locally, and describe the change. "The mobile nav overlaps the logo, fix it." "The og:image is wrong, generate a proper one and wire it up." "Add a favicon based on the logo." It handles the diff, I check it in the browser, I push. Netlify redeploys within a minute.

You could use Cursor, or Zed, or plain Copilot. The point is that once the code is in a real repo, you have all the normal engineering tools available, and small edits stop being scary.

## The one exception: harambasic.de

I want to be clear about one thing: this stack is for **simple websites**. Marketing pages, small business sites, portfolios, side projects. Anything where the content is fairly static and the number of pages is small.

For my own site, [harambasic.de](https://harambasic.de), I did the opposite. I designed the CI identity by hand, wrote the code from scratch, and then rewrote the whole thing in [Astro](https://astro.build). That's a very different project. It's a long-lived personal home, I care about every detail, and I want the freedom to add whatever weird content type I come up with next. Lovable would have gotten me somewhere fast, but not somewhere I'd want to live in for years.

The rule of thumb I keep coming back to: if the site is going to change less than once a month and has fewer than ten pages, Lovable + Netlify + Claude Code is unbeatable on price and speed. Anything more ambitious, pick a real framework.

## Conclusion

If someone in your life needs a small website, don't send them to a builder like Wix or Squarespace, and definitely don't tell them to hire a freelancer for something a weekend can solve. Sit down with them, prompt the site in Lovable, deploy it to Netlify, and use Claude Code to fix the last few things. Total cost: one domain. Total time: an afternoon.

That's a lot of value for very little effort. It's also the first time in years I feel comfortable saying yes when someone asks me to help them get online.
