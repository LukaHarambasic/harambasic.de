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

I get asked the same thing a lot by friends and family: they need a small website, ideally one they can edit themselves later without asking me every time. For a while my answer was "just use Wix or Squarespace." Honest and useful, but for a private person offering their services with no revenue coming in yet, 15 or 20 euros a month feels like a lot. WordPress was the other option, but either you pay a managed host around the same, or you figure out how to run it yourself. None of it felt great.

That answer changed for me recently. Two versions of it work now, both a lot nicer than the old builders:

1. **Just pay Lovable** (around €25/month) and get the site, hosting, domain, and ongoing edits in one place. No hassle, and honestly a much nicer answer than Wix or Squarespace, which feel really old school next to what Lovable produces.
2. **Wire together a workflow** where the only recurring cost is the domain, using tools you probably already have.

This post is about the second one, because it's what I actually use now. If you already have a Claude Code subscription and a GitHub account, this is basically free.

## The stack

The four pieces are:

1. **Lovable** for generating the site.
2. **GitHub** as the source of truth for the code.
3. **Netlify** for hosting and the domain.
4. **Claude Code** (or Cursor, or whatever you like) for the small edits Lovable is bad at.

That's it. No CMS, no framework decisions, no design system meeting. You prompt, you push, you deploy, you tweak.

## Step 1: Prompt it in Lovable

I've tried a bunch of these prompt-to-site tools and [Lovable](https://lovable.dev) is currently the one producing the nicest-looking output by a good margin. You describe what you want, it generates a React site with a live preview, and you iterate from there.

The trick to getting a good result is being specific about the parts a designer would think about. Instead of "a website for a construction company", give it:

- The name and one sentence about what the company does.
- A rough sitemap. "Home, services, projects, contact." That's enough.
- A vibe or references. "Feels like a small Copenhagen architecture studio. Warm, off-white, serif headings, one accent color."
- Content, even if it's a placeholder. Real names, real service descriptions, a real address. Lovable-generated lorem ipsum is worse than your own draft.

Here's roughly the shape of a prompt that works for me:

```
<<EXAMPLE_PROMPT>>
```

_Prompt structure adapted from Felix Haas's [How To Prompt High-End Websites In Lovable](https://designplusai.com/p/how-to-prompt-high-end-websites-in)._

You iterate the same way you'd give feedback to a designer. "The hero is too tall, cut it in half." "Change the accent to a deeper red." "Add a section between services and contact that lists past projects with a photo grid." It picks up small changes quickly and doesn't lose the rest of the site.

Here's what I've built this way so far:

