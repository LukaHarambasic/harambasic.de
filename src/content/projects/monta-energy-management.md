---
title: Monta - Energy management
description: 'Energy management at Monta: home charging (HEMS), Monta Control, smart charging, and Powerbank for flexibility markets.'
image: monta-charge-hems.png
imageAlt: Monta Charge app screens showing Solar charging with production and forecast, and Energy features for home charging.
published: 2024-06-01
updated: 2025-09-30
prio: 850
status: active
links:
  - title: Monta
    url: https://www.monta.com
relatedWork:
  - monta
tags:
  - Product Management
  - Energy Management
  - HEMS
  - Smart Charging
  - Co-innovation
---

I co-developed home energy management in Monta's charge app. Beyond controlling your charger manually, we took control over it. Monta Charge is for home users: a HEMS solution where you charge when there is sun and only with the surplus available in that moment. Fuse protection takes your home consumption into account so your EV does not blow your fuse. Both features were available in simple setups and in more advanced ones, where multiple integrations together provide the data to take the right decision. We integrated a wide range of hardware: direct HTTP (e.g. for solar production forecasts), hardware aggregators like Enode so users could connect solar inverters, and meter readers via OCPP, MQTT and direct HTTP. All of this surfaced in one unified UI that works with all kinds of chargers. Every charger and every combination unlocked different features. Integrating software and hardware turned out to be as fun as it was complex. The same product had to work across different markets, each with slightly different requirements.

On the B2B side, Monta Control is a technical deep dive tool. I took care of the rebranding to position it like this and owned the commercial load management part used for parking lots, depots or housing associations. All smart charging from Monta Charge also sits in the same energy stack; we set the foundation to bring it into depot charging together with that commercial load management. I was responsible for extending existing features such as the smart charging algorithm: optimise for your pocket or for the planet. Finding a way to build a generic platform that can handle all kinds of devices, charge points and markets was an incredibly fun and rewarding challenge. Powerbank is Monta's VPP solution, aggregating charge points in given assets to participate in flexibility markets like FCR-D, aFRR and P415. I prepared it to enable more flexibility and geo markets.

All of this was done in collaboration with Monta's largest customer in a co-innovation project. We were a team of five: two backend engineers, one frontend engineer, one designer, and myself as product manager.
