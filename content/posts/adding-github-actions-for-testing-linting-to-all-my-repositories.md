---
title: Adding GitHub Actions for testing & linting to all my (npm) repositories
description: TBD
image: /posts/almost-free-setup-for-ngos-startups-and-side-projects/header.png
alt: TBD
tags: 
    - GitHub Actions
    - npm
    - Linting
    - Testing
tldr: TBD
tweet: TBD
---

TBD

![Pull request with GitHub Actions - Checks failed](/posts/adding-github-actions-for-testing-linting-to-all-my-repositories/checks_failed.png)

![Pull request with GitHub Actions - Checks in progress](/posts/adding-github-actions-for-testing-linting-to-all-my-repositories/checks_in_progress.png)

![Pull request with GitHub Actions - Checks passed](/posts/adding-github-actions-for-testing-linting-to-all-my-repositories/checks_passed.png)

```yaml[.github/workflows/test.yml]
name: Tester
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test
```

```yaml[.github/workflows/lint.yml]
name: Linter
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run lint
```

<thanks>
    TBD
</thanks>
