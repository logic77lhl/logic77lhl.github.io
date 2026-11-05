---
title: OpenCode Remote
tagline: 一条命令，把 Windows 上的 OpenCode 变成手机可用的工作台
group: 工具
repo: logic77lhl/opencode-remote-tailscale
stack: ["PowerShell", "Tailscale", "Windows"]
order: 43
started: "2026-11"
stats:
  - value: "1 条"
    label: "命令"
  - value: "0"
    label: "个 App"
  - value: "固定"
    label: "地址"
---

想在手机上继续跑电脑上的 OpenCode，常见方案是开个隧道。但 Cloudflare 的 quick tunnel 会缓冲 `text/event-stream`，而 Web UI 依赖 SSE 初始化会话列表，结果是页面能打开，会话列表永远停在加载骨架。

改用 Tailscale 的 Serve / Funnel：真正的流式代理，会话、工具输出、权限弹窗都正常。手机浏览器扫码即用，iPhone 和安卓都不用装 App，地址固定，电脑重启也不变。一条命令完成安装、登录、开代理和打印地址。

## 怎么做到的

Tailscale Serve 把本机端口映射到 tailnet 内的 HTTPS 地址，Funnel 再暴露到公网。SSE 原样透传、不做缓冲，所以会话列表能正常初始化。

## 没推过去的那部分

两端都要装 Tailscale 并登录同一个 tailnet；手机端体验受浏览器限制，长按、复制、输入法都可能别扭。它把电脑搬到了手机上，没把手机变成电脑。

## 我现在怎么看

这类脚本的收益全在「刚好需要的那一刻」。平时它躺在那儿，看起来毫无价值。
