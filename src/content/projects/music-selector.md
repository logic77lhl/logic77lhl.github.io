---
title: Music Selector
tagline: 几千首歌里，20 秒一首，挑出你真正想听的
group: 工具
repo: logic77lhl/music-selector
stack: ["Python 标准库", "原生 JS", "本地运行"]
order: 42
started: "2026-09"
stats:
  - value: "20 秒"
    label: "试听"
  - value: "3 栏"
    label: "布局"
  - value: "0"
    label: "前端框架"
---

本地音乐库用久了会变成黑洞：几千首歌，真正想听的还是那几十首。

这里把「筛选」变成一个连续动作：每首播放固定秒数（默认 20 秒）后自动切下一首，按一下加入已选，最后导出 `.m3u`。副歌检测可选，装了 `librosa` / `pychorus` 就直接跳到精彩片段。后端是 Python 标准库 `http.server`，前端原生 HTML/CSS/JS，没有 Flask，也没有构建。

## 怎么做到的

标准库 `http.server` 提供三个接口：目录扫描、音频流、已选读写。前端用 `<audio>` 播固定秒数，到点自动下一首；副歌起点由 librosa 预先算好存进索引。

## 没推过去的那部分

副歌检测不准，尤其是纯音乐和现场版；20 秒也可能正好错过。已选列表越攒越长，最后还是要在里面再挑一次。

## 我现在怎么看

它没有让我更懂音乐，只是把「跳过」这个动作变便宜了。筛选快到最后，剩下的仍然是品味。
