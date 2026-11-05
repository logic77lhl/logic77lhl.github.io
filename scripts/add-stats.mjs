// 一次性脚本：给 13 个项目补 stats 和「怎么做到的」
import fs from "node:fs";
import path from "node:path";

const DIR = "C:/Users/user/Documents/Default Project/logic77lhl.github.io/src/content/projects";

const data = {
  "word-checkin": {
    stats: [["12,254", "词"], ["4", "套词表"], ["5 秒", "启动"]],
    mech: "单个 HTML 文件，没有构建步骤：词库以 JSON 内联，卡片和复习队列都在浏览器里算，进度写进 `localStorage`。要跨设备时才连 Supabase，写之前先比版本号，冲突就重试。",
  },
  "hf-quest": {
    stats: [["42", "个动作"], ["12 周", "热力图"], ["0", "后端"]],
    mech: "进度存成一份 JSON：每课一个布尔值加时间戳，连续天数由日期差算出来。开了 Gist 就把它推到私有 gist，换设备时拉回来合并；不登录就只在本机。",
  },
  "ai-atlas": {
    stats: [["59", "个概念"], ["9", "个领域"], ["6 层", "依赖"]],
    mech: "概念之间用依赖边连成有向图，按层数分层；同一份节点数据换一个排序键，就变成按年份排的史书。两种视图共用一套数据，不各写一份。",
  },
  "stanford-ai-courses": {
    stats: [["55", "门核心课"], ["70", "门延伸课"], ["125", "门总表"]],
    mech: "ExploreCourses 的课程目录有稳定结构，按院系和编号抓一遍，去重、补上先修关系，再用模板生成静态页。视频链接交给另一个 workflow 定期检查。",
  },
  "film-annual": {
    stats: [["4,880", "部片"], ["132", "年"], ["776", "位导演"]],
    mech: "所有实体（片、人、类型、国家）放在一份 JSON 里用 id 互相引用，构建时生成静态路由。搜索是前端对索引做一次线性扫描，4,880 条不需要倒排表。",
  },
  "star-pulse": {
    stats: [["798", "个项目"], ["5,246", "项目·天"], ["53 天", "连续采集"]],
    mech: "每天 04:00 UTC 跑一次：四路候选池取名单，调 GitHub API 拿当前 star，和库里上一条快照相减，写入数据文件。看板读的是两张快照的差，不是任何人的「增量」字段。",
  },
  "daily-stock-metrics": {
    stats: [["3", "个市场"], ["300", "个标的"], ["527 天", "回测"]],
    mech: "三个市场共用一套编排，差异（代码后缀、交易日历、字段映射）收进 `MarketSpec`。收盘后拉行情和估值，按日期落盘，再渲染成静态页。",
  },
  "zhihu-quant": {
    stats: [["1,132", "条回答"], ["29 万", "字"], ["17 条", "缺口"]],
    mech: "扩展在已登录的页面上下文里代发请求，拿到带签名的接口数据；正文用正则抽实体，按出现次数排序，再回链到原回答。",
  },
  "wxarchive": {
    stats: [["1 条", "命令"], ["4 种", "产物"], ["0", "登录"]],
    mech: "先取文章 HTML，去掉脚本，把图片逐张下载到本地并改写 `src`；正文用选择器抽出来转 Markdown，元信息从页面里的 JSON 变量读。",
  },
  "music-selector": {
    stats: [["20 秒", "试听"], ["3 栏", "布局"], ["0", "前端框架"]],
    mech: "标准库 `http.server` 提供三个接口：目录扫描、音频流、已选读写。前端用 `<audio>` 播固定秒数，到点自动下一首；副歌起点由 librosa 预先算好存进索引。",
  },
  "opencode-remote-tailscale": {
    stats: [["1 条", "命令"], ["0", "个 App"], ["固定", "地址"]],
    mech: "Tailscale Serve 把本机端口映射到 tailnet 内的 HTTPS 地址，Funnel 再暴露到公网。SSE 原样透传、不做缓冲，所以会话列表能正常初始化。",
  },
  "analysis-platform": {
    stats: [["1 个", "模块"], ["0", "前端改动"], ["schema", "驱动 UI"]],
    mech: "每个分析是一个模块，导出一份参数 schema；后端扫目录注册，前端按 schema 渲染表单，提交后统一走任务队列和结果存储。",
  },
  "peppa-parent-kit": {
    stats: [["446", "集"], ["13 个", "字段"], ["1 个", "校验器"]],
    mech: "446 集先落成结构化数据，每集按 13 个字段生成；校验器对同一字段做跨集相似度比较，超过阈值就报重复，跑在 CI 里。",
  },
};

let n = 0;
for (const [slug, { stats, mech }] of Object.entries(data)) {
  const file = path.join(DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    console.warn("skip", slug);
    continue;
  }
  let [, fm, body] = m;

  if (!/^stats:/m.test(fm)) {
    const block = stats.map(([v, l]) => `  - value: "${v}"\n    label: "${l}"`).join("\n");
    fm += `\nstats:\n${block}`;
  }

  if (!body.includes("## 怎么做到的")) {
    body = body.replace("## 没推过去的那部分", `## 怎么做到的\n\n${mech}\n\n## 没推过去的那部分`);
  }

  fs.writeFileSync(file, `---\n${fm}\n---\n\n${body.replace(/^\n+/, "")}`, "utf8");
  n++;
}
console.log("updated", n);
