---
title: Docker Compose for NextCloud with Traefik 2 (SSL)
description: I faced some problems to set up NextCloud with Traefik and that's why I share my docker-compose.yml.
publishedAt: 2021-01-13
categories:
    - Development
    - Docker
tldr: 'Here is the <a href="#complete-docker-composeyml">docker-compose.yml</a> you are looking for.'
tweet: https://twitter.com/luka_harambasic/status/1349487071614930944
---

__This is not a tutorial!__

I set up [Traefik 2](https://traefik.io/) on a [VServer at Netcup](https://www.netcup.eu/vserver/vps.php#v-server-details) mainly to use [Nextcloud](https://nextcloud.com/). Since I am neither Docker nor Traefik or NextCloud expert it took some time to set up everything as most of the `docker-compose.yml` files I found weren't working. So here is my short story about setting up NextCloud.

## Complete `docker-compose.yml`

```yaml[docker-compose.yml]
version: '3.7'

services:

  db:
    image: mariadb:latest
    container_name: nextcloud_db
    volumes:
      - nextcloud-db:/var/lib/mysql
    networks:
      - default
    restart: always
    environment:
      TZ: UTC
      MYSQL_ROOT_PASSWORD: SUPER_SECRET
      MYSQL_DATABASE: db
      MYSQL_USER: admin
      MYSQL_PASSWORD: SUPER_SUPER_SECRET

  redis:
    image: redis:latest
    container_name: nextcloud_redis
    restart: always
    networks:
      - default
    volumes:
      - nextcloud-redis:/var/lib/redis

  nextcloud:
    depends_on:
      - redis
      - db
    image: nextcloud:stable 
    container_name: nextcloud
    volumes:
      - nextcloud-data:/var/www/html
    networks:
      - web
      - default
    restart: always
    labels:
      - traefik.http.routers.nextcloud.middlewares=nextcloud,nextcloud_redirect
      - traefik.http.routers.nextcloud.tls=true
      - traefik.http.routers.nextcloud.tls.certresolver=lets-encrypt
      - traefik.http.routers.nextcloud.rule=Host(`cloud.YOUR-DOMAIN.com`)
      - traefik.http.middlewares.nextcloud.headers.customFrameOptionsValue=ALLOW-FROM https://YOUR-DOMAIN.com
      - traefik.http.middlewares.nextcloud.headers.contentSecurityPolicy=frame-ancestors 'self' YOUR-DOMAIN.com *.YOUR-DOMAIN.com
      - traefik.http.middlewares.nextcloud.headers.stsSeconds=155520011
      - traefik.http.middlewares.nextcloud.headers.stsIncludeSubdomains=true
      - traefik.http.middlewares.nextcloud.headers.stsPreload=true
      - traefik.http.middlewares.nextcloud.headers.customresponseheaders.X-Frame-Options=SAMEORIGIN
      - traefik.http.middlewares.nextcloud_redirect.redirectregex.permanent=true
      - traefik.http.middlewares.nextcloud_redirect.redirectregex.regex=https://(.*)/.well-known/(card|cal)dav
      - traefik.http.middlewares.nextcloud_redirect.redirectregex.replacement=https://$${1}/remote.php/dav/
    environment:
      REDIS_HOST: redis
      MYSQL_HOST: db:3306
      MYSQL_DATABASE: db
      MYSQL_USER: admin
      MYSQL_PASSWORD: SUPER_SUPER_SECRET
      TRUSTED_PROXIES: 172.18.0.1 

networks:
  web:
    external: true

volumes:
  nextcloud-data:
  nextcloud-db:
  nextcloud-redis:
```

## Test your set up and security

After you fired up your Nextcloud you should check if everything is working as expected. NextCloud offers two ways to help you with that: 

* Settings > Administration > Overview
* [Security check](https://scan.nextcloud.com/)

![Nextcloud administration overview](/posts/docker-compose-for-nextcloud-with-traefik-2-ssh/security_setup_warnings.png)

## Usage of calDav and cardDav

It's quite easy if you use the `docker-compose.yml` above. You need your domain, your user and as it is recommended an app password (Settings > Security > "Create new app password"). With these credentials you can go to every client which supports calDav/cardDav. In the screenshot below you can see a calDav set up in the iOS settings.

* Server: cloud.YOUR-DOMAIN.com
* User: user
* Password: app password

![iPhone settings calDav example](/posts/docker-compose-for-nextcloud-with-traefik-2-ssh/iphone_caldav.png)

## All the links I found and read

I spent some hours in setting up all of these, here is a list with all the links I used. The DigitalOcean Tutorials are just awesome and as far as I can tell are always up to date. I only would start Traefik as a `docker-compose.yml` to be consistent.

* __Server__: [Initial Server Setup with Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04), [How to Set Up SSH Keys on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)
* __Traefik__: [How To Use Traefik v2 as a Reverse Proxy for Docker Containers on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04), [Traefik 2.x configuration](https://mwunderling.com/blog/traefik2.html)
* __NextCloud Docker (with Traefik)__: [WhiteBahamut/nextcloud](https://github.com/WhiteBahamut/nextcloud), [nextcloud/docker](https://github.com/nextcloud/docker), [Running Nextcloud With Docker and Traefik 2](https://chriswiegman.com/2020/01/running-nextcloud-with-docker-and-traefik-2/), [Notes on traefik v2, Nextcloud, etc.](https://mattsch.com/2020/01/16/notes-on-traefik-v2-nextcloud-etc/), [ismailyenigul/nextcloud-pgsql-redis-traefikv2-docker-compose.yml](https://gist.github.com/ismailyenigul/f03b4f5f15e5e61ac5b80905c5d2890a), [CVJoint/traefik2](https://github.com/CVJoint/traefik2/blob/master/ymlfiles/nextcloud.yml), [pamendoz/personalDockerCompose](https://github.com/pamendoz/personalDockerCompose/blob/master/docker-compose.yml), [Self Hosted Nextcloud Using Docker](https://florianfranke.dev/posts/2018/10/self-hosted-nextcloud-using-docker/), [Cannot make https work properly with Docker + Traefik v.2](https://help.nextcloud.com/t/cannot-make-https-work-properly-with-docker-traefik-v-2/88541)
* __NextCloud problems__: [Nextcloud really slow after installation](https://help.nextcloud.com/t/nextcloud-really-slow-after-installation/74719/6), [[Help] Add a carddav account to macOS](https://help.nextcloud.com/t/help-add-a-carddav-account-to-macos/37253)
