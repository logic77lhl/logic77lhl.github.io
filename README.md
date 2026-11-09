**中文** | [English](README.en.md)

---

# logic77lhl.github.io

一个把 13 个开源项目放在同一页的索引站。静态生成、无后端、无追踪脚本。

线上地址：**https://logic77lhl.github.io**

## 为什么有这个仓库

项目分散在不同仓库里，别人点进 GitHub 主页只能看到一堆 repo 名字和语言色条，不知道哪个能直接用、哪个只是半成品。这里做三件事：

- **一页看全**：按「学习 / 工具 / 数据 / 内容」分组，每张卡有真实界面截图；中间一条时间线，按建仓日排
- **每个项目一页**：页头三个数字，正文写原来的样子、怎么做到的、没推过去的部分、现在怎么看
- **数据自动更新**：stars、最后一次提交、主语言每天由 Actions 从 GitHub API 刷新

## 技术栈

Astro 7 + Content Collections（`glob` loader + Zod schema），无 UI 框架。构建产物是纯静态 HTML，样式内联，图片在构建时转成 WebP。

## 配色与主题

默认是**浅色（纸感）**：底 `#fbf9f5`、面板纯白、墨色正文，强调色是琥珀金（文字用 `#8a6200` 保证对比度，填充用 `#f6c800`）。右上角可切深色，选择存在 `localStorage`，刷新不回弹。

- 颜色全部走 CSS 变量，用 `light-dark(浅色值, 深色值)` 定义，只在 `:root` 出现一次；切换主题只改 `color-scheme`，不重写样式
- 首屏前有一小段内联脚本把 `data-theme` 写到 `<html>`，避免亮暗闪烁（FOUC）
- 图片本身是深色界面截图，不做反色处理——截图就该是真实的样子

```css
:root { color-scheme: light; --bg: light-dark(#fbf9f5, #0b0d10); }
:root[data-theme="dark"] { color-scheme: dark; }
```

```
src/
├─ content.config.ts          # 项目 / 写作两类条目的字段定义
├─ content/projects/*.md      # 一个项目一个文件，这就是「数据库」
├─ content/writing/*.md       # 写作：笔记 / 整理 / 技能 / 随笔
├─ data/stats.json            # 自动刷新的 stars / 更新时间 / 语言
├─ data/timeline.json         # 首页时间线：建仓日 + slug + 标题 + 分组
├─ assets/covers/*.png        # 真实界面截图（1920×1200，16:10）
├─ components/                # Cover、ProjectCard
├─ layouts/Base.astro
└─ pages/
   ├─ index.astro             # 首页
   ├─ projects/[slug].astro   # 项目详情页
   ├─ writing/index.astro     # 写作列表（按年分组）
   └─ writing/[slug].astro    # 文章页
scripts/refresh-stats.mjs      # 抓 GitHub API，只改 stats.json
```

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321  改完保存自动刷新，不用重启
npm run build    # 输出到 dist/（发布前跑一次确认不报错）
npm run preview  # 预览构建结果
npm run new -- "标题"   # 新建一篇写作，自动填好 frontmatter
```

> 需要 Node 22+。Windows PowerShell 下如果 `npm` 被策略拦住，用 `npm.cmd`。

**日常改内容的流程**：`npm run dev` 开着 → 改 `src/content/` 里的 md → 保存 → 浏览器自己刷新。只有发布才需要 `build`。

## 加一个项目

1. 在 `src/content/projects/` 新建 `<slug>.md`，文件名就是 URL（`/projects/<slug>/`）：

```yaml
---
title: 项目名
tagline: 一句话说清它解决什么问题
group: 工具                # 学习 | 工具 | 数据 | 内容
repo: logic77lhl/xxx       # owner/repo
demo: https://logic77lhl.github.io/xxx/   # 可选，有线上版就填
cover: xxx.png             # 可选，对应 src/assets/covers/xxx.png
stack: ["Python", "GitHub Actions"]
status: active             # active | wip | paused
featured: 0                # 1/2/3 = 首页「先看这三个」，0 = 不进
order: 50                  # 越小越靠前
started: "2026-11"
stats:                     # 项目页页头三个数字，2–3 条最好
  - value: "12,254"
    label: "词"
  - value: "5 秒"
    label: "启动"
