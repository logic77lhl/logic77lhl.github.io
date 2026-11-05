// 新建一篇写作：npm run new -- "标题" [slug]
// 不给 slug 就用 post-YYYYMMDD，之后改文件名即可（文件名就是 URL）
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const title = (args[0] ?? "").trim();
if (!title) {
  console.log('用法：npm run new -- "标题" [slug]');
  process.exit(1);
}

const now = new Date();
const ymd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const slug = (args[1] ?? `post-${ymd.replaceAll("-", "")}`).replace(/[^\w-]/g, "");
const file = path.join("src/content/writing", `${slug}.md`);

if (fs.existsSync(file)) {
  console.log(`已存在：${file}`);
  process.exit(1);
}

const body = `---
title: ${title}
summary: 一句话说清这篇写了什么（会出现在列表和首页）
kind: 笔记
date: ${ymd}
tags: []
---

第一段。

## 小标题

正文。
`;

fs.writeFileSync(file, body, "utf8");
console.log(`已创建 ${file}`);
console.log("改完保存，浏览器会自动刷新。");
