[中文](README.md) | **English**

# logic77lhl.github.io

A hub page for 13 open-source projects. Static, no backend, no tracking scripts.

Live: **https://logic77lhl.github.io**

## Why this repo exists

The projects live in separate repositories. Someone landing on the GitHub profile sees only repo names and language bars — not which one is usable today and which is half-finished. This site does three things:

- **Everything on one page**, grouped by learning / tools / data / content, each card showing a real screenshot, plus a timeline sorted by repository creation date
- **A page per project**: three numbers at the top, then what it was like before, how it works, what didn't get solved, and how I see it now
- **Automatic updates**: stars, last commit, and primary language refreshed daily from the GitHub API by Actions

## Stack

Astro 7 + Content Collections (`glob` loader + Zod schema), no UI framework. The build output is plain static HTML with inlined CSS; images become WebP at build time.

## Theme

Light (paper) is the default: background `#fbf9f5`, white panels, amber accent (`#8a6200` for text to keep contrast, `#f6c800` for fills). The toggle in the top right switches to dark and remembers the choice in `localStorage`.

- All colours are CSS variables defined once with `light-dark(light, dark)`; switching themes only flips `color-scheme`
- An inline script sets `data-theme` before first paint, avoiding a flash
- Screenshots are dark UI captures and are never inverted — a screenshot should look like the real thing

```css
:root { color-scheme: light; --bg: light-dark(#fbf9f5, #0b0d10); }
:root[data-theme="dark"] { color-scheme: dark; }
```

```
src/
├─ content.config.ts          # schema for projects and writing
├─ content/projects/*.md      # one file per project — this is the database
├─ content/writing/*.md       # writing: notes / digests / skills / essays
├─ data/stats.json            # stars / last push / language, refreshed by CI
├─ data/timeline.json         # home timeline: created date + slug + title + group
├─ assets/covers/*.png        # real screenshots (1920×1200, 16:10)
├─ components/                # Cover, ProjectCard
├─ layouts/Base.astro
└─ pages/
   ├─ index.astro             # home
   ├─ projects/[slug].astro   # project page
   ├─ writing/index.astro     # writing list, grouped by year
   └─ writing/[slug].astro    # article page
scripts/refresh-stats.mjs      # GitHub API → stats.json
```

## Local development

```bash
npm install
npm run dev      # http://localhost:4321 — hot reload, no restart needed
npm run build    # dist/ (run once before publishing)
npm run preview  # preview the build
npm run new -- "Title"   # scaffold a new writing entry
```

> Node 22+. On Windows PowerShell, if `npm` is blocked by policy, use `npm.cmd`.

**Day-to-day**: keep `npm run dev` running, edit a markdown file under `src/content/`, save, and the browser refreshes. `build` is only for publishing.

## Adding a project

1. Create `src/content/projects/<slug>.md`; the filename is the URL (`/projects/<slug>/`):

```yaml
---
title: Project name
tagline: One line on the problem it solves
group: 工具                # 学习 | 工具 | 数据 | 内容
repo: logic77lhl/xxx       # owner/repo
demo: https://logic77lhl.github.io/xxx/   # optional
cover: xxx.png             # optional, matches src/assets/covers/xxx.png
stack: ["Python", "GitHub Actions"]
status: active             # active | wip | paused
featured: 0                # 1/2/3 = featured on the home page, 0 = not
order: 50                  # lower comes first
started: "2026-11"
stats:                     # three numbers at the top of the project page
  - value: "12,254"
    label: "words"
---
Body in Markdown. Three fixed sections:

## 怎么做到的
## 没推过去的那部分
## 我现在怎么看
```

2. Add a timeline entry to `src/data/timeline.json` (use the repository creation date):

```json
{ "date": "2026-11-02", "slug": "xxx", "title": "Name", "group": "工具" }
```

3. If there's a live version, capture a **1920×1200 (16:10)** screenshot into `src/assets/covers/`. Don't capture at 1280 wide — the detail page column is 1070 px and high-DPI screens need 2×, otherwise it looks blurry. No screenshot? Leave `cover` out and the card falls back to a typographic placeholder — no fake images.

4. Run `npm run build`. Field types are validated by Zod; typos fail the build.

`stats.json` is never edited by hand: the refresh job reads `repo` from each frontmatter.

## Adding a piece of writing

Not everything is code. Notes, digests, skill write-ups, and essays go in `src/content/writing/`, one markdown file each; the filename is the URL.

```yaml
---
title: A title
summary: One line that appears in the list and on the home page
kind: 笔记                # 笔记 | 整理 | 技能 | 随笔
date: 2026-11-04
tags: ["tag"]
link: https://...         # optional: external artefact
linkLabel: something      # optional
draft: false              # true hides it
---
```

- Body is plain Markdown, rendered in a 740 px reading column
- "整理" suits digests of Q&A or data; "技能" suits how-to write-ups for a tool or prompt
- If there's an external artefact (report, repo, skill docs), use `link` and keep the body to the why and the traps hit
- The home page takes the three most recent posts automatically

## Automation

`.github/workflows/refresh.yml` runs daily at 04:00 UTC:

- reads `repo` from each markdown file → calls `api.github.com` → writes `src/data/stats.json`
- if a repository request fails, the previous value is kept, so the page never shows 0 or blanks
- commits only when something changed

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`.

## Deployment (once)

1. Create the repository `logic77lhl.github.io` (a user site must use that name to live at the root; existing project sites like `/word-checkin/` are unaffected)
2. Settings → Pages → Source: **GitHub Actions**
3. Push; the first Actions run makes it live
4. No `CNAME`, no `gh-pages` branch

## Conventions

- **Read `notes/voice.md` before writing copy** (local, not committed): the thesis, tone rules, and rejected versions all live there.
- **Numbers go in the page header, not the body**: numbers in prose become a scoreboard; numbers in the header are just coordinates.
- **Writing isn't blogging**: every piece needs something concrete behind it — a trap hit, a dataset, a reproducible process. No book reports, no industry commentary.
- **Screenshots must be real**: captures of the live page, not mockups. A placeholder is more honest than a fake.
- **No badge walls**: state things in a sentence, not a row of shields.
- **Write the trade-off**: every project page has at least one "why not the other way".

## License

[MIT](LICENSE)
