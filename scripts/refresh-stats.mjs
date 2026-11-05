// 每天从 GitHub API 刷新各项目的 stars / 最后提交 / 语言
// 只改 src/data/stats.json，不改内容和排版
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "src/content/projects");
const OUT = path.join(ROOT, "src/data/stats.json");

const token = process.env.GITHUB_TOKEN;
const headers = {
  "User-Agent": "logic77lhl-hub",
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

function repoOf(file) {
  const text = fs.readFileSync(path.join(CONTENT, file), "utf8");
  const m = /^repo:\s*(\S+)\s*$/m.exec(text);
  return m ? m[1] : null;
}

const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md"));
const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const next = {};

for (const file of files) {
  const id = file.replace(/\.md$/, "");
  const repo = repoOf(file);
  if (!repo) {
    console.warn(`skip ${id}: no repo field`);
    continue;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    next[id] = {
      stars: data.stargazers_count,
      pushed: (data.pushed_at || "").slice(0, 10),
      language: data.language || "",
    };
    console.log(`${id}: ★${data.stargazers_count} · ${next[id].pushed}`);
  } catch (err) {
    next[id] = previous[id] ?? { stars: 0, pushed: "", language: "" };
    console.warn(`keep previous for ${id}: ${err.message}`);
  }
}

const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n", "utf8");
console.log(`wrote ${OUT}`);
