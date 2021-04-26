---
title: My Nerd Way
description: How I became who I am
image: TBD
alt: TBD
publishedAt: 1970-01-01
tags: 
    - TBD
tldr: TBD
tweet: TBD
---

Inspired by alphalist podcast, nominate 3 others

1. Knuddels & Penenrgame -> Family Mitglied -> "Homepage" (BB Code) -> Customization with style attributes
2. Homepage-Baukasten -> Customization of free templates -> own free template-> had the hope that Marco would join me -> community still at it-talent
3. Hosting of first website on bespace/bpspace -> call with someone I met on the internet showed me how to use a ftp client -> php to not write footer and header for every page
4. Wordpress & jquery -> blog about marketing (still not sure if this knowledge is worth it) -> netcup; Jimdo website for my handball team; Simple websites for my parents, wordpress for my sport club with acf -> did the design
5. Studied -> learned ui5 and then vue/nuxt, headless cms, netlify/vercel
6. Technology consultant

List of "Nerd Ways" -> https://harambasic.de/lists/nerd-ways

## Preamble

Inspire others, find it inspiring, idea form alphalist CTO

## 1. Get to know the internet

// TODO: Add that I was something like 11

There was and still is a plattform called _Knuddels_, now days I would describe it RTC with some extensions like minigames. If you where an active user you got promoted as a _Family Member_, with this new rank you got new features, and the one I remember most and somehow has kicked of my Nerd Way was the so called "homepage". If you visited my profile you could learn more about me on my homepage, I think it wasn't public facing only members where able to access it. My one was very boring, others had nice borders around each content box. I got curious and found some templates I could copy over, that weren't even HTML they were written in (BBCode)[https://en.wikipedia.org/wiki/BBCode]. I'm not sure when I have seen it the last time, maybe in a forum around that time? But just having something nice looking wasn't enough I wanted to make it my own. After a while I recognized how powerful the `style` attribute is, and I changed everything. The next community I joined was _Pennergame_, it was also browser based like _Knuddels_ but it was a game. You where in the role of a homeless collecting bottles to gain money to buy weapons and fight against other. Can't imagine what would happen if this game would have relaunched today and fourteen year old children would play it. In this game you had a clan with an information page which could be styled, again with BBCodes, but to make it even better you used images. I think it was the first time I used GIMP. As I write this I also understand why I am so addicted to the web. It accompanies me since my youth and everybody from my friends was able to access it (ok most of them :D).

## 2. The website builder

![Website with an drop shadow and border radius as image](/posts/my-nerd-way/my_nerd_way_shadow_rounded_corner.png)

The next step was to publish my own website, to be honest I can't even remember the content. Nevertheless, I won't forget that it was at [Homepage Baukasten](https://www.homepage-baukasten.de/) (Homepage Builder) which also gave you a quite nice domain: `.de.tl`. And, as before I sticked to this place because there was a very active community, but this time with "experts" around programming. I still remember how I stand in awe of everybody who was able to build a website from scratch in this website builder. It felt like magic. I still have this feeling today for stuff I don't understand. After customizing some designs from the community I created my own ones. Around this time there weren't flex boxes or drop shadows or border radius broadly available. You had to create an image and then split it in three parts putting it together like this. Someone even stole (copy paste of my HTML & CSS) this kind of layout which I now days would see as compliment. 

```html
<div id="container">
  <div id="top"></div>
  <div id="middle">
    <h1>About Us</h1>
    <p> Lorem Ipsum...</p>
  </div>
  <div id="bottom"></div>
</div>
```

```css
#top { background: url("/container-top.png") no-repeat; }
#middle { background: url("/container-middle.png") repeat-y; }
#bottom { background: url("/container-bottom.png") no-repeat; }
```

// TODO replace codesnippets with codepen

I also used `id` for everything instead of `class`. Every website had this glossy well-known Web 2.0 button. I think I used masks in GIMP the first time to achieve this. It was quite some fun to rebuild this in Figma, which is the third generation of graphic tools I use. 

![Glossy Web 2.0 button with the text: Click Me](/posts/my-nerd-way/my_nerd_way_glossy_button.svg)

## 3. Hosting my own websites

The next logical step was to build an entire website from scratch. For that I needed some hosting and every body around me used [bplaced.net](https://bplaced.net) as they had and still have a free tier. But, with this I still didn't know how to handle a webspace. I still remember when a strange, I got to know over the Homepage-Baukasten forum, showed me via Skype & TeamView how to use my webspace. He showed my [FileZilla](https://filezilla-project.org/), which is stil the only standalone FTP client I ever used. I wanted to speed about my process and for that I installed a plugin in [Notepad++](https://notepad-plus-plus.org/downloads/) to directly edit files on the server, I didn't know that you shouldn't change something directly in production without testing, but it was convenient. Maybe PHP was my first programming language I learned, as I hated it to update my Header and Footer on all pages, I wanted one central solution.

```php
<?php include ("./header.php"); ?>
<body></body>
<?php include ("./footer.php"); ?>
```

## 4. Getting more advanced

During this time I started using Wordpress and also looked into this mystical new world: JavaScript. If I remember correctly my first blog with Wordpress was a relaunch of bagarts.de to write about online Marketing. During this time I thought Marketing could be my way to go. How wrong I was... And what did I thought that someone would care about the two cents form a 16 year old boy without any concrete knowledge in this area? At this point I also got to know [Netcup.net](https://www.netcup.de/), the only webhoster I had since them. For other organizations I tried other Hosters and I don't buy every domain at Netcup, but the hosting is still perfect and the support is awesome.

Other solutions like the german homepage builder [Jimdo](https://www.jimdo.com/) where also on my radar. I created a simple website for my Handball team and for my parents construction company. After only 1 year I moved to a self implementation (see it on [archive.org](https://web.archive.org/web/20150920234612/http://ivo-bau.de/)), if I remember I used [Koala](http://koala-app.com/) (a GUI tool) for [Sass](https://sass-lang.com/). That was it no framework or anything like that included, just HTML & CSS (ok and a third party lightbox).

![An old version of IVO-BAU.de - showing the title and a picture of the office](/posts/my-nerd-way/my_nerd_way_ivo_bau.png)

My first big project with something comparable with a customer was for my sports club. It's a multi Wordpress website with a custom theme. TO be honest I'm still quite happy how it looks. Ofcourse it could use some optimization, but overall it's still not completely broken by someone writing everything in red and with Comic Sans. During this I felt in love with this concept of CPTs (Custom Post Types), I added some: teams, department management, events. Then enhanced all of it with ACF (Advanced Custom Fields), e.g. to link to the current table for each team. I learned a lot and would do it now days completely different. Again, it continued that I was responsible for the design, all assets and development.

![Screenshot of handball.tv-edigheim.de showing the start page](/posts/my-nerd-way/my_nerd_way_tv_edigheim.png)

## 5. "Learn programming"

// TODO:  Studied -> learned ui5 and then vue/nuxt, headless cms, netlify/vercel, serverless, little bit docker

## 6. Technology Consultant



Wood picture: https://unsplash.com/photos/q2Fyzn-KJOQ
