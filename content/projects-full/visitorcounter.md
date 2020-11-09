---
title: Visitorcounter
desc: The Visitorcounter was used to visualize in realtime where the visitors are during a recruitment event of SAP. 
img: visitorcounter.png
alt: Together we developed version 1, in the background you can see the actual product.
time: 2017 - 2018
links:
tags: 
    - Vue.js
    - SAP HANA
    - IoT
    - SAPUI5
---

## Realtime visitor visualization

The Visitorcounter was used to visualize in realtime where the visitors are during a recruitment event of SAP. This information was displayed on a TV at the entrance and a projector in the foyer. For that, we build a web application with [SAPUI5.](https://sapui5.hana.ondemand.com/) Another team was responsible to collect the data with small IoT sensors mounted in the doors. The collected data was sent to the SAP IoT Service, the calculations took place happened in the frontend. As the first part was working fine we recognized that we should accumulate the data before the frontend access it.

As this recruitment event happens every year we created version 2. Therefore I have built up a larger team with two designers and two backend developers. The goal was simply do deliver an even better version as we had built before. We got a nice design, used [Calculation Views](https://help.sap.com/viewer/fc5ace7a367c434190a8047881f92ed8/2.0.03/en-US/d60ad1f0bb571014af49c9db1740d68c.html) on [SAP HANA](https://www.sap.com/products/hana.html) to accumulate the data, built the frontend with [Vue.js](https://vuejs.org/), and also added the headless CMS [Prismic.io](http://prismic.io/) to let our customers define the content without technical knowledge.

To sum it up, we built version 1 and learned a lot and put all this knowledge into a better version 2 with a great team.
