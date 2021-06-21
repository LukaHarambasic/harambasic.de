---
title: Add GitHub Actions for testing & linting to your repository
description: GitHub Actions are easy to configure and should be used in all npm/yarn based projects. 
image: /posts/adding-github-actions-for-testing-linting-to-all-my-repositories/checks_passed.png
alt: Passing GitHub Action Workflows with a successful build on a PR
publishedAt: 2020-12-21
tags: 
    - GitHub Actions
    - npm
    - Linting
    - Testing
tldr: 'GitHub Actions are easy to configure and should be used in all npm/yarn based projects. Checkout the <a href="https://gist.github.com/LukaHarambasic/0ef1c88782b6e8b138d5d0319f5a3a85">Gist</a> if you are only interested in the code.'
tweet: https://twitter.com/luka_harambasic/status/1341140170628853765
---

## Why should you add this GitHub Actions to your repositories?

GitHub Actions are there to automate workflows directly in GitHub without the need of setting up a full-blown CI/CD pipeline. You can just use them by adding a file to your root directory. Also, the [pricing](https://github.com/pricing) is very accommodating. I think I won't run into the limits with my private projects especially as there aren't limitations for public repositories.

During the time I worked on the [german Corona-Warn-App](https://www.coronawarn.app/en/) I noticed how powerful a CI/CD pipeline is. Therefore, it was clear to me that I want such a safety net for myself. If I'm rushing something or think it's just a quick fix I would love to see this in the PR and not in production. With these two small checks executed for every PR I'll spot errors more easily. It also opens up the possibilities for collaborations, as everybody has to fulfill the same checks.

## Adding GitHub Actions

### Prerequisites in package.json

1. Check the name of the scripts you want to be executed. In this example, I want to run `test` & `lint`.

```json[package.json]
{
...
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "test": "vue-cli-service test:unit",
    "lint": "vue-cli-service lint"
  }
...
}
```

2. (Optional) Let `build` fail if `test` or `lint` don't succeed, for that you need to chain the checks with `&` and the final build step with `&&`

```json
"build": "npm run lint & npm run test && vue-cli-service build",
```

#### How does the build fails and why?

"Because npm scripts are spawning a shell process under the hood [...]" ([Corgibytes, Kamil Ogórek](https://corgibytes.com/blog/2017/04/18/npm-tips/)) we can use the bash syntax to run our scripts with some additional logic. In this case we are using `&` to run commands in parallel and `&&` to run commands sequentially ([more details](https://www.gnu.org/software/bash/manual/html_node/Lists.html)).

This means if `npm run build` is executed by your build pipeline (e.g. [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/dashboard)) it runs the first two commands in parallel and only if they succeed the build will be started.

It's redundant as the GitHub Actions run in parallel to the build task, and the results aren't used for the build. This means the checks happens once on the GitHub Action and a second time on the build. However, since I don't want a build with lint errors or failing tests I'm okay with this redundancy. It looks like I'm not the only one with this requirement ([here](https://github.com/vercel/vercel/discussions/4589) & [here](https://github.com/vercel/vercel/discussions/5420)).

### Implementation

![GitHub Action - Pull request with a failed test job which lead to a failing build](/posts/adding-github-actions-for-testing-linting-to-all-my-repositories/checks_failed.png)

Just add the following file to your root directory in `.github/workflows/`. The name attributes are visible in the PR (see image). You only have to change the last line per job if you want to run something else, e.g. [Cypress](https://www.cypress.io/). So it's quite easy to adapt it to every other project even if my examples are based on [Vue.js](https://vuejs.org/) and [Nuxt.js](https://nuxtjs.org/):

- [harambasic.de](http://harambasic.de) → only [lint](https://github.com/LukaHarambasic/harambasic.de/pull/22/files#diff-107e910e9f2ebfb9a741fa10b2aa7100cc1fc4f5f3aca2dfe78b905cbd73c0d2) was added (with this post) as I don't have tests until now
- [jura.education](http://jura.education) → [checks](https://github.com/LukaHarambasic/jura.education/pull/6/files#diff-3ea54af4839eb75404d71b28252bead7e7ec8f676b1f815e1cde02629a75c165) with a lint and test job were added

```yaml[.github/workflows/checks.yml]
name: Checks
on: push
jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run lint
  test:
    name: Test (jest)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test
```

<base-callout>
    My initial commit with these actions was rejected from GitHub as my personal access token in Webstorm didn't have the permissions to push workflows. So you may need to create a new token for your GitHub client.
</base-callout>

## Conclusion

I started adding the above workflow to [jura.education](http://jura.education) ([PR](https://github.com/LukaHarambasic/jura.education/pull/6)) and with this post the lint workflow will be added to this website. From here I will add the workflows piece by piece to all my repositories.

I think it's a super simple way to enhance your code quality for no cost. So let's give it a try, even for small personal projects.

