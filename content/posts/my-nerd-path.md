---
title: My nerd path - 10+ years of (personal) development
description: This post shows how I acquired my technical knowledge and illustrates where my interests lie and how they have developed over almost 15 years.
publishedAt: 2021-12-18
categories:
    - Personal
tldr: The web showed me how to code and after almost 15 years this time is over. I'm still in the tech world, but focusing on entrepreneurship and freelancing.
tweet: TBD
---

## Preamble

This post is a story about my life, a big part of my life. It shows how I acquired my technical knowledge and illustrates where my interests lie and how they have developed over almost 15 years. This story should serve as an inspiration to enable others to follow their passion. Because not every person doing something with technology has to follow a strict path - there are multiple ways to reach the goal. Furthermore, I also want this post to be able to look back on someday and remember how everything evolved since I was a young boy.

[Tobias Schlottke](https://twitter.com/tobsch?lang=en) hosting the [alphalist.CTO](https://alphalist.com/podcast) inspired me to write this post. As he always starts an episode with the question: "What's your nerd path?". With that he got me thinking how I became who I am in the technology world.

The story will start when I was around 11 and I had no clue about computers. Continuing with a self-motivated learning phase in which I became competent in web technologies and ends with my last job as a technology consultant. Which also marks the end of this chapter in my life.

## 1. Getting to know the internet

When I was 11 there was a platform called _Knuddels_, now days I would describe it as a predecessor of [Slack](https://slack.com/) with mini-games. If you were an active user you got promoted as a _Family Member_. You’d get new features, of which I remember the homepage the most fondly because it  somehow kicked off my Nerd. On my "homepage" you were able to learn more about my interests and hobbies. My initial “homepage” was visually very boring, I just had some colorful text without nice graphics. By contrast other users had nice borders around each box and animated pictures. So I got curious and found some templates I could copy over, that weren't even HTML, they were written in [BBCode](https://en.wikipedia.org/wiki/BBCode). I'm not sure when I have seen it the last time, maybe in a forum around that time? Just having something nice looking wasn't enough though, I wanted to make it my own. After a while, I recognized how powerful the `style` attribute is and that I can change the look of my whole homepage. And that's what I did.

Afterward, I started browser game where you had a clan with an information page that was styleable, again with BBCodes. This was the first time I used [GIMP](https://www.gimp.org/) and that was the first time I became aware of what Open Source is.

In the end simple websites started my journey and as I write this, I also understand why I'm so addicted to the web. It's been with me since I was a young boy dipping my towns in the vast ocean that is the internet, and it's always been accessible to me. Thanks to my parents. ❤️

## 2. Using the website builder

![Website with an drop shadow and border radius as image](/posts/my-nerd-path/shadow_rounded_corner.png)

The next step was to publish my first website, to be honest, I can't even remember the content. Nevertheless, I won't forget that it was at [Homepage Baukasten](https://www.homepage-baukasten.de/) (Homepage Builder) which gave you a quite nice domain: `.de.tl`. And, as before, I stuck to this place because there was a very active community, but this time with "experts" in programming. I remember how I stood in awe of everybody who was able to build a website from scratch on this platform. It felt like magic. I still have this feeling today for stuff I don't understand. After customizing some designs from the community I created my own layouts. If you wanted to create a nice background for your content as you see it above you had to create an image and then split it in three parts putting it together. It wasn't as convenient as it is nowadays.

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

Another recognizable feature of websites at this time was this glossy, well-known Web 2.0 button. I used masks in GIMP the first time to achieve this. It was quite some fun to rebuild this in Figma, which is the third generation of graphic tools I use to create websites.

![Glossy Web 2.0 button with the text: Click Me](/posts/my-nerd-path/glossy_button.svg)

## 3. Hosting my own websites

The next logical step was to build an entire website from scratch. For that, I needed some hosting, and everybody around me used [bplaced.net](https://bplaced.net) as they had a decent free tier. But, with this, I still didn't know how to handle a webspace. I remember when a strange person, I got to know over the Homepage-Baukasten forum, showed me how to use my webspace via Skype & TeamView. He also showed me [FileZilla](https://filezilla-project.org/) to upload my files. Quickly, I got annoyed by this manual step. Naturally, I wanted to speed up my process so I installed a plugin in [Notepad++](https://notepad-plus-plus.org/downloads/) to directly edit files on the server. I didn't know that you shouldn't change something directly in production without testing, but it was convenient.

At this time I started to look more into [PHP](https://www.php.net/), as I was lazy! I just didn't wanted to update my header and footer for every page when I change something, e.g. add a new link to the menu. ["Don't repeat yourself" (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) wasn't something I was aware of, but it was already part fo my philosophy.

```php
<?php include ("./header.php"); ?>
<body></body>
<?php include ("./footer.php"); ?>
```

As I already knew so much about HTML & CSS, I was very disappointed by my IT teacher who asked us to learn layouts with tables. Although every good web developer used `float: left`. He was so kind enough to let me plan and conduct some lectures in my advanced IT course at school. I even wrote a small PHP script which made it easy to share all my codings with the others as I wasn't aware of other solutions. Sadly we had to use table layouts for the final exam.

## 4. Getting more advanced

During this time I started using [WordPress](https://wordpress.com/) and looked into a mystical new world: JavaScript. If I remember correctly my first blog with WordPress was a relaunch of bagarts.de where I could write about online marketing. During this time, I thought marketing might be my passion. How wrong I was... And how could I think that someone would care about the two cents from a 16-year-old boy without any concrete knowledge in this area? At this point, I got to know [Netcup.net](https://www.netcup.de/), the only web hoster I had since then. For other organizations, I tried other hosters and I don't buy many domains at Netcup, but the hosting is still perfect, and the support is awesome.

Other solutions like the German homepage builder [Jimdo](https://www.jimdo.com/) were on my radar aswell. I created a simple website for my Handball team and my parents' construction company. After only 1 year, I moved to a self-implementation (see it on [archive.org](https://web.archive.org/web/20150920234612/http://ivo-bau.de/)). I used [Koala](http://koala-app.com/) (a GUI tool) for [Sass](https://sass-lang.com/). That was it, no framework or anything like that included, just PHP, HTML & CSS (ok and a third party lightbox).

![An old version of IVO-BAU.de - showing the title and a picture of the office](/posts/my-nerd-path/ivo_bau.png)

My first big project, with something you could call a customer, was for my sports club. It's a multi-WordPress website with a custom theme. I'm still quite happy with how it looks. Of course, it could use some optimization, but it's still alive. Despite some users trying to break it with a complete blog post in red and Comic Sans. During this I fell in love with this concept of CPTs ([Custom Post Types](https://wordpress.org/support/article/post-types/)), and subsequently added some: teams, department management, and events. Then enhanced all of it with ACF ([Advanced Custom Fields](https://www.advancedcustomfields.com/)), e.g. to link to the current table for each team. I learned a lot and would do it completely differently, nowadays. Like on my previous homepages I was in charge of the design, all assets, hosting, and development.

![Screenshot of handball.tv-edigheim.de showing the start page](/posts/my-nerd-path/tv_edigheim.png)

## 5. Learn programming

//TODO TO TECH??
In 2016 I started a corporate study program for a bachelor in _Business Informatics focusing on Sales & Consulting_. Working in a three months cycle at [SAP](https://www.sap.com/) (my partner company) and then studying three months at [DHBW](https://www.dhbw.de/english/home) (my university) for three years. At my company, I learned a JavaScript framework called [SAP UI5](https://sapui5.hana.ondemand.com/) which is not my favorite one.

I had the opportunity to work in one of the most amaizing teams I have ever been in. Everyone was awesome from senior developer, designers, and to [user assistance](https://en.wikipedia.org/wiki/User_assistance). This team dynamic was extraordinarily unique, and I learned a lot. This atmosphere, where everyone is respected, constructive criticism appreciated, problem-solving and free time is done together, continues to be what I strive towards in my choice of teams. 

Eventhough work tought me a lot, I still learned most of my skills in my spare time on projects with friends. Fortunately one of them showed me [Vue.js](https://vuejs.org/). My new love, still today! It just feels right to write everything in the original intended language: HTML. HTML with a very intuitive syntax for templating, CSS is CSS or [SASS/SCSS](https://sass-lang.com/guide) when you prefer it and JavaScript is JavaScript. It just makes sense if you are used to the fundamentals of these three languages.

During this time I got to know many other awesome technologies and services: [NodeJs](https://nodejs.org/en/), [Python](https://www.python.org/), [Nuxt](https://nuxtjs.org/), [Headless CMS](https://jamstack.org/headless-cms/), [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), [Serverless](https://en.wikipedia.org/wiki/Serverless_computing), [Docker](https://www.docker.com/), and [Firebase](https://firebase.google.com/). I didn't have any lecture on any of these topics - I learned all of these on my own. If you wanted to give my approach a name I would go for "problem-based-learner". If I want to achieve something and don't know how to do it, I'll learn the skill. Which is somehow nice but sad as my journeys end most of the time end at the surface of new technology. It also makes it hard to dive deeper into new technologies as I'm bored by the first chapter of Udemy courses and than it's hard to keep the motivation up.

I still wouldn't call myself an expert, but I'm able to build a full-stack web application on my own. I always say it's enough for a prototype or an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product). After that phase experts should take over. Nevertheless, at this time it looked that I could become a full-time developer, as I fulfilled all the requirements: I started a lot of side projects that I never finished.

Besides, all of these technologies I started to follow my passion for UX/UI design. I went into design departments and in all the projects I did, I was responsible for the logo, colors, typographies, and mockups. You can check out my first UI design _schmackofatz._ on the [projects page](/projects) if you want to see my skills during this time in my life. It was my first complete UI design and even though I would do it quite differently today I'm still proud of the outcome. Later I had to implement the UI for this idea in Vue.js.

On top of that, I could live out my love for tools. Digital tools. I changed the whole infrastructure of the oldest finance student club in Germany. For a newly founded club, I was responsible to set everything up and then two years later fixing all the bad decisions I took. My favourite failure is the e-mail naming convention. We wanted to look like a startup and decided to only use firstnames for the e-mail addresses, e.g. luka@q-summit.com. Though I didn't think that there could be another Luka joining this club. 

On my own, I tried a lot of tools in different areas: to-do lists, note-taking, PDF annotation, data storage, calendar, email. I'm sure I've annoyed most people around me, not just once with a great new tool, not just once. Thank you for still being friends with me. By the way, an [Airtable](https://airtable.com/) with all the tools I found and used is currently in the making (and will be published soon).

In the context of this chapter, I really need to say thanks to two people: __Frank__ & __Henry__! You know why. ❤️

## 6. Becoming a Technology Consultant

Shortly before my vocational contract with SAP ended, I found an awesome department where I became a _Technology Consultant for Mobile UX (EMEA)_. In the beginning, I worked with the [SAP Mobile Development Kit](https://developers.sap.com/topics/mobile-development-kit.html) focusing on the [SAP Asset Manager](https://www.sap.com/denmark/products/asset-manager.html) for iPads. Shortly after that, I had familiarized myself with the subject Covid-19 started, and the German government commissioned an app: The [Corona-Warn-App](/projects). I started as an Android developer before I became the team lead. In this way, I found out that I like to take on responsibility, make decisions, organize, and prioritize. With these new tasks I slowly left the development behind me.

This section is quite short as I was heavily focused on my work during this two years. Hence, I "only" started two projects with some friends:

* [Active Ambassadors](https://www.active-ambassadors.org/): A NGO to raise awareness for other NGOs.
* [Tech Mob Show](https://techmob.show/): A technology entertainment podcast with two friends.

## 7. Ending my nerd path

I first wanted to call this chapter __"To be continued"__ and add new chapters to my nerd path. But I think it won't be continued. I don't want to make my living as a developer. I love technology! I'll develop in my free time, I'll learn new technologies, automate stuff I could do way quicker manually, be the number one contact for my family, friends, and colleagues to ask technical questions. For me, it's some kind of relaxation if I can develop after a stressful day.

However, I have taken a new path. I moved to Copenhagen to start my master's in _[Technology Entrepreneurship](https://www.dtu.dk/english/education/msc/programmes/technology-entrepreneurship)_ [@DTU](https://www.dtu.dk/english). I wanted to risk something, go out of my comfort zone, try something new, get to know inspiring people from all over the world, and just calm down a bit after my time at the Corona-Warn-App. However, I want to work on more projects that are meaningful form me. I want to find something with impact. It might sound cheesy, but I want to change something in the world, tackle the big challenges, and leave a better world. 

Right now I'm already three, and a half months into this program, and I love it. It's just an inspiring environment where everything seems to be possible. I already got my first megalomaniac idea. More on that later when I make that dream come true.

Along the way, I also started working as a freelancer. More about that [here](/services).

<small>Wood picture: https://unsplash.com/photos/q2Fyzn-KJOQ</small>

<base-thanks>
    Thank's to Niklas and Leo for proofreading.
</base-thanks>
