---
title: Beautiful websites for almost free with Lovable
description: How I build small websites for friends, family, and side projects with Lovable, Netlify, and a bit of Claude Code polish.
image:
published: 2026-07-24
updated: 2026-08-08
tags:
  - Tools
  - Development
tldr: 'For simple websites the fastest path I have found: prompt it in Lovable, deploy it to Netlify, then use Claude Code (or similar) for the small tweaks. You only have to pay for the domain.'
---

## Why my answer changed

I've been the website guy for as long as I can remember, and probably always will be. Friends and family need a small site, and then they ask me if I can help. For years my answer was one of two things, and I never really liked either of them.

**"Just use Framer, Wix, Webflow, or Squarespace."** Fine for a while, but 15 to 20 euros a month adds up. For a private person offering their services or a small business, that recurring cost feels like a lot for something that mostly just sits there.

**"WordPress it."** Either pay a managed host in the same price range, or figure out how to run it yourself. Both roads are worse than they used to be, and neither is something I want to hand a friend.

Recently the answer shifted, because two better options actually landed:

1. **Just pay Lovable** (€25/month). Site, hosting, domain, ongoing edits by prompt, one bill. Honestly a much nicer product than Wix or Squarespace, which feel really old school next to what Lovable produces.
2. **Wire together a workflow** where the only recurring cost is the domain, using tools you probably already have.

This post is about the second one, because it's what I actually use. The claim is narrow: for a friend, family member, or small business who wants a site that looks current, is easy to update, and doesn't need a shop or a CMS, this stack beats both the €20/month builders and the DIY WordPress route. You keep control of the code, they can still update copy in the Lovable editor, and the only bill is the domain (~$10/year). Technically you don't even need a coding assistant like Claude Code, you can stay within Lovable's free 5 credits a day. Slows you down, but also keeps it simple.

## The stack

Four pieces:

1. **Lovable** for generating the site. (free tier, 5 credits/day)
2. **GitHub** as the home for the code. (free tier)
3. **Netlify** for hosting and DNS. (free tier)
4. Optional: **Claude Code** (or Cursor, or whatever you like) for the small edits.

No Content Management System (CMS), no framework decision, no design system to fight with. You prompt, push the code to GitHub, and Netlify takes it from there.

The reason this combination works, and the reason it's cheap, is that each tool does one job and none of them locks you in. Lovable is the fastest way I know to a decent-looking first draft. GitHub is the escape hatch: if any of the other tools changes pricing or disappears, you still own working code and can move it in an afternoon. Netlify is a one-click deploy on top of GitHub, and the free tier is generous enough that a small site never touches the paid limits. Claude Code is optional but the reason the "no ongoing cost" version works, because the small tweaks you'd otherwise burn Lovable credits on happen locally.

## What it looks like

Before the how-to, here is what this stack actually produces. Two finished sites I've built, so you can see the output first and decide if it's worth reading on. A good designer will still make something more beautiful. But nothing I know is easier, cheaper, and still this good-looking. YES!!

