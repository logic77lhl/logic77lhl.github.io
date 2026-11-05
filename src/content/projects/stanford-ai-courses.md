---
title: Stanford AI 课程地图
tagline: 55 门核心课 + 70 门延伸课，每门一份中文速览
group: 学习
repo: logic77lhl/stanford-ai-courses
demo: https://logic77lhl.github.io/stanford-ai-courses/
cover: stanford-ai-courses.png
stack: ["Python 采集", "静态站", "GitHub Actions"]
order: 13
started: "2026-10"
stats:
  - value: "55"
    label: "门核心课"
  - value: "70"
    label: "门延伸课"
  - value: "125"
    label: "门总表"
---

Stanford 的 AI 课程散在 CS、EE、STATS、MS&E、CME、AA、PSYCH、SymSys 等院系，编号从 CS 25 到 CS 528，还有大量 1 学分 seminar。想系统学一遍，先要花两天搞清楚「有哪些课」。

这里按方向整理成一张地图：55 门核心课各一份中文速览，另附完整课程总表、学习路径和延伸课程（70 门）。数据由 ExploreCourses 的可复现流水线抓取，站点静态生成；能找到公开视频的课，补了 B 站链接，另一个 workflow 定期检查有效性。

## 怎么做到的

ExploreCourses 的课程目录有稳定结构，按院系和编号抓一遍，去重、补上先修关系，再用模板生成静态页。视频链接交给另一个 workflow 定期检查。

## 没推过去的那部分

清单不等于学完，课程描述是从目录里抓的，难度和实际体验只有上过才知道。视频链接会失效，检查只能发现「打不开」，发现不了「换成了别的课」。

## 我现在怎么看

整理课程表是舒服的，因为不用真的去上课。这件事我做得很快，也一直知道自己为什么做得快。