---
正文用 Markdown 写，四段小标题固定：

## 怎么做到的
## 没推过去的那部分
## 我现在怎么看

（开头一段不写标题，写「原来的样子」。）
```

2. 首页时间线在 `src/data/timeline.json` 里加一条（日期取仓库创建日）：

```json
{ "date": "2026-11-02", "slug": "xxx", "title": "项目名", "group": "工具" }
```

3. 有线上版就截一张 **1920×1200（16:10）** 的图放进 `src/assets/covers/`，文件名和 `cover` 字段一致。
   不要只截 1280 宽——详情页那一栏就有 1070px，高分屏要 2x，糊起来就是看不清。
   没有截图就不填 `cover`，卡片会显示排版化的占位块——不放假截图。

4. `npm run build` 确认能过。字段类型由 Zod 校验，拼错会直接报错。

不需要手动改 `stats.json`：下一次 refresh 任务会按 frontmatter 里的 `repo` 去抓。

## 加一篇写作

不只有代码。笔记、整理、技能说明、随笔都放 `src/content/writing/`，一个 md 一篇，文件名就是 URL（`/writing/<slug>/`）：

```yaml
---
title: 知乎的赞数，为什么官方 API 拿不到
summary: 开放平台只返回 4 个字段；换个入口，同一个问题从 1149 条里收到了 1132 条。
kind: 笔记                # 笔记 | 整理 | 技能 | 随笔
date: 2026-11-04
tags: ["抓取", "知乎"]
link: https://github.com/logic77lhl/zhihu-quant   # 可选：外部产物
linkLabel: zhihu-quant 源码                       # 可选
draft: false              # true 就不出现在列表里
---
```

- 正文就是普通 Markdown，渲染在 740px 的阅读栏里
- 「整理」适合放问答/数据的梳理，「技能」适合放某个工具或 prompt 的用法说明
- 有外部产物（报告、repo、skill 文档）就填 `link`，正文只写「为什么」和「踩了什么」
- 首页「写下来的」自动取最近 3 篇，不需要手动维护

## 自动更新

`.github/workflows/refresh.yml` 每天 04:00 UTC 跑一次：

- 读每个 md 的 `repo` 字段 → 请求 `api.github.com` → 写回 `src/data/stats.json`
- 某个仓库请求失败时**保留上一次的值**，不让页面出现 0 或空白
- 有变化才 commit，避免空提交

`.github/workflows/deploy.yml` 在 push 到 `main` 时构建并部署到 GitHub Pages。

## 部署（只需一次）

1. 新建仓库 `logic77lhl.github.io`（用户站仓库名必须是这个，才能挂在根路径；
   现有项目站的 `/word-checkin/` 等子路径不受影响）
2. Settings → Pages → Source 选 **GitHub Actions**
3. push 上来，第一次 Actions 跑完即可访问
4. 仓库里不需要 `CNAME`，也不用 `gh-pages` 分支

## 约定

- **写文案前先读 `notes/voice.md`**（本地，不进仓库）：这一站的立意（做得到 ≠ 值得做）、语气规则、被否掉的版本都在里面。给单个仓库写介绍时按那份文档的「四问」来，写完对照「怎么写得经得起时间」那张表自查。
- **数字放页头，不放进正文**：正文里的数字会变成绩单，页头的数字只是坐标。
- **写作不是博客**：每篇要有一个具体的东西撑着（一次踩坑、一份数据、一段可复现的流程），不写读后感、不写行业观察。没有具体东西就先不写。
- **截图必须是真的**：截的是线上页面，不是设计稿。占位块比假图诚实。
- **不堆徽章**：状态用一句话说明，不用一排 shields。
- **文案写取舍**：每个项目页至少有一处「为什么没选另一种做法」。
