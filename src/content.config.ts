import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    group: z.enum(["学习", "工具", "数据", "内容"]),
    repo: z.string(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
    stack: z.array(z.string()).default([]),
    status: z.enum(["active", "wip", "paused"]).default("active"),
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
    featured: z.number().default(0),
    order: z.number().default(100),
    started: z.string().optional(),
  }),
});

/**
 * 代码之外的输出：笔记、整理、技能说明、随笔。
 * 一条 = 一个 md 文件，标题就是 URL（/writing/<slug>/）。
 * 有外部产物（报告、repo、skill 文档）时填 link，正文可以只写「为什么」。
 */
const writing = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(["笔记", "整理", "技能", "随笔"]),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    link: z.string().url().optional(),
    linkLabel: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