- **[meyster.work](https://meyster.work)** is a simple landing page for a side project.
- **[ivo-bau.de](https://ivo-bau.de)** and **[zimmer-ludwigshafen.com](https://zimmer-ludwigshafen.com)** are small sites for my parents' businesses. Both replaced pretty dated previous versions (screenshots below for the before/after).

<!-- TODO: screenshot placeholder, ivo-bau.de previous version -->
<!-- TODO: screenshot placeholder, zimmer-ludwigshafen.com previous version -->

- **[adiadi.art](https://adiadi.art)** is for my incredibly talented friend and artist Adina. Shopify was on the table so she could sell prints directly, but that's something for later. For now she has a really simple site she can manage herself in Lovable. I tweaked a few bits with Claude Code, but honestly just fine-tuning. It's in her style, the look she wants, expressing her voice.

Each of these took a couple of hours in Lovable, plus a bit of tweaking afterwards. None of them cost more than the domain.

## Step 2: Push it to GitHub

Before you hook up hosting, get the code out of Lovable and into a real repo. Lovable has a built-in GitHub integration: you connect your account once and every change in the editor is committed to a repo you own. I'd do this early, even if you're not planning to touch the code yourself yet.

Two reasons this small step matters more than it looks:

- **It keeps the Lovable iteration path open.** You still get Lovable's daily free credits, so you can pop back into the editor whenever you want, tweak a section by prompt, and the changes land in the repo automatically. For friends who never want to open a terminal, this is the ongoing update flow: "just describe what you want changed."
- **It unlocks the Claude Code path**, which is how I actually prefer to iterate once a site exists. Clone the repo, edit locally, push. Small changes go from prompt-and-wait to a two-line diff. More on that in Step 4.

If you skip GitHub and stay inside Lovable's hosted preview, you're pretty much locked into their editor and their pricing. A five-minute connection avoids that.

## Step 3: Ship it via Netlify

With the code in GitHub, [Netlify](https://netlify.com) is a one-click "deploy from GitHub" flow. You connect the two once, pick the repo, and every push (whether it came from Lovable, Claude Code, or you editing a file by hand) triggers a redeploy. First deploy takes a minute; every future one is automatic.

Why Netlify and not Lovable's own hosting:

- You own the code. If Lovable changes pricing or disappears, you still have a working site.
- Custom domains and DNS are boring and reliable.
- The free tier is generous enough that none of the sites above pay for hosting.
- You get a proper CI/CD pipeline for free, which matters the moment you want to make changes without going back through Lovable.

### Getting a domain

The only recurring cost of the whole stack is the domain. Two registrars I'd point anyone at:

- **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** sells domains at wholesale cost, no markup, no upsells. A `.com` is around $10 a year and stays there. This is my default now.
- **[Namecheap](https://www.namecheap.com)** is the classic option. Slightly more expensive than Cloudflare, but the dashboard is friendlier if you've never touched DNS before.

I'd skip GoDaddy and the other loud-marketing registrars. Nothing scammy, they're just noticeably more expensive and constantly try to sell you stuff you don't need.

### Pointing the domain at Netlify

Once you own the domain, you have two options for wiring it up:

1. **Let Netlify manage DNS.** In the registrar's dashboard, change the nameservers to the ones Netlify shows you (four `nsN.p<something>.dnsimple.com` addresses). From then on you manage all DNS inside Netlify. Easiest option, and what I'd recommend if you don't already have MX records or other DNS you care about.
2. **Keep DNS at the registrar.** Add an `A` record for the apex (`@`) pointing at Netlify's load balancer IP, and a `CNAME` for `www` pointing at your Netlify subdomain (`your-site.netlify.app`). Netlify shows you the exact values in the "Domain management" screen. Use this option if you already run email on the domain and don't want to move those records.

Either way, SSL is handled for you (Let's Encrypt, wired up by Netlify) and kicks in a few minutes after the DNS propagates. Nothing else to configure.

## Step 4: Tweak with Claude Code

Lovable is really good at getting you 90% of the way. The last 10% is where it starts to struggle: pixel-level layout fixes, cross-browser quirks, adding an obscure meta tag for one specific platform, tightening the tailwind config, wiring up a contact form endpoint. The stuff that needs precision rather than generation.

That's where I switch over to [Claude Code](https://claude.com/code). I clone the repo, open it locally, and just describe the change. "The mobile nav overlaps the logo, fix it." "The og:image is wrong, generate a proper one and wire it up." "Add a favicon based on the logo." It handles the diff, I check it in the browser, I push. Netlify redeploys within a minute.

You could use Cursor, or Zed, or plain Copilot. The point is really that once the code is in a real repo, you have all the normal engineering tools available and small edits stop feeling scary.

One honest caveat: you do need a little technical confidence for this path. Claude Code won't push on its own, you have to tell it to commit and push, and that means being roughly comfortable with what those words mean. You don't have to write any code yourself, but you do have to be okay following along in a terminal. If that sounds like too much friction, the Lovable editor with its daily free credits is genuinely a better fit.

## The one exception: harambasic.de

I want to be clear about one thing: this stack is for **simple websites**. Marketing pages, small business sites, portfolios, side projects. Anything where the content is fairly static and the number of pages is small.

For my own site, [harambasic.de](https://harambasic.de), I did the opposite. I designed the CI identity by hand, wrote the code from scratch, and then rewrote the whole thing in [Astro](https://astro.build). That's a very different project. It's a long-lived personal home, I care about every detail, and I want the freedom to add whatever weird content type I come up with next. Lovable would have gotten me somewhere fast, but not somewhere I'd want to live in for years.

The rule of thumb I keep coming back to: if the site is going to change less than once a month and has fewer than ten pages, Lovable + Netlify + Claude Code is unbeatable on price and speed. Anything more ambitious, pick a real framework.

## Conclusion

If someone in your life needs a small website, I really wouldn't send them to Wix or Squarespace, and I wouldn't tell them to hire a freelancer for something a weekend can solve either. Sit down with them for an afternoon, prompt the site in Lovable, deploy it to Netlify, and use Claude Code to polish the last few bits. Total cost: one domain. Total time: an afternoon.

That's a lot of value for very little effort. Honestly, it's also the first time in years I feel comfortable saying yes when someone asks me to help them get online.
