import { json, requireAdmin } from "./_lib/session.js";
import { MIN_BODY_WORDS, bodyStructure, bodyWordCount } from "./_lib/bodyCount.js";

const MAX_PASSES = 5;

async function openaiJson(key, messages) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.35,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages,
    }),
  });
  if (!response.ok) {
    const err = new Error("openai_failed");
    err.status = response.status;
    throw err;
  }
  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content || "{}";
  return JSON.parse(text);
}

function normalizeBlocks(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter((block) => block && ["p", "h2", "h3", "ul", "callout"].includes(block.type));
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return json(res, 503, {
      error: "أضيفي OPENAI_API_KEY من إعدادات بيئة Vercel. المفتاح لا يُوضع في الشيفرة.",
      configured: false,
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const topic = String(body.topic || "").slice(0, 200);
  const keyword = String(body.primaryKeyword || topic).slice(0, 80);

  const system = `You write formal Arabic medical education. Educational only. No dosing, no purchase, no phone numbers, no home protocols. Do not invent studies. Do not repeat the same sentence. Return JSON only.`;

  let article = {};
  let blocks = [];
  let passes = 0;

  try {
    article = await openaiJson(key, [
      { role: "system", content: system },
      {
        role: "user",
        content: `Write a long educational article in Arabic about: ${topic}
Primary keyword: ${keyword}
Cluster: ${body.cluster || "safety"}
Return JSON:
{"title":"","h1":"","excerpt":"","seoTitle":"","metaDescription":"","blocks":[{"type":"p|h2|h3|ul|callout","text":"","items":[],"tone":"info|warning|emergency"}],"faqs":[{"q":"","a":""}]}
Requirements for blocks:
- At least 8 H2, 3 H3, 16 paragraphs
- Each paragraph 80-140 Arabic words of new information
- Cover definition, approved uses, supervised contexts, pregnancy warning, side effects, when to seek care, Saudi regulation, limits of online info
- Do not put disclaimer text inside counted paragraphs; add one final disclaimer paragraph separately
- Do not pad by repeating`,
      },
    ]);
    blocks = normalizeBlocks(article.blocks);
    passes = 1;

    while (bodyWordCount(blocks) < MIN_BODY_WORDS && passes < MAX_PASSES) {
      const missing = MIN_BODY_WORDS - bodyWordCount(blocks);
      const expansion = await openaiJson(key, [
        { role: "system", content: system },
        {
          role: "user",
          content: `The article body currently has ${bodyWordCount(blocks)} words and needs ${missing} more REAL Arabic words.
Topic: ${topic}
Already used H2 titles: ${blocks.filter((b) => b.type === "h2").map((b) => b.text).join(" | ")}
Add NEW sections only. No repeated sentences. No disclaimer padding.
Return JSON: {"blocks":[{"type":"p|h2|h3|ul|callout","text":"","items":[],"tone":"info|warning|emergency"}]}
Add 2-3 new H2 sections with long original paragraphs until about ${missing + 80} words are added.`,
        },
      ]);
      blocks = [...blocks, ...normalizeBlocks(expansion.blocks)];
      passes += 1;
    }
  } catch {
    return json(res, 502, {
      error: "تعذر إكمال التوليد من المزود. لم يُحفظ المقال مكتملاً.",
      configured: true,
      completed: false,
      publishAllowed: false,
    });
  }

  const stats = bodyStructure(blocks);
  const ok = stats.wordCount >= MIN_BODY_WORDS;
  article.blocks = blocks;

  return json(res, ok ? 200 : 422, {
    article,
    configured: true,
    completed: ok,
    publishAllowed: ok,
    wordCount: stats.wordCount,
    missingWords: Math.max(0, MIN_BODY_WORDS - stats.wordCount),
    paragraphs: stats.paragraphs,
    h2: stats.h2,
    h3: stats.h3,
    expansions: Math.max(0, passes - 1),
    error: ok ? undefined : `فشل التوليد: المتن ${stats.wordCount} كلمة بعد ${passes} تمريرات. النشر ممنوع.`,
  });
}