- **[adiadi.art](https://adiadi.art)** is for my incredibly talented friend and artist Adina. We considered Shopify so she could sell prints directly, but that's something for later. For now she has a really simple site she can manage herself in Lovable. I tweaked a few bits with Claude Code, but just fine-tuning.
- **[meyster.work](https://meyster.work)** is a simple landing page for a side project. Nothing fancy.

Both took a couple of runs in Lovable, plus a bit of tweaking afterwards. Neither costs more per month than the domain.

If you'd rather see the process than the polished output, jump to [The honest one: ivo-bau.de](#the-honest-one-ivo-baude). A live Lovable build for my parents' construction company sitting next to the exact prompt behind it, warts included.

I sat on this post for a while, not sure it was mine to write. Explaining how to use Lovable's free tier and work around the paid parts felt a bit like telling people how to dodge what they might otherwise just pay for. Then Tyler Bruno from the Lovable team wrote [Here's where you're wrong about hosting on Lovable](https://www.linkedin.com/pulse/heres-where-youre-wrong-hosting-lovable-tyler-bruno-jxpcc/), and his framing settled it: "Exit is open on purpose. Staying has to be a choice." So here's the detail, in a way anyone can follow.

## How I do it

### Step 1: Prompt it in Lovable

[Lovable](https://lovable.dev) is where the whole thing starts. You describe what you want, it generates a site with a live preview, and you take it from there.

The output is nice, but the same few things trip it up every single time. The prompt below is my attempt to steer around them. First I'll walk through the reasoning behind each part so you know why it's there. If you just want the prompt, skip ahead and copy it. Four categories:

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

#### 4. How it should be built.

Don't worry if you don't know every term here. These bullets are for Lovable, not for you. They're the difference between a site that feels fast on a phone and ranks well on Google, and one that doesn't. Just copy them in.

- Production-ready static site, following best practices. Nothing left over from the AI's draft: no debug messages in the browser console, no unused libraries, clean file layout.
- Optimize for performance. Small file sizes, modern image formats, and only load what's actually visible on screen. It should feel fast even on a phone.
- Optimize for SEO and social media. A real title and description per page, plus the tags that decide what your link looks like when someone shares it on LinkedIn, WhatsApp, or Google.
- Generate a social preview image per page, at build time. This has to run whenever Netlify redeploys, not just on my laptop, because I might never open the project locally again once it's live. My own script for [harambasic.de](https://github.com/LukaHarambasic/harambasic.de/tree/main/scripts/generate-social-media-preview) is a decent reference.
- Update the favicon (the little icon in the browser tab) in all cases. No default Lovable favicon allowed, make it based on the logo.

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

And from there you iterate, either in Lovable or like I describe in [Step 4](#step-4-tweak-with-claude-code). "The hero is too tall, cut it in half." "Add a section between services and contact that lists past projects with a photo grid."

### Step 2: Push it to GitHub

Before hosting, get the code out of Lovable and into a repository (repo) you own. Lovable's built-in GitHub integration handles this: connect your account once, and every change in the editor commits to a repo you control.

This one step is what makes the rest of the stack work, for three reasons:

- **The Lovable iteration path stays open.** Daily free credits still count, so you can go back into the editor whenever you want, tweak a section by prompt, and the changes land in the repo automatically. For friends who never want to open a terminal, this is the ongoing update flow: "just describe what you want changed."
- **The Claude Code path unlocks.** Download the code to your computer, edit it there, send the change back. Small changes go from prompt-and-wait to a two-line edit. More on that in [Step 4](#step-4-tweak-with-claude-code).
- **Hosting hooks up cleanly.** That's where Netlify pulls the code from to bring it to your website. More on that in [Step 3](#step-3-ship-it-via-netlify).

Skip GitHub and stay inside Lovable's hosted preview and you're pretty much locked into their editor and their pricing. That's the trade you avoid by doing this step even though it feels like an extra thing.

### Step 3: Ship it via Netlify

With the code in GitHub, [Netlify](https://netlify.com) is a one-click "deploy from GitHub" flow. Connect the two once, pick the repo, and every push (whether from Lovable, Claude Code, or you editing a file by hand) triggers a redeploy. A minute or two per deploy.

Netlify over Lovable's own hosting for two reasons:

- **You own the code.** If Lovable changes pricing or disappears, you still have a working site and can move it anywhere else in an afternoon.
- **The free tier is generous enough** that a small site never touches the paid limits, unless the site really takes off.

#### Getting a domain

The only recurring cost of the whole stack is the domain. Two registrars I'd point anyone at:

- **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** sells domains at wholesale cost, no markup, no upsells. A `.com` is around $10 a year and stays there. My default now.
- **[Namecheap](https://www.namecheap.com)** is the classic option. Slightly more expensive than Cloudflare, but the dashboard is friendlier if you've never touched DNS before.

You can technically buy the domain at Netlify too, but that ties DNS to the same vendor as hosting, and I'd rather keep those separable. Haven't tried it, wouldn't recommend.

#### Pointing the domain at Netlify

Once you own the domain, keep DNS at your registrar and just point two records at Netlify. On Netlify's "Domain management" screen you'll see an `A` record for the bare domain and a `CNAME` for `www`. Paste both into your registrar's DNS panel exactly as shown. Keeping DNS at the registrar means you don't have to move anything else (like email records) over to Netlify.

SSL (the `https://` padlock in the browser) is set up for you automatically and turns on a few minutes after the DNS change goes live. Nothing else to configure.

### Step 4: Tweak with Claude Code

Lovable gets you started fast, but after the first run you'll want to tweak. You can do that in Lovable, and it works. It's just comparably expensive: each tweak eats credits, and simple edits shouldn't need an LLM to reason about the whole app. So if you already pay for a coding assistant, that's the cheaper path. If you don't, stick with Lovable's daily free credits and skip this step.

The loop I use: download the code, open it in Claude Code, describe the change. "The mobile nav overlaps the logo, fix it." "The social media preview image is wrong, create a new one with a bigger title in the bottom left corner and wire it up." "Add a favicon based on the logo." It makes the edit, I check it in the browser, I send the change back up (to GitHub). Netlify redeploys within a few minutes.

> Cursor, Zed, or plain Copilot all work here too. Once the code is in a real repo, all the normal editor tools apply and small edits stop feeling scary.

The one honest caveat: this path needs a little technical confidence. Claude Code won't send changes back up on its own, you have to tell it to save the change and publish it (in git terms: "commit" and "push"), and that means being roughly comfortable with what those words mean. You don't have to write any code yourself, but you do have to be okay following along in a terminal. If that sounds like too much friction, the Lovable editor with its daily free credits is the better fit, and that's a totally fine place to land.

## The honest one: ivo-bau.de

To show the whole process in one go, here's a first-pass demo I built for my parents' construction company, IVO-BAU. A live Lovable build sitting right next to the exact prompt behind it, typos and all. My other parent's business, **[zimmer-ludwigshafen.com](https://zimmer-ludwigshafen.com)**, gets the same treatment next. The real sites are still waiting on photos and copy.

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

This was one of the worse one-shot prompts I've done with Lovable. Four things went sideways, all fixable, and worth naming because they show what the prompt template above is actually protecting against:

- **No color-scheme direction.** I didn't tell it to follow the existing colors or use the current site as a base. It picked its own palette and drifted.
- **No logo uploaded.** I forgot. Lovable generated a placeholder, and everything downstream (favicon, social image) was built off the wrong mark.
- **Not specific enough with the fonts.** Same drift, different axis.
- **Too much reference site.** I only liked the hero animation on `mn-gbr.com`, but Lovable took the whole site into account and copied the general style. Reference URLs are strong signals, use them narrowly.

The fixes are all cheap and all in Claude Code:

1. Give it the logo, which I forgot to include.
2. Pull the colors and fonts closer to what we already have. Some drift is fine, this one drifts too far.
3. Add real images to bring it to life. Dropping the "do not generate any images" rule would give a stronger first pass, but here I want authentic photos, nothing generated.

The reason this failure is worth including: the failure modes are boring and predictable, which is exactly why the prompt template exists in the first place.

## The next time a friend asks

Next time a friend or family member asks for help with a small website, this is the answer: block an afternoon together and we'll build it. One domain to pay for, one afternoon of work, and they can keep maintaining it themselves without a technical background.

The thing that surprised me building these: the "small website" market has become weirdly good. Two years ago the choice was Wix-tier polish for €20/month, or a dev-tier setup only I could maintain. Now the same €0/month setup produces something a friend can be proud of, and something a friend can keep updating without me. The gap between "professional tool" and "friend with a laptop" got really small. Worth using.
