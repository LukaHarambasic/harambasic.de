---
title: Almost free setup for NGOs, startups & side projects
description: TBD
image: my-personal-notion-setup.png
alt: TBD
tags: 
    - Notion
    - Google Drive
    - Mailchimp
    - Later
    - UNUM
    - Netlify
    - Nuxt.js
    - Airtable
    - IFTTT
    - Slack
    - Google Meet
tldr: The only thing you definitively should pay for is the domain, the free tiers of the other services are just fine for the beginning. And just use what you feel comfortable with, this post only reflects my personal preferences and can easily be transferred to other tools in the same area.
---

[Active Ambassadors](https://active-ambassadors.org/) is an organization founded by Leonard Schwier and myself. The idea was to raise awareness for NGOs with the skills we have developed over the last years. For that, we'll send our active ambassadors DIY kits to iron a NGO of their choice on a jersey. To accomplish this our team grew as Julia & Julia joined our journey ❤️

We don't make a profit. Currently we pay most of it ourselves. You can see all expenses and income on our [transparency page](https://active-ambassadors.org/transparency).

Feel free to send us [an email](mailto:luka@active-ambassadors.org) or a message on [Instagram](https://www.instagram.com/active_ambassadors/) if you have any questions!

## Why should you read it?

I want to inspire you how you can set up a professional working environment for your next idea without a lot of money. To give you an concrete example I'll talk over our set up at Active Ambassadors. All my knowledge, which I have acquired over the last years, has flowed into this.

This post targets someone who has no idea what he/she is doing but also should inspire people with similar setups. Let me know if you have ideas how I can improve this setup even more ([E-Mail](mailto:hi@harambasic.de), [Twitter](https://twitter.com/luka_harambasic)). 🙂

Before we start you should have this points in mind while reading this post:

- We don't want to spend money on our IT setup, our target is to raise awareness for NGOs.
- We work 100% remotely, some of us have even met!
- This post isn't a list of tools over tools just to mention them all, it's only the staff we are really using.
- I would set up the same for a (digital) company, club or side project.

## The tools we use

As I'm a big fan of structured content I split our tools into four categories. I'll shortly go over them and explain how we use them. We are using all of these tools in the free tier, we only have to pay for the domain & emails. If you are a registered NGO you even can use some of the premium tiers for free, e.g. on [Slack](https://slack.com/intl/en-de/help/articles/204368833-Apply-for-the-Slack-for-Nonprofits-discount) or [Google](https://www.google.com/nonprofits/offerings/g-suite/).

### Communication

<meta-list-tools tools="Slack, Google Meet"></meta-list-tools>

Our main communication tool is [Slack](https://slack.com/intl/en-de/), since we are a rather young team and grew up with messaging solutions no one had a problem to adapt it. And I'm personally also a big fan of separating communications, e.g. I don't want to have discussions about Active Ambassadors mixed up with my private chats in WhatsApp.

As we use [Google Calendar](https://calendar.google.com/) for invitations [Google Meet](https://meet.google.com/) was a natural fit for our calls.

![Slack](/posts/almost-free-setup-for-ngos-startups-and-side-projects/slack.png)

As you can see we follow some simple naming conventions, to be honest they are a little bit overkill, but I'm used to it and I like conventions. These are inspired directly from [Slack](https://slack.com/intl/en-de/blog/collaboration/how-to-use-slack-channels-to-organize-your-work) and I used them in several teams and they just work even if everybody needs some time to get used to it.

- **a-announcements:** Announcement channels are used to share some information with the whole workspace, e.g. about the christmas party or an all-hands.
- **b-bots**: These channels are primarily used by bots which only share updates, e.g. a new comment on instagram, an new order or a closed deal in a CRM.
- **p-projects:** These are not only for projects as they are [defined](https://en.wikipedia.org/wiki/Project#Formal_definition_in_the_project-management_realm), they also can be use as cross-team communication channels, e.g. for an event organization where multiple teams are needed.
- **r-random:** Just stuff that doesn't fit in any other channel, e.g. you can create one for a [running dinner](https://en.wikipedia.org/wiki/Progressive_dinner) where everybody can share there meals without spamming other channels.

In other workspaces I also used **t-teams** and **h-help** but for us this isn't currently needed as we are a small team.

### Operations

<meta-list-tools tools="Airtable, IFTTT"></meta-list-tools>

We moved from [Google Sheets](https://www.google.com/sheets/about/) to [Airtable](https://airtable.com/) because they offer an API which can be used by our website to display expenses and income. We have two major categories with five sheets:

- **CRM** ([definition](https://en.wikipedia.org/wiki/Customer_relationship_management))
    - Active Ambassadors
    - Organisations
- **Finance**
    - Expenses
    - Income
    - Cost per DIY kit

Our list of Active Ambassadors is somehow a mixture between a CRM and an order system, if a user fills out the form a new entry will be added with all necessary information. The ambassador will also get a confirmation via [Mailchimp](https://mailchimp.com/). The new order is also communicated via Slack, this automation is done via [IFTTT](https://ifttt.com/home).  That message in Slack triggers Leonard to start the printing and shipping process. Afterward, the status of the order is reflected manually in the sheet.

![Airtable - Shipping](/posts/almost-free-setup-for-ngos-startups-and-side-projects/airtable_shipping.png)

The organization's CRM is inspired by a standard [sales funnel](https://en.wikipedia.org/wiki/Purchase_funnel). In reality, it's just a [Kanban board](https://en.wikipedia.org/wiki/Kanban_board) with four different states: First contact, Negotiation, Won and Lost. This helps us to keep track of organizations we already have contacted and creates transparency within the team.


![Airtable - Organisations CRM](/posts/almost-free-setup-for-ngos-startups-and-side-projects/airtable_organisations.png)

I think there isn't much to say about our finance sheets, nothing fancy, pretty simple, and straight forward. This data is then reflected on our [transparency page](https://active-ambassadors.org/transparency).


![Airtable - Finances](/posts/almost-free-setup-for-ngos-startups-and-side-projects/airtable_finance.png)

If [Notions](https://www.notion.so/) provides us with the same functionalities to connect other tools I would like to drop Airtable to reduce the number of tools we use.

### Marketing

<meta-list-tools tools="Mailchimp, Later, UNUM"></meta-list-tools>

In the beginning, we had a newsletter with [Mailchimp](https://mailchimp.com/), but now all our communication efforts go into [Instagram](https://www.instagram.com/active_ambassadors/). To schedule and plan our posts Julia is using [Later](https://later.com/) and [UNUM](https://www.unum.la/) and that's not something I'm familiar with, so take Julias word:

> Aussage Julia

### Knowledge/Tasks

<meta-list-tools tools="Notion, Google Drive"></meta-list-tools>

Over the last few years, [Notion](https://www.notion.so/) has satisfied the desire of productivity junkies who want to design for their own needs by not writing a single line of code, and it slowly spilled over into the business world (at least it looked like that to me). With Notion, you can do almost everything: use it as a wiki, build a custom CRM, track your tasks, or use it as a notebook.

![Notion](/posts/almost-free-setup-for-ngos-startups-and-side-projects/notion.png)

We decided to use it for our tasks with a simple Kanban board as well for some knowledge sharing. It's still work in progress, but it's growing.

[Google Drive](https://www.google.com/intl/en_zm/drive/) only exists as data grave, we only save documents (e.g. templates) or pictures, but our knowledge is completely in Notion.

### Website

<meta-list-tools tools="Nuxt.js, Netlify, Prismic, GitHub, Netcup, Figma"></meta-list-tools>

<callout>
The next paragraphs will be very technical, if you aren't interested in this I still would recommend getting your hands on a domain, even if you aren't hosting a website. It's just ten times more professional if you send an email from luka@active-ambassadors.org instead of dungeonmaster99@gmail.com.
</callout>

I built the website with [Nuxt.js,](https://nuxtjs.org/) a framework on top of [Vue.js](https://vuejs.org/). So this is only something for you if you know how to do web development or if you know someone who is able to do it. The website is publicly accessible via [GitHub](https://github.com/) the [version control system](https://en.wikipedia.org/wiki/Version_control) of my choice. This is linked to [Netlify](https://www.netlify.com/) where each change is directly deployed without any manual download or build process involved. During the automatic build process, the required data from [Prismic](https://prismic.io/) our headless CMS, and also Airtable are requested. But also a change to the content in Prismic would trigger a new build. I would like to have something similar for AirTable as all the numbers on our transparency page are consumed from our sheets. Because this isn't possible I trigger a new build every 24 hours via IFTTT as we don't rely on instant updates.

The domain is managed at [Netcup](https://www.netcup.de/) which costs us 17.55 €, which also contains the email hosting.

For creating mockups to discuss version two of our website I used [Figma](https://www.figma.com/) as everybody can access the files in realtime and also edit it or leave a comment. I also used Figma to create our logo.

Most of this could be replaced by [Wordpress](https://wordpress.com/) and Webspace, this is used by my mothers organization: [Respekt Menschen](http://home.respekt-menschen.de/) (respect humans). I just prefer to have full control over the performance and the layout while going for a [best of breed approach](https://www.gartner.com/en/information-technology/glossary/best-of-breed). Each part of this setup can easily be replaced, e.g. Prismic with [nuxt/content](https://content.nuxtjs.org/) if we feel to only write [Markdown](https://daringfireball.net/projects/markdown/syntax) or [Strapi](https://strapi.io/) (self-hosted).

## Refelction

- Open Source on own servers, but want to have low maintenance "costs" focus on the product
- Work together in one city
- Are all this tools necessary?

## Future plans

- become NGO to get G Suite and Slack Premium
- if I would do it fulltime host most of the stuff myself, write own bots, host open source headless cms like strapi
- Happy to pay if we are in the situation but would like to donate profits

## Conclusion

- Exchange what you feel good with
- let me know if you want a deep dive in to one of the tools we use
