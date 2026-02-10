---
title: "Monta Charge: HEMS"
description: 'Home energy management in Monta Charge: solar surplus charging, fuse protection, and a unified experience across chargers and integrations.'
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

Monta Charge is a HEMS solution for home users. I co-developed the home energy management in Monta’s charge app: in addition to controlling your charger manually, we took control over it.

Two pillars shaped the product. **Solar surplus charging**: charge when there is sun, and only with the surplus available in that moment. **Fuse protection**: take your home consumption into account so your EV never blows your fuse. Both were available in simple setups and in more advanced ones, where multiple integrations together provide the data to make the right decision.

We supported a wide range of hardware integrations: direct HTTP (e.g. for solar production forecasts), hardware aggregators like Enode so users could connect solar inverters, meter readers via OCPP, meter readers via MQTT, and direct HTTP connections. All of this surfaced in one unified UI that works with all kinds of chargers. Every charger and every combination unlocked different features; integrating software and hardware turned out to be as fun as they said.

The same product had to work in different markets, each with slightly different requirements. Besides building this functionality from scratch, I was responsible for extending existing features such as the SmartCharging algorithm: optimise for your pocket or for the planet. Powerbank, Monta’s VPP solution for flexibility markets, also sits on the same energy stack. Finding a way to build a generic platform that can handle all kinds of devices, all kinds of charge points, and all kinds of markets was an incredibly fun and rewarding challenge.

All of this was done in collaboration with Monta’s largest customer in a co-innovation project. We were a team of five: two backend engineers, one frontend engineer, one designer, and myself as product manager.
