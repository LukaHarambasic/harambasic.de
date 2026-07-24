---
title: Beautiful websites for almost free with Lovable
description: How I build small websites for friends, family, and side projects with Lovable, Netlify, and a bit of Claude Code polish.
image:
published: 2026-07-24
updated: 2026-07-24
tags:
  - Tools
  - Development
tldr: 'For simple websites the fastest path I have found: prompt it in Lovable, deploy it to Netlify, then use Claude Code (or similar) for the small tweaks. You only have to pay for the domain.'
---

## Motivation

I have been, and quite likely always will be, the website guy. Friends and family need a small website, and then they ask me if I can help. My answer has changed over the last years. For a while it was "just use Framer, Wix, Webflow or Squarespace." Useful, but for a private person offering their services or a small business, 15 to 20 euros a month feels like a lot. WordPress was the other option, but either you pay a managed host around the same, or you figure out how to run it yourself. None of it felt great.

That answer changed for me recently. Two versions of it work now, both a lot nicer than the old school alternatives:

1. **Just pay Lovable** (€25/month) and get the site, hosting, domain, and ongoing edits in one place. No hassle, and honestly a much nicer answer than Wix or Squarespace, which feel really old school next to what Lovable produces.
2. **Wire together a workflow** where the only recurring cost is the domain, using tools you probably already have.

This post is about the second one, because it's what I actually use now. Technically you don't even need a coding assistant like Claude Code, you can stay within Lovable's free 5 credits a day. Slows you down, but also keeps it simple.

## The stack

The four pieces are:

1. **Lovable** for generating the site. (free tier)
2. **GitHub** the home for your code. (free tier)
3. **Netlify** for hosting and the domain. (free tier)
4. Optional: **Claude Code** (or Cursor, or whatever you like) for the small edits.

That's it. No Content Management System (CMS), no framework decisions, no design system. You prompt, you push, you deploy, you tweak.

## Examples

Before the how-to, here is what this stack actually produces. Two sites I have built. Will a good designer produce something more beautiful? Yes. But does it look better, easier and cheaper than all the other alternatives? YES!!

