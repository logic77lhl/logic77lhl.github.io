#!/usr/bin/env node
/**
 * 同步「所有 GitHub Pages 站点」清单 → src/data/pages.json
 *
 * 数据分两层，别混：
 *   src/data/pages-meta.json  手写的部分（标题 / 一句话 / 分类 / 封面 / 排序）
 *   src/data/pages.json       本脚本生成的部分（URL / 更新时间 / 语言 / 体积 / stars）
 *
 * 跑法：npm run pages
 * CI：deploy.yml 在 build 前跑一次，每天 cron 重新部署，所以新增 Pages 仓库会自动上榜。
 * 取值失败时保留旧文件并以非零退出，不把半份数据写进仓库。
 */
import { readFile, writeFile } from "node:fs/promises";

const OWNER_FALLBACK = "logic77lhl";
const META_URL = new URL("../src/data/pages-meta.json", import.meta.url);
const OUT_URL = new URL("../src/data/pages.json", import.meta.url);

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": `${OWNER_FALLBACK}-pages-index`,
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};

/** 分类兜底：手写 meta 没覆盖到的新仓库，按 topics / 描述猜一个。 */
const GROUP_HINTS = [
  ["数据", /stock|quant|market|chart|dashboard|analytics|metrics|radar|competition|data-vis/i],
  ["学习", /course|learn|education|checklist|vocab|knowledge|tutorial|study|guide/i],
  ["内容", /film|movie|cinema|writing|blog|note|content|archive/i],
];

const inferGroup = (repo) => {
  const haystack = [repo.description ?? "", ...(repo.topics ?? [])].join(" ");
  for (const [group, re] of GROUP_HINTS) if (re.test(haystack)) return group;
  return "工具";
};

const get = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${path}`);
  return res.json();
};

const listRepos = async () => {
  const all = [];
  for (let page = 1; page <= 5; page += 1) {
    const batch = await get(`/users/${OWNER_FALLBACK}/repos?per_page=100&type=owner&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
};

const main = async () => {
  const meta = JSON.parse(await readFile(META_URL, "utf8"));
  const repos = await listRepos();
  const pagesRepos = repos.filter((repo) => repo.has_pages);

  const sites = pagesRepos.map((repo) => {
    const manual = meta.sites?.[repo.name] ?? {};
    const isUserSite = repo.name.toLowerCase() === `${OWNER_FALLBACK}.github.io`;
    const url = isUserSite
      ? `https://${OWNER_FALLBACK}.github.io/`
      : manual.url || repo.homepage || `https://${OWNER_FALLBACK}.github.io/${repo.name}/`;
    const topics = repo.topics ?? [];
    const stack = (manual.stack ?? [repo.language, ...topics.slice(0, 2)]).filter(Boolean);

    return {
      repo: repo.full_name,
      name: repo.name,
      url: url.endsWith("/") ? url : `${url}/`,
      title: manual.title ?? repo.name,
      tagline: manual.tagline ?? (repo.description ?? "").trim(),
      group: manual.group ?? inferGroup(repo),
      cover: manual.cover ?? null,
      stack,
      lang: repo.language ?? "",
      topics,
      pushed: (repo.pushed_at ?? "").slice(0, 10),
      created: (repo.created_at ?? "").slice(0, 10),
      sizeKB: repo.size ?? 0,
      stars: repo.stargazers_count ?? 0,
      order: manual.order ?? 999,
      note: manual.note ?? "",
    };
  });

  sites.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const out = {
    owner: OWNER_FALLBACK,
    generatedAt: new Date().toISOString(),
    count: sites.length,
    sites,
  };

  await writeFile(OUT_URL, `${JSON.stringify(out, null, 2)}\n`, "utf8");

  const pad = (s, n) => String(s).padEnd(n);
  console.log(`${sites.length} 个 Pages 站点 → src/data/pages.json`);
  for (const s of sites) {
    console.log(
      `  ${pad(s.group, 4)} ${pad(s.name, 24)} ${pad(s.pushed, 11)} ${s.sizeKB}KB  ${s.url}`,
    );
  }
};

main().catch((err) => {
  console.error(`同步失败，保留旧文件：${err.message}`);
  process.exit(1);
});
