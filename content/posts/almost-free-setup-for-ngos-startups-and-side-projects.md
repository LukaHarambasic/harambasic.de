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

## The tools we use

As I'm a big fan of structured content I splitted our tools in four categories. I'll shortly go over them and explain how we use them, in the next section you'll get detailed information how we work with them and also what has been automated so far.

### Communication

<meta-list-tools tools="Slack, Google Meet"></meta-list-tools>

Our main communication tool is Slack, since we are a rather young team and grew up with messaging solutions no one had a problem to adapt it. And I'm personally also a big fan of sepearting communications, e.g. I don't want to have discussions about Active Ambassadors mixed up with my private chats in WhatsApp. As we use Google Calendar for invitations Google Meet was a natural fit.

### Marketing

<meta-list-tools tools="Mailchimp, Later, UNUM"></meta-list-tools>

### Knowledge/Tasks

<meta-list-tools tools="Notion, Google Drive"></meta-list-tools>


### Operations

<meta-list-tools tools="Airtable, IFTTT"></meta-list-tools>

### Website

<meta-list-tools tools="Nuxt.js, Netlify, Prismic, GitHub, Netcup, Figma"></meta-list-tools>

The next paragrpahs will be very technical, if you aren't interested in this I still would recommend to get your hands on a domain, even if you aren't hosting a website. It's just ten times more professionell if I don't get an email from peter@active-ambassadors.org instead of dungeonmaster99@gmail.com

I built the website with Nuxt.js a Framework on top of Vue.js, so that's only something for you if you know how to do web development or you know someone. The website is publicly accessible via GitHub  the Versiion Control System of my chocie. These is linked to Netlify where each change to is directly deployed without any manual download or build process involved. During automatic build process the required data from Prismic our headless CMS and also Airtable are requested. But also a change to the content in Prismic would trigger a new build. I would like to have something similiar for AirTable as all the numbers on our transparency page are consumed from our sheets in AirTable. Because this isn't possible I trigger a new build every 24 hours via IFTTT as we don't relay on instant updates.

Last but not least are domain is managed at Netcup which costs us 17.55 €, but also the email hosting is managed via Netcup and is included in an webspace I own since years. If you are lucky you can get realy could deals at Netcup!

For creating mockups to discuss version two of our website I used Figma as everybody can access the files in realtime and also edit it or leave a comment. I also used Figma to create our logo.

Most of this could be replaced by Wordpress and and Webspace. I just prefer to have the full control over the performance and the layout while going for a best of breed approach. Each part of this setup can easily be replaced, e.g. Prismic with nuxt/content if we feel to only write Markdown or Strapi a self hosted version. Also Airtable could be exchanged with an CRM like HubSpot or Headless Shopify. Oportunities over oportunities and we always can do what's best in the current situation.

## How we work

## Automated flows

## What would I change?

## Future plans
