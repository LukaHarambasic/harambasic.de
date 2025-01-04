---
title: My nerd path - 10+ years of (personal) development
description: This post shows how I acquired my technical knowledge and illustrates where my interests lie and how they have developed over almost 15 years.
published: 2021-12-22
updated: 2021-07-18
category: personal
tags:
  - website
  - tools
tldr: The web showed me how to code and after almost 15 years this time is over. I'm still in the tech world, but focusing on entrepreneurship and freelancing.
---

## Preamble

This post is a story about my life, a big part of mine. It shows how I acquired my technical knowledge and illustrates where my interests lie and how they have developed over almost 15 years. This story should serve as an inspiration to enable others to follow their passion. Because not every person doing something with technology has to follow a strict path - there are multiple ways to reach the goal. Furthermore, I want this post to look back on someday and remember how everything evolved since I was a young boy.

[Tobias Schlottke](https://twitter.com/tobsch?lang=en) hosting the [alphalist.CTO](https://alphalist.com/podcast) inspired me to write this post. He always starts an episode with the question: "What's your nerd path?". He got me thinking about how I became who I am in technology.

The story started when I was around 11, and I had no clue about computers. Continuing with a self-motivated learning phase, I became competent in web technologies and ended my last job as a technology consultant. Which also marks the end of this chapter in my life.

## Getting to know the internet

When I was 11, there was a platform called Knuddels; nowadays, I would describe it as a predecessor of [Slack](https://slack.com/) with mini-games. If you were an active user, you got promoted as a Family Member. You'd get new features, of which I remember the homepage the most fondly because it somehow kicked off my Nerd. On my "homepage," you could learn more about my interests and hobbies. My initial "homepage" was visually very dull. I just had some colorful text without nice graphics. By contrast, other users had nice borders around each box and animated pictures. So I got curious and found some templates I could copy over that weren't even HTML, they were written in [BBCode](https://en.wikipedia.org/wiki/BBCode). I'm not sure when I have seen it the last time, maybe in a forum around that time? Just having something nice looking wasn't enough though, I wanted to make it my own. After a while, I recognized how powerful the style attribute is and could change the look of my whole homepage. And that's what I did.

Afterward, I started a browser game with a clan with a styleable information page, again with BBCodes. This was the first time I used [GIMP](https://www.gimp.org/), and that was the first time I became aware of what Open Source is.

In the end, simple websites started my journey, and as I write this, I also understand why I'm so addicted to the web. It's been with me since I was a young boy dipping my towns in the vast ocean that is the internet, and it's always been accessible to me. Thanks to my parents ❤️.

## Using the website builder

![Website with an drop shadow and border radius as image](@images/posts/my-nerd-path/shadow_rounded_corner.png)

The next step was to publish my first website. To be honest, I can't even remember the content. Nevertheless, I won't forget that it was at [Homepage Baukasten](https://www.homepage-baukasten.de/) (Homepage Builder), which gave you a pretty lovely domain: .de.tl. And, as before, I stuck to this place because there was a very active community, but this time with "experts" in programming. I remember how I stood in awe of everybody who could build a website from scratch on this platform. It felt like magic. I still have this feeling today for stuff I don't understand. After customizing some designs from the community, I created my own layouts. If you wanted to create a nice background for your content, as you see above, you had to create an image and then split it into three parts putting it together. It wasn't as convenient as it is nowadays.

```html
<div id="container">
  <div id="top"></div>
  <div id="middle">
    <h1>About Us</h1>
    <p>Lorem Ipsum...</p>
  </div>
  <div id="bottom"></div>
</div>
```

```css
#top {
  background: url('/container-top.png') no-repeat;
}
#middle {
  background: url('/container-middle.png') repeat-y;
}
#bottom {
  background: url('/container-bottom.png') no-repeat;
}
```

Another recognizable feature of websites at this time was this glossy, well-known Web 2.0 button. I used masks in GIMP the first time to achieve this. It was quite some fun to rebuild this in Figma, the third generation of graphic tools I use to create websites.

![Glossy Web 2.0 button with the text: Click Me](@images/posts/my-nerd-path/glossy_button.svg)

## Hosting my own websites

The next logical step was to build an entire website from scratch. For that, I needed some hosting, and everybody around me used [bplaced.net](https://bplaced.net).net as they had a decent free tier. But, with this, I still didn't know how to handle a web space. I remember when a strange person I got to know over the Homepage-Baukasten forum showed me how to use my webspace via Skype & TeamViewer. He also showed me [FileZilla](https://filezilla-project.org/) to upload my files. Quickly, I got annoyed by this manual step. Naturally, I wanted to speed up my process, so I installed a plugin in [Notepad++](https://notepad-plus-plus.org/downloads/) to directly edit files on the server. I didn't know that you shouldn't change something directly in production without testing, but it was convenient.

At this time I started to look more into [PHP](https://www.php.net/), as I was lazy! I just didn't wanted to update my header and footer for every page when I change something, e.g. add a new link to the menu. ["Don't repeat yourself" (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) wasn't something I was aware of, but it was already part fo my philosophy.

I started to look more into [PHP](https://www.php.net/) at this time, as I was lazy! I just didn't want to update my header and footer for every page when I change something, e.g., add a new link to the menu. ["Don't repeat yourself" (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) wasn't something I was aware of, but it was already part of my philosophy.

```php
<?php include ("./header.php"); ?>
<body></body>
<?php include ("./footer.php"); ?>
```

As I already knew so much about HTML & CSS, I was very disappointed by my IT teacher, who asked us to learn layouts with tables. Although every good web developer used `float: left`. He was so kind enough to let me plan and conduct some lectures in my advanced IT course at school. I even wrote a small PHP script, making it easy to share all my codings with the others as I wasn't aware of other solutions. Sadly we had to use table layouts for the final exam.

## Getting more advanced

During this time, I started using [WordPress](https://wordpress.com/) and looked into a mystical new world: JavaScript. If I remember correctly, my first blog with WordPress was a relaunch of bagarts.de where I could write about online marketing. During this time, I thought marketing might be my passion. How wrong I was... And how could I believe that someone would care about the two cents from a 16-year-old boy without any substantial knowledge in this area? At this point, I got to know [Netcup.net](https://www.netcup.de/), the only web hoster I have had since then. I tried other hosters for other organizations, and I don't buy many domains at Netcup, but the hosting is still perfect, and the support is incredible.

Other solutions like the German homepage builder [Jimdo](https://www.jimdo.com/) were also on my radar. I created a simple website for my Handball team and my parents' construction company. After only 1 year, I moved to a self-implementation (see [archive.org](https://web.archive.org/web/20150920234612/http://ivo-bau.de/)). I used [Koala](http://koala-app.com/) (a GUI tool) for [Sass](https://sass-lang.com/). That was it, no framework or anything like that included, just PHP, HTML & CSS (ok and a third party lightbox).

![An old version of IVO-BAU.de - showing the title and a picture of the office](@images/posts/my-nerd-path/ivo_bau.png)

My first customer was my sports club. I developed a multi-WordPress website with a custom theme. I'm still quite happy with how it looks. Of course, it could use some optimization, but it's still alive. Despite some users trying to break it with an entire blog post in red and Comic Sans. During this, I fell in love with this concept of CPTs ([Custom Post Types](https://wordpress.org/support/article/post-types/)) and subsequently added some: teams, department management, and events. Then enhanced all of it with ACF ([Advanced Custom Fields](https://www.advancedcustomfields.com/)), e.g., to link to the current table for each team. I learned a lot and would do it entirely differently nowadays. Like on my previous homepages, I was in charge of the design, assets, hosting, and development.

![Screenshot of handball.tv-edigheim.de showing the start page](@images/posts/my-nerd-path/tv_edigheim.png)

## Learn programming

In 2016 I started a corporate study program for a bachelor in _Business Informatics focusing on Sales & Consulting_. I worked in a three-month cycle at [SAP](https://www.sap.com/) (my partner company) and then studied for three months at [DHBW](https://www.dhbw.de/english/home) (my university) for three years. At my company, I learned a JavaScript framework called [SAP UI5](https://sapui5.hana.ondemand.com/), which is not my favorite one.

I had the opportunity to work in one of the most impressive teams I have ever been in. Everyone was fantastic, from the senior developer, designers, and [user assistance](https://en.wikipedia.org/wiki/User_assistance). This team dynamic was extraordinarily unique, and I learned a lot. This atmosphere, where everyone is respected, constructive criticism is appreciated, problem-solving and free time are done together, continues to be what I strive towards in my choice of teams.

Even though work taught me a lot, I still learned most of my skills in my spare time on projects with friends. Fortunately, one of them showed me [Vue.js](https://vuejs.org/). My new love, still today! It feels right to write everything in the original intended language: HTML. HTML with a very intuitive syntax for templating, CSS is CSS or [SASS/SCSS](https://sass-lang.com/guide) when you prefer it, and JavaScript is JavaScript. It makes sense if you are used to the fundamentals of these three languages.

During this time, I got to know many other remarkable technologies and services: [NodeJs](https://nodejs.org/en/), [Python](https://www.python.org/), [Nuxt](https://nuxtjs.org/), [Headless CMS](https://jamstack.org/headless-cms/), [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), [Serverless](https://en.wikipedia.org/wiki/Serverless_computing), [Docker](https://www.docker.com/), and [Firebase](https://firebase.google.com/). I didn't have any lecture on any of these topics - I learned all of these on my own. If you wanted to give my approach a name, I would go for "problem-based-learner." If I want to achieve something and don't know how to do it, I'll learn the skill. Which is somehow lovely but sad as my journeys end most of the time end at the surface of new technology. It also makes it hard to dive deeper into new technologies as I'm bored by the first chapter of Udemy courses, and then it's hard to keep the motivation up.

I still wouldn't call myself an expert, but I can build a full-stack web application on my own. I always say it's enough for a prototype or an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product). After that phase, experts should take over. Nevertheless, at this time, it looked that I could become a full-time developer, as I fulfilled all the requirements: I started a lot of side projects that I never finished.

Besides all these technologies, I started to follow my passion for UX/UI design. I went into design departments, and in all the projects I did, I was responsible for the logo, colors, typographies, and mockups. You can check out my first UI design, schmackofatz. On the [projects page](/projects), if you want to see my skills during this time in my life. It was my first complete UI design, and even though I would do it quite differently today, I'm still proud of the outcome. Later I had to implement the UI for this idea in Vue.js.

On top of that, I could live out my love for tools. Tools. I changed the whole infrastructure of the oldest finance student club in Germany. I was responsible for setting everything up for a newly founded club and fixing all the wrong decisions I took two years later. My favorite failure is the email naming convention. We wanted to look like a startup and decided to only use first names for the email addresses, e.g., luka@q-summit.com. Though I didn't think that another Luka could join this club.

On my own, I tried a lot of tools in different areas: to-do lists, note-taking, PDF annotation, data storage, calendar, email. I'm sure I've annoyed most people around me, not just once with a great new tool, not just once. Thank you for still being friends with me. By the way, an [Airtable](https://airtable.com/) with all the tools I found and used is currently in the making (and will be published soon).

In the context of this chapter, I really need to say thanks to two people: **Frank** & **Henry**! You know why. ❤️

## Becoming a Technology Consultant

Shortly before my vocational contract with SAP ended, I found an excellent department where I became a _Technology Consultant for Mobile UX (EMEA)_. In the beginning, I worked with the [SAP Mobile Development Kit](https://developers.sap.com/topics/mobile-development-kit.html) focusing on the [SAP Asset Manager](https://www.sap.com/denmark/products/asset-manager.html) for iPads. Shortly after that, I had familiarized myself with the subject Covid-19 started, and the German government commissioned an app: The [Corona-Warn-App](/projects). I started as an Android developer before I became the team lead. In this way, I found out that I like to take on responsibility, make decisions, organize, and prioritize. With these new tasks, I slowly left the development behind me.

This section is relatively short as I was heavily focused on my work during these two years. Hence, I "only" started two projects with some friends:

- [Active Ambassadors](https://www.active-ambassadors.org/): A NGO to raise awareness for other NGOs.
- [Tech Mob Show](https://techmob.show/): A technology entertainment podcast with two friends.

## Ending my nerd path

I first wanted to call this chapter **"To be continued"** and add new chapters to my nerd path. But I think it won't be continued. I don't want to make my living as a developer. I love technology! I'll develop in my free time, learn new technologies, automate stuff I could do way quicker manually, be the number one contact for my family, friends, and colleagues to ask technical questions. For me, it's some kind of relaxation if I can develop after a stressful day.

However, I have taken a new path. I moved to Copenhagen to start my master's in _[Technology Entrepreneurship](https://www.dtu.dk/english/education/msc/programmes/technology-entrepreneurship)_ [@DTU](https://www.dtu.dk/english). I wanted to risk something, go out of my comfort zone, try something new, get to know inspiring people from all over the world, and just calm down a bit after my time at the Corona-Warn-App. However, I want to work on more meaningful projects from me. I want to find something with impact. It might sound cheesy, but I want to change something in the world, tackle the significant challenges, and leave a better world.

Right now, I'm already three and a half months into this program, and I love it. It's just an inspiring environment where everything seems to be possible. I already got my first megalomaniac idea. More on that later when I make that dream come true.

Wood picture: [Andrey Haimin](https://unsplash.com/photos/q2Fyzn-KJOQ)

Thank's to Niklas and Leo for proofreading.
