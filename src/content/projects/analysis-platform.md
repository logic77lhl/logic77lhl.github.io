---
title: 插件式分析平台
tagline: 动态注册工具 + schema 驱动 UI，加一个分析不用改前端
group: 工具
repo: logic77lhl/analysis-platform
stack: ["Python", "Streamlit", "插件架构"]
order: 44
started: "2026-09"
stats:
  - value: "1 个"
    label: "模块"
  - value: "0"
    label: "前端改动"
  - value: "schema"
    label: "驱动 UI"
---

数据分析脚本写多了，最后都会长成同一个样子：一堆散落的 notebook，参数写死在代码里，换一份数据就得改一遍。

这里的思路是把「分析」变成插件：每个工具声明自己的参数 schema，UI 由 schema 自动渲染，新增分析只需要放一个模块进去，前端不用动。数据层统一做持久化，结果可以复现。

## 怎么做到的

每个分析是一个模块，导出一份参数 schema；后端扫目录注册，前端按 schema 渲染表单，提交后统一走任务队列和结果存储。

## 没推过去的那部分

它更像一个内部工具的骨架，不是成品应用。插件之间的依赖、权限、并发都没做；数据量一大，Streamlit 本身会成为瓶颈。

## 我现在怎么看

这个项目最大的价值，是让我承认：大部分「平台」需求，其实是三份脚本加一个说明文档。
