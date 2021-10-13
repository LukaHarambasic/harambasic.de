---
title: My nerd path
description: TBD
publishedAt: 2999-12-09
categories:
    - Personal
tldr: TBD
tweet: TBD
---

Inspired by alphalist podcast, nominate 3 others

During school: IT advanced course -> gave HTML & CSS lessons

1. Knuddels & Penenrgame -> Family Mitglied -> "Homepage" (BB Code) -> Customization with style attributes
2. Homepage-Baukasten -> Customization of free templates -> own free template-> had the hope that Marco would join me -> community still at it-talent
3. Hosting of first website on bespace/bpspace -> call with someone I met on the internet showed me how to use a ftp client -> php to not write footer and header for every page
4. Wordpress & jquery -> blog about marketing (still not sure if this knowledge is worth it) -> netcup; Jimdo website for my handball team; Simple websites for my parents, wordpress for my sport club with acf -> did the design
5. Studied -> learned ui5 and then vue/nuxt, headless cms, netlify/vercel
6. Technology consultant

List of "Nerd Paths" -> https://harambasic.de/lists/nerd-paths

## Preamble

Inspire others, find it inspiring, idea form alphalist CTO

## 1. Get to know the internet

// TODO: Add that I was something like 11

There was and still is a plattform called _Knuddels_, now days I would describe it as a predecessor of Slack extensions like minigames. If you where an active user you got promoted as a _Family Member_, with this new rank you got new features, and the one I remember most and somehow has kicked of my Nerd Way was the so called "homepage". If you visited my profile you could learn more about me on my homepage, I think it wasn't public facing only members where able to access it. My one was very boring, others had nice borders around each content box. I got curious and found some templates I could copy over, that weren't even HTML they were written in [BBCode](https://en.wikipedia.org/wiki/BBCode). I'm not sure when I have seen it the last time, maybe in a forum around that time? But just having something nice looking wasn't enough I wanted to make it my own. After a while I recognized how powerful the `style` attribute is, and I changed everything. Afterwards I started another browser game where you had a clan with an information page which was styleable, again with BBCodes. This was the first time I used [GIMP](https://www.gimp.org/) and that was also the first time I became aware of what Open Source is.

As I write this I also understand why I am so addicted to the web. It accompanies me since my youth.

## 2. The website builder

![Website with an drop shadow and border radius as image](/posts/my-nerd-path/shadow_rounded_corner.png)

The next step was to publish my own website, to be honest I can't even remember the content. Nevertheless, I won't forget that it was at [Homepage Baukasten](https://www.homepage-baukasten.de/) (Homepage Builder) which also gave you a quite nice domain: `.de.tl`. And, as before I sticked to this place because there was a very active community, but this time with "experts" around programming. I still remember how I stand in awe of everybody who was able to build a website from scratch in this website builder. It felt like magic. I still have this feeling today for stuff I don't understand. After customizing some designs from the community I created my own ones. Around this time there weren't flex boxes or drop shadows or border radius broadly available. You had to create an image and then split it in three parts putting it together like this. Once even my layout was stolen (copy paste of my HTML & CSS).

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

![Glossy Web 2.0 button with the text: Click Me](/posts/my-nerd-path/glossy_button.svg)

## 3. Hosting my own websites

The next logical step was to build an entire website from scratch. For that I needed some hosting and every body around me used [bplaced.net](https://bplaced.net) as they had and still have a free tier. But, with this I still didn't know how to handle a webspace. I still remember when a strange, I got to know over the Homepage-Baukasten forum, showed me via Skype & TeamView how to use my webspace. He showed my [FileZilla](https://filezilla-project.org/), which is stil the only standalone FTP client I ever used. I wanted to speed up my process and for that I installed a plugin in [Notepad++](https://notepad-plus-plus.org/downloads/) to directly edit files on the server, I didn't know that you shouldn't change something directly in production without testing, but it was convenient. Maybe PHP was my first programming language I learned, as I hated it to update my Header and Footer on all pages, I wanted one central solution.

```php
<?php include ("./header.php"); ?>
<body></body>
<?php include ("./footer.php"); ?>
```

## 4. Getting more advanced

During this time I started using Wordpress and also looked into this mystical new world: JavaScript. If I remember correctly my first blog with Wordpress was a relaunch of bagarts.de to write about online Marketing. During this time I thought Marketing could be my way to go. How wrong I was... And what did I thought that someone would care about the two cents form a 16 year old boy without any concrete knowledge in this area? At this point I also got to know [Netcup.net](https://www.netcup.de/), the only webhoster I had since them. For other organizations I tried other Hosters and I don't buy every domain at Netcup, but the hosting is still perfect and the support is awesome.

Other solutions like the german homepage builder [Jimdo](https://www.jimdo.com/) where also on my radar. I created a simple website for my Handball team and for my parents construction company. After only 1 year I moved to a self implementation (see it on [archive.org](https://web.archive.org/web/20150920234612/http://ivo-bau.de/)), if I remember I used [Koala](http://koala-app.com/) (a GUI tool) for [Sass](https://sass-lang.com/). That was it no framework or anything like that included, just HTML & CSS (ok and a third party lightbox).

![An old version of IVO-BAU.de - showing the title and a picture of the office](/posts/my-nerd-path/ivo_bau.png)

My first big project with something comparable with a customer was for my sports club. It's a multi Wordpress website with a custom theme. TO be honest I'm still quite happy how it looks. Ofcourse it could use some optimization, but overall it's still not completely broken by someone writing everything in red and with Comic Sans. During this I felt in love with this concept of CPTs (Custom Post Types), I added some: teams, department management, events. Then enhanced all of it with ACF (Advanced Custom Fields), e.g. to link to the current table for each team. I learned a lot and would do it now days completely different. Again, it continued that I was responsible for the design, all assets and development.

![Screenshot of handball.tv-edigheim.de showing the start page](/posts/my-nerd-path/tv_edigheim.png)

## 5. Learn programming

I started a corporate study program: working three months at my partner company and than studying three months at my university and that for three years. At my company I learned a JavaScript framework called SAP UI5 which is not my favourite one. It is still based on MVC (I personally don't like for a pure frontend framework) and it uses XML as markup language and also the syntax feels kind of unintuitive. 

Though, I learned most of my skills in my spare time on projects with friends. Fortunately one of them showed my Vue.js. My new love, still today! I just feels right to write everything in the original intended language: HTML is HTML with some very intuitive syntax for templating, CSS is CSS or SASS/SCSS when you prefer it and JavaScript is JavaScript. I just makes sense if you are used to the fundamentals of these three languages. 

During that time I also got to know many other awesome technologies and services: NodeJs, Python, Nuxt, Headless CMS, Netlify, Vercel, Serverless, Docker and Firebase. I did had any lecture in one of these topics, I learned all of these on my own. If you want to give this practice a name I would go for "problem based learner". If I want to achieve something and don't know how I'll learn the skill. Which somehow nice but also sad as my journeys end most of them time at the surface of a new technology.

I still wouldn't call me an expert, but I'm able to build a full stack web application on my own. I always say it's enough for a prototype or a [MVP](TBD). But after that phase experts should take over. Nevertheless, it looked at this moment that I could become a full time developer, as I fulfilled all the requirements: I started a lot of side projects I never finished.

Besides, all of these technologies I also started to follow my passion for UX/UI design. I went into design departments and in all the projects I did I was also responsible for the logo, colors, typographies and the first mockups. You can check out _schmackofatz._ on the [projects page](/projects) if you want to see my skills at this point. It was my first complete UI design and even if I would do it quite different today I'm still proud of the outcome. I also implemented the UI for this idea in Vue.js.

## 6. Technology Consultant

## 7. To be continued

ex developer



Wood picture: https://unsplash.com/photos/q2Fyzn-KJOQ
