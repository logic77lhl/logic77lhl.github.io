---
title: star-pulse · GitHub 星耀榜
tagline: 每天给 800 个项目拍快照，用两个时间点相减
group: 数据
repo: logic77lhl/star-pulse
demo: https://logic77lhl.github.io/star-pulse/
cover: star-pulse.png
stack: ["Python 标准库", "GitHub Actions", "零依赖"]
featured: 3
order: 30
started: "2026-09"
stats:
  - value: "798"
    label: "个项目"
  - value: "5,246"
    label: "项目·天"
  - value: "53 天"
    label: "连续采集"
---

很多 GitHub 趋势数据来自第三方增量接口，口径不透明，也说不清两个数字之间隔了多久。

这里换了一条更笨的路：每天自己拍一次快照，用两个真实存在的日期相减。候选池由四路组成：种子清单、Trending 解析、池内续期、Search 补位。整条链路只用 Python 标准库，CI 里不需要 `pip install`。

## 怎么做到的

每天 04:00 UTC 跑一次：四路候选池取名单，调 GitHub API 拿当前 star，和库里上一条快照相减，写入数据文件。看板读的是两张快照的差，不是任何人的「增量」字段。

## 没推过去的那部分

快照只能看到涨了多少，看不到为什么涨。防刷星是启发式，不是判决；连续采集 53 天也还是短，季节性和一次性的爆红分不清。

## 我现在怎么看

宁可自己拍两张照片，也不相信别人算好的差值。这个习惯后来被我用到别处：凡是「增量」，先问基数是什么。