- **[adiadi.art](https://adiadi.art)** is for my incredibly talented friend and artist Adina. We considered Shopify so she could sell prints directly, but that's something for later. For now she has a really simple site she can manage herself in Lovable. I tweaked a few bits with Claude Code, but just fine-tuning.
- **[meyster.work](https://meyster.work)** is a simple landing page for a side project. Nothing fancy.

Both took a couple of runs in Lovable, plus a bit of tweaking afterwards. Neither costs more per month than the domain.

A full worked example, my parents' construction company **[ivo-bau.de](https://ivo-bau.de)**, is in [the one-shot example section](#a-one-shot-example-ivo-baude) at the end of this post: a live Lovable build next to the exact prompt behind it. And to be honest, the most underwhelming one-shot I have done so far.

## Steps

### Step 1: Prompt it in Lovable

I've tried various different ways to produce beautiful websites. [Lovable](https://lovable.dev) is currently the one producing the nicest-looking output by a good margin. You describe what you want, it generates a site with a live preview, and you continue from there.

They have some magic sauce, but even that makes the same mistakes over and over. My draft prompt below tries to guide it in the right direction. First I'll walk through the reasoning behind each point so you know why it exists, but if you just want the prompt, copy it and adjust it. I broke it up into four categories:

#### 1. What you're actually building.

- The name and one sentence about what the company or person does. Not a marketing line, just what they actually do.
- A rough sitemap. "Home, services, projects, contact." That's enough. Don't do more than 4 in the beginning, otherwise Lovable will run out of tokens in no time.
- Real service names, real addresses, a real bio. Also directly sets the language of your website.

#### 2. Design direction.

- A vibe, in one or two sentences. "Feels like a small Copenhagen architecture studio. Warm, off-white, serif headings, one accent color."
- Two or three reference URLs. Sites you like, Dribbble, whatever. Or just paste/upload images. Lovable pulls inspiration from these instead of averaging over its training data.
- Animation stack if you care (Framer Motion). Ask for micro-interactions on interactive elements or you get standard animations.
- Provide your logo, or let an existing LLM generate one for you to get started.

> Tip: Use Claude, ChatGPT, Gemini or whatever to generate a design direction for you: colors, fonts, etc. This helps you not burn your valuable Lovable tokens on it.

#### 3. Things Lovable gets wrong by default.

- No em dashes anywhere. Lovable loves them. If you don't ban them explicitly, they appear in every heading and every paragraph.
- Don't generate any images unless explicitly asked. Otherwise you get AI stock photos that don't match the brief, and it burns through your free credits too quickly.
- Fully responsive across all screen sizes. Obvious, but without this you sometimes get a desktop-first layout that breaks on phones.
- Fully accessible, and the build (or dev server) should fail on inaccessible markup. Same reason. Otherwise you ship missing alt text, poor contrast, and unreachable focus states, and you'll only notice when someone tells you.
- Don't take over the default browser scrolling, ever. AI tends to do that, and I hate it on every website, it's the worst.

#### 4. Engineering targets.

- Production-ready static site, following best practices. No stray console logs, no unused deps, sensible file layout.
- Optimize for performance. Small bundles, modern image formats, lazy loading where it makes sense.
- Optimize for SEO and social media. Real title/description per page, OG tags, Twitter card, structured data where relevant.
- Generate a social preview image per page, at build time. This must run in CI (Netlify's build), not just locally, since I might never build locally on a family member's site. My own script for [harambasic.de](https://github.com/LukaHarambasic/harambasic.de/tree/main/scripts/generate-social-media-preview) is a decent reference.
- Update the favicon in all cases. No Lovable favicon allowed, make it based on the logo.

Here's a template you can adapt. Fill in the `{{placeholders}}`:

```markdown
Create a new website for {{name}} at {{domain}}.

What they do: {{one sentence, plain, no marketing}}.

Sitemap: {{Home, services, projects, contact}}.

Vibe: {{one or two sentences, e.g. "thoughtful, creative, curious, invites the reader to connect. Modern, artsy, minimalistic. Describe the colors and fonts to use."}}.

Design references (take inspiration, do not copy):

- {{URL 1}}
- {{URL 2}}
- {{URL 3}}

Animation stack: {{Framer Motion, or leave blank for defaults}}. Micro-interactions on every interactive element.

Technical requirements:

- Production-ready static site, best practices, no stray console logs or unused deps.
- Fully responsive across all screen sizes.
- Fully accessible. Build or dev server must fail on inaccessible markup.
- Optimize for performance: small bundles, modern image formats, lazy loading where it makes sense.
- Optimize for SEO and social media: per-page title/description, OG tags, Twitter card.
- Generate a social preview image per page at build time. Must run in CI (may never run locally). Inspired by https://github.com/LukaHarambasic/harambasic.de/tree/main/scripts/generate-social-media-preview.

Rules:

- No em dashes anywhere.
- Do not generate any images. Use placeholders where images should go.
- Do not invent copy. Use my draft below or placeholders.

Content:
{{names, services, real addresses, existing copy, whatever you have}}
```

And here's roughly what the filled-in version looked like for Adina's site:

```markdown
Create a new website for adiadi.art. Use Framer Motion for animations. The product should feel thoughtful, creative, curious, and invite the reader to connect. Modern, artsy, minimalistic.

Two references: XXXX and YYYY.

No smooth scroll. Micro-interactions on every interactive element. Blow the user's mind with motion, connection, interaction.

Do NOT generate any pictures. Adina is an artist and only her own work goes on the site. Use placeholders for now.

Front page is about the artist herself, with placeholders for a few selected pieces. Then a gallery page with placeholders that looks a little bit like a shop layout, without an actual shop. People should send an email or DM on Instagram if they want to buy a piece. Images do not have detail pages, but one image can have multiple pictures. Clicking opens a near-fullscreen modal so people can see the details.

No em dashes anywhere.
```

<small>Prompt inspired by Felix Haas's <a href="https://designplusai.com/p/how-to-prompt-high-end-websites-in">How To Prompt High-End Websites In Lovable</a>.</small>

And from there you iterate, either in Lovable or like I describe in [Step 4](#step-4-tweak-with-claude-code). "The hero is too tall, cut it in half." "Change the accent to a deeper red." "Add a section between services and contact that lists past projects with a photo grid."

### Step 2: Push it to GitHub

Before you hook up hosting, you need to get the code out of Lovable and into a repository (repo). Lovable has a built-in GitHub integration: you connect your account once and every change in the editor is committed to a repo you own.

This gives you three things:

- **It keeps the Lovable iteration path open.** You still get Lovable's daily free credits, so you can go back into the editor whenever you want, tweak a section by prompt, and the changes land in the repo automatically. For friends who never want to open a terminal, this is the ongoing update flow: "just describe what you want changed."
- **It unlocks the Claude Code path**, which is how I actually prefer to iterate once a site exists. Clone the repo, edit locally, push. Small changes go from prompt-and-wait to a two-line diff. More on that in [Step 4](#step-4-tweak-with-claude-code).
- **It hooks up hosting.** That's where Netlify pulls the code from to bring it to your website. More on that in [Step 3](#step-3-ship-it-via-netlify).

If you skip GitHub and stay inside Lovable's hosted preview, you're pretty much locked into their editor and their pricing.

### Step 3: Ship it via Netlify

With the code in GitHub, [Netlify](https://netlify.com) is a one-click "deploy from GitHub" flow. You connect the two once, pick the repo, and every push (whether it came from Lovable, Claude Code, or you editing a file by hand) triggers a redeploy. Might take a minute or two for every deploy.

Why Netlify and not Lovable's own hosting:

- You own the code. If Lovable changes pricing or disappears, you still have a working site.
- The free tier is generous enough, unless the website really takes off.

#### Getting a domain

The only recurring cost of the whole stack is the domain. Two registrars I'd point anyone at:

- **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** sells domains at wholesale cost, no markup, no upsells. A `.com` is around $10 a year and stays there. This is my default now.
- **[Namecheap](https://www.namecheap.com)** is the classic option. Slightly more expensive than Cloudflare, but the dashboard is friendlier if you've never touched DNS before.

Technically you can also get it at Netlify, but that might lock you in more than you like. Haven't done it, but also wouldn't recommend.

#### Pointing the domain at Netlify

Once you own the domain, you have two options for wiring it up:

1. **Let Netlify manage DNS.** In the registrar's dashboard, change the nameservers to the ones Netlify shows you (four `nsN.p<something>.dnsimple.com` addresses). From then on you manage all DNS inside Netlify. Easiest option, and what I'd recommend if you don't already have MX records or other DNS you care about.
2. **Keep DNS at the registrar.** Add an `A` record for the apex (`@`) pointing at Netlify's load balancer IP, and a `CNAME` for `www` pointing at your Netlify subdomain (`your-site.netlify.app`). Netlify shows you the exact values in the "Domain management" screen. Use this option if you already run email on the domain and don't want to move those records.

Either way, SSL (https) is handled for you (Let's Encrypt, wired up by Netlify) and kicks in a few minutes after the DNS propagates. Nothing else to configure.

### Step 4: Tweak with Claude Code

Lovable is really good at getting you started. But you need to do more after the first run, you need to tweak it. You can do that in Lovable too, but it's comparably expensive. So I'd recommend Claude Code or a similar tool, but only if you already pay for one. Otherwise, you might as well pay Lovable.

I clone the repo, open it locally, and just describe the change. "The mobile nav overlaps the logo, fix it." "The social media preview image is wrong, create a new one with a bigger title in the bottom left corner and wire it up." "Add a favicon based on the logo." It handles the diff, I check it in the browser, I push. Netlify redeploys within a few minutes.

> You could use Cursor, or Zed, or plain Copilot. The point is really that once the code is in a real repo, you have all the normal engineering tools available and small edits stop feeling scary.

One caveat: you do need a little technical confidence for this path. Claude Code won't push on its own, you have to tell it to commit and push, and that means being roughly comfortable with what those words mean. You don't have to write any code yourself, but you do have to be okay following along in a terminal. If that sounds like too much friction, the Lovable editor with its daily free credits is genuinely a better fit.

## A one-shot example: ivo-bau.de

To show the whole process in one go, here is a first-pass demo I built for my parents' construction company, IVO-BAU. It's a live Lovable build sitting right next to the exact prompt behind it, typos and all. My other parent's business, **[zimmer-ludwigshafen.com](https://zimmer-ludwigshafen.com)**, gets the same treatment next. The real sites are still waiting on photos and copy.

Live demo: [ivo-bau-demo.lovable.app](https://ivo-bau-demo.lovable.app/) (first attempt)

<details>
<summary>The exact prompt</summary>

```markdown
Create a new website for IVO-BAU at ivo-bau.de

What they do: german construction company, dry walls, tiles, and now also carpenter services. its a so called "Meisterbetrieb".

Sitemap: single page, nothing fancy and than also the data privacy and impressum stuff.

Vibe: simple, clear lineas for consturction comapny, clean look. but authentic and personal. its a family owned business with 5 ppl. its a local company, form oppau, ludiwgsahfen. 25 years old.

Design references (take inspiration, do not copy):

- https://www.mn-gbr.com/ - the hero scroll animation is dope, we dont need something that detailed, but something ebfore after would be nice
- https://malo7.com/innenausbau-heidelberg

Animation stack: Framer Motion, Micro-interactions on special elements interactive element.

Technical requirements:

- Production-ready static site, best practices, no stray console logs or unused deps.
- Fully responsive across all screen sizes.
- Fully accessible. Build or dev server must fail on inaccessible markup.
- Optimize for performance: small bundles, modern image formats, lazy loading where it makes sense.
- Optimize for SEO and social media: per-page title/description, OG tags, Twitter card.
- Generate a social preview image per page at build time. Must run in CI (may never run locally). Inspired by https://github.com/LukaHarambasic/harambasic.de/tree/main/scripts/generate-social-media-preview.

Rules:

- No em dashes anywhere.
- Do not generate any images. Use placeholders where images should go.
- Do not invent copy. Use my draft below or placeholders.

Content:

catch from existing website
```

</details>

I want to keep this honest, so I'll show it as is: this was one of the worse one-shot prompts I've done with Lovable. Reasons why it went in a direction that I didn't want:

- didn't specify to follow the existing color scheme, or use the existing website as a base
- didn't upload the new logo that I created
- wasn't specific enough with the fonts
- the reference website in general was maybe too much. I only liked the hero animation, but Lovable took the whole site into account and copied that style

The things I'd fix next in Claude Code:

1. give it the logo, which I forgot to include
2. pull the colors and fonts closer to what we already have, some changes are fine, but this drifts too far
3. add images to bring it to life. To be fair, if you drop the "do not generate any images" rule from the prompt you get a really good initial result, but here I want real, authentic images, nothing generated.

## Conclusion

If someone in your life or you need a small website, I really wouldn't send them to Wix or Squarespace, and I wouldn't tell them to hire a freelancer for something a weekend can solve either. Sit down with them for an afternoon, prompt the site in Lovable, deploy it to Netlify, and use Claude Code to polish the last few bits. Total cost: one domain. Total time: an afternoon. Outcome: something everyone without technical knowledge can maintain.
