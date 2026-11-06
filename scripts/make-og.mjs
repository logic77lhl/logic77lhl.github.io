// 生成分享卡片 public/og.png（1200×630）。改文案后重跑：node scripts/make-og.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: #fbf9f5; color: #16181c;
    font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 72px 80px 64px;
    background-image:
      linear-gradient(rgba(22,24,28,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(22,24,28,.035) 1px, transparent 1px);
    background-size: 100% 28px, 28px 100%;
  }
  .top { display: flex; align-items: center; gap: 14px; }
  .mark {
    width: 40px; height: 40px; border-radius: 10px; background: #f6c800;
    display: grid; place-items: center; font-weight: 700; font-size: 19px;
    font-family: Consolas, monospace; color: #16181c;
  }
  .name { font-size: 25px; font-weight: 600; letter-spacing: .01em; }
  .sub {
    margin-top: 3px; font-family: Consolas, monospace; font-size: 12px;
    letter-spacing: .18em; color: #8b9199;
  }
  h1 {
    font-family: "Songti SC", SimSun, "Iowan Old Style", Georgia, serif;
    font-weight: 500; font-size: 68px; line-height: 1.28; letter-spacing: -.02em;
  }
  .foot {
    display: flex; justify-content: space-between; align-items: flex-end;
    font-family: Consolas, monospace; font-size: 15px; letter-spacing: .1em;
    color: #8b9199; border-top: 1px solid #e7e2d7; padding-top: 22px;
  }
  .foot b { color: #16181c; font-weight: 600; }
</style></head>
<body>
  <div class="top">
    <div class="mark">L</div>
    <div>
      <div class="name">logic77lhl</div>
      <div class="sub">BUILD · SHIP · NOTE</div>
    </div>
  </div>
  <h1>AI 来了之后，<br>想过的都试了一遍。</h1>
  <div class="foot">
    <span><b>13</b> 个尝试 · <b>7</b> 个能直接用</span>
    <span>2026.08 — 11</span>
  </div>
</body></html>`;

const tmp = path.join("scripts", ".og.html");
fs.writeFileSync(tmp, html, "utf8");

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto("file:///" + path.resolve(tmp).replaceAll("\\", "/"));
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og.png" });
await browser.close();
fs.unlinkSync(tmp);
console.log("public/og.png 已生成");
