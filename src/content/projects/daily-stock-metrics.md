---
title: 每日市场指标
tagline: A 股 / ETF / 港股通：J 值、双均线、估值分位，每天自动出
group: 数据
repo: logic77lhl/daily-stock-metrics
demo: https://logic77lhl.github.io/daily-stock-metrics/
stack: ["Python", "GitHub Actions", "GitHub Pages"]
order: 51
started: "2026-11"
stats:
  - value: "3"
    label: "个市场"
  - value: "300"
    label: "个标的"
  - value: "527 天"
    label: "回测"
---

每天收盘后要看的指标散在几个网站，口径还不一样：A 股市值前 100、场内 ETF 规模前 100、港股通市值前 100，各算各的。

现在一份编排跑完三个市场：日 / 周 / 月线 KDJ 的 J 值、MA20 / MA60 双均线状态、价距 MA20、量比，以及 PE_TTM、PB_MRQ 的全历史和近 5 年分位。差异收在 `MarketSpec` 里，结果按日期落盘，同时发布成静态站点。

## 怎么做到的

三个市场共用一套编排，差异（代码后缀、交易日历、字段映射）收进 `MarketSpec`。收盘后拉行情和估值，按日期落盘，再渲染成静态页。

## 没推过去的那部分

描述性指标逐字段核验过；预测性结论（「哪些策略胜率高」、任何择时暗示）在一次 527 个交易日的回测里被证伪，所以项目里不再发布任何买入参考。

## 我现在怎么看

这个项目最后是删出来的：把预测删掉，只留描述。少给一个结论，比给一个错的结论好；删完它反而更有用，因为我不用再替它辩护。
