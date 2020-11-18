---
title: Almost free setup for NGOs, startups & side projects
description: TBD
image: my-personal-notion-setup.png
alt: TBD
tags: 
    - Dropbox
    - Google Drive
    - Google Calendar
    - Notion
    - Backup
---

Active-Ambassadors is an organisation founded by Leonard Schwier and myself. The idea was to raise awarness for NGOs with the skills we have developed over the last years. For that we'll send our active ambassadors DIY kits to iron a NGO of there choice on a jersey. We don't make profit, currently we are paying a lot of the stuff by ourselves. You can see everything on our transparency page. The team grew and we are currently four people as our two Julias joined! ❤️

Feel free to send as an email our a message on Instagram if you have any questions!

## Why this post?

I love tools! And that's my role at Active Ambassadors, handling all the tools we use and automize as much as possible. Over the last years I set up larger working enviroments even on a larger scale so I thought it might be worth sharing all this. This post targets someone who has no idea what he/she is doing (don't hesitate to send me a mail or send a Tweet) but also should inspire people with similiar setups. If you have ideas how I could improve this setup even more I'm to listen! 🙂

Before we start: you should have this two points in mind when reading this post:

- We don't want to spend money on our IT setup, our target is to raise awarness for NGOs.
- We work 100% remotly, some of us have even met!

This post isn't a list of tools over tools just to mention them all, it's only the staff we are really using. But as some of the stuff couldn't be what you need I also added some alternatives I know, but I haven't used all of them, these are marked with *****.

And I would set up somehow a similiar setup if I would found a new (digital) company.

## The tools we use

As I'm a big fan of structured content I splitted our tools in four categories. I'll shortly go over them and explain how we use them. We are using all of these tools in the free tier, we only have to pay for the domain & emails.

### Communication

<meta-list-tools tools="Slack, Google Meet"></meta-list-tools>

Our main communication tool is Slack, since we are a rather young team and grew up with messaging solutions no one had a problem to adapt it. And I'm personally also a big fan of sepearting communications, e.g. I don't want to have discussions about Active Ambassadors mixed up with my private chats in WhatsApp. As we use Google Calendar for invitations Google Meet was a natural fit.


![Slack](/posts/almost-free-setup-for-ngos-startups-and-side-projects/slack.png)

Slack strucutre:
a-, b-, p-, r-

### Operations

<meta-list-tools tools="Airtable, IFTTT"></meta-list-tools>

We moved from Google Sheets to Airtable as AIrtable provides an API which can be used by our website to list our expenses. We have two major categories with five sheets in Airtable.

- **CRM**
    - Active Ambassadors
    - Organisations
- **Finance**
    - Expenses
    - Income
    - Cost per DIY Kit

Our list of Active Ambassadors is somehow a mixture between a CRM and an order system, if an user fills out the form a new entry will be added with all the infomration we need. The user will also get a confirmation mail via Mailchimp. The new order is also communicated via Slack, this automation is done vie IFTTT.  That message in Slack triggers Leonard to start the printing and shipping process. Afterwards the status of the order is reflected manually in the sheet.

![Airtable - Shipping](/posts/almost-free-setup-for-ngos-startups-and-side-projects/airtable_shipping.png)

The organisations CRM is inspired by a standard sales funnel. But in reality it's just a Kanban board with four different states: First contact, Negotiation, Won, Lost. This helps us to keep track about organisations we already have contacted and also creates transparencs within the team.


![Airtable - Organisations CRM](/posts/almost-free-setup-for-ngos-startups-and-side-projects/airtable_organisations.png)

I think there isn't much to say about our finance screen, nothing fancy, pretty simple and straigth forward. This data is than reflected on our transparency page to let everybody know what expenses and what income we have.


![Airtable - Finances](/posts/almost-free-setup-for-ngos-startups-and-side-projects/airtable_finance.png)

After Notions give us the same functionallities to hookup other tools I would like to drop Airtable to reduce the number of tools we use.

### Marketing

<meta-list-tools tools="Mailchimp, Later, UNUM"></meta-list-tools>

In the beginning we wante dto se tup a newsletter now all our communication efforts go in to Instagram. To schedule and plan our posts Julia is using Later and UNUM and that's not something I'm fimiliar with, so take Julias word:

> Aussage Julia

### Knowledge/Tasks

<meta-list-tools tools="Notion, Google Drive"></meta-list-tools>

Over the last few years Notion has satisfied the desire of prodcutivity junkies who want to design for there own needs with writing a line of code and slowly it spilled over in the business world (at least that's how it looked for myself). With Notion you can do almost everything: use it as a wiki, build a custom CRM, track your tasks or use it as a notebook. 

![Notion](/posts/almost-free-setup-for-ngos-startups-and-side-projects/notion.png)

We decided to use it for our tasks with a simple Kanban board as well for some knowledge sharing. It's still work in progress, but it's growing.

And Google Drive only exists as data grave, we only save documents (e.g. templates) or picutres, but our knowledge is completly in Notion.

### Website

<meta-list-tools tools="Nuxt.js, Netlify, Prismic, GitHub, Netcup, Figma"></meta-list-tools>

The next paragrpahs will be very technical, if you aren't interested in this I still would recommend to get your hands on a domain, even if you aren't hosting a website. It's just ten times more professionell if I don't get an email from luka@active-ambassadors.org instead of dungeonmaster99@gmail.com

I built the website with Nuxt.js a Framework on top of Vue.js, so that's only something for you if you know how to do web development or you know someone. The website is publicly accessible via GitHub  the Versiion Control System of my chocie. These is linked to Netlify where each change to is directly deployed without any manual download or build process involved. During automatic build process the required data from Prismic our headless CMS and also Airtable are requested. But also a change to the content in Prismic would trigger a new build. I would like to have something similiar for AirTable as all the numbers on our transparency page are consumed from our sheets in AirTable. Because this isn't possible I trigger a new build every 24 hours via IFTTT as we don't relay on instant updates.

Last but not least are domain is managed at Netcup which costs us 17.55 €, but also the email hosting is managed via Netcup and is included in an webspace I own since years. If you are lucky you can get realy could deals at Netcup!

For creating mockups to discuss version two of our website I used Figma as everybody can access the files in realtime and also edit it or leave a comment. I also used Figma to create our logo.

Most of this could be replaced by Wordpress and Webspace. I just prefer to have the full control over the performance and the layout while going for a best of breed approach. Each part of this setup can easily be replaced, e.g. Prismic with nuxt/content if we feel to only write Markdown or Strapi a self hosted version. Also Airtable could be exchanged with an CRM like HubSpot or Headless Shopify. Opportunities over oportunities and we always can do what's best in the current situation.

## Refelction

- Open Source on own servers, but want to have low maintenance "costs" focus on the product
- Work together in one city
- Are all this tools necessary?

## Future plans

- become NGO to get G Suite and Slack Premium
- if I would do it fulltime host most of the stuff myself, write own bots, host open source headless cms like strapi
- Happy to pay if we are in the situation but would like to donate profits
