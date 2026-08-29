import { json, requireAdmin } from "./_lib/session.js";
import { MIN_BODY_WORDS, bodyStructure, bodyWordCount } from "./_lib/bodyCount.js";

/**
 * Content Engine
 * --------------
 * Stages, requested individually via `body.stage`:
 *
 *   research  -> topic framing, search intent, primary/secondary keywords,
 *                related entities, audience, likely competitor gaps
 *   outline   -> H1, H2/H3 tree, FAQ seeds, internal-link suggestions,
 *                schema recommendation
 *   draft     -> full Arabic article body as typed content blocks + metadata
 *
 * Design rules:
 *  - The API key is read from process.env and is NEVER logged or returned.
 *  - No stage blocks publishing. Word count is reported as `advisory`, and the
 *    caller decides. See src/utils/validation.ts for the blocking policy.
 *  - There is deliberately no "pad until word count is reached" loop: that
 *    produces repetition, which is a medical-content quality defect. If a draft
 *    comes back short, we say so and the editor expands it substantively.
 */

const ALLOWED_STAGES = new Set(["research", "outline", "draft"]);
const MAX_TOPIC = 200;
const MAX_KEYWORD = 80;

const SYSTEM_PROMPT = `You write formal, conservative Arabic medical education for a Gulf
audience (Saudi Arabia, UAE, Kuwait, Bahrain).

Hard rules:
- Educational and general only. No dosing instructions, no regimens, no
  step-by-step self-treatment, no home protocols.
- Never tell the reader how to obtain, buy, or source any medicine.
- Never include phone numbers, WhatsApp handles, or vendor details.
- Do not invent studies, statistics, doctor names, institutions, or citations.
  If you are not confident a source exists, omit it.
- Do not present one country's law as another country's law.
- Do not repeat the same sentence or idea in different words.
- Return valid JSON only, with no markdown fences.`;

function safeParseJson(rawText) {
  if (!rawText || typeof rawText !== "string") return {};
  let text = rawText.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const jsonSub = text.slice(start, end + 1);
      try {
        return JSON.parse(jsonSub);
      } catch {
        const sanitized = jsonSub.replace(/,\s*([}\]])/g, "$1");
        try {
          return JSON.parse(sanitized);
        } catch {
          return {};
        }
      }
    }
    return {};
  }
}

async function openaiJson(key, messages, maxTokens = 8000) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: maxTokens,
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
  return safeParseJson(text);
}

function normalizeBlocks(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((block) => block && ["p", "h2", "h3", "ul", "callout"].includes(block.type))
    .map((block) => ({
      type: block.type,
      text: typeof block.text === "string" ? block.text : undefined,
      items: Array.isArray(block.items) ? block.items.filter((i) => typeof i === "string") : undefined,
      tone: ["info", "warning", "emergency"].includes(block.tone) ? block.tone : undefined,
    }));
}

function str(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function strArray(value, limit = 12) {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string" && v.trim()).slice(0, limit) : [];
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return json(res, 503, {
      error: "OPENAI_API_KEY غير مُعدّ. أضيفيه من إعدادات بيئة Vercel. المفتاح لا يُوضع في الشيفرة.",
      configured: false,
      blocker: "EXTERNAL: Vercel environment variable",
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const stage = ALLOWED_STAGES.has(body.stage) ? body.stage : "draft";
  const topic = str(body.topic).slice(0, MAX_TOPIC);
  const keyword = str(body.primaryKeyword, topic).slice(0, MAX_KEYWORD);
  const cluster = str(body.cluster, "safety").slice(0, 40);
  const country = str(body.country, "").slice(0, 40);
  const existingSlugs = strArray(body.existingSlugs, 400);

  if (!topic) return json(res, 400, { error: "الحقل topic مطلوب." });

  const context = `Topic: ${topic}
Primary keyword: ${keyword}
Cluster: ${cluster}
${country ? `Country context: ${country}` : "Country context: general Gulf (do not assert a specific country's law)"}
${existingSlugs.length ? `Existing article slugs on the site (use for internal-link suggestions): ${existingSlugs.slice(0, 60).join(", ")}` : ""}`;

  const prompts = {
    research: `${context}

Produce editorial research for planning an original Arabic educational article.
Return JSON:
{"searchIntent":"informational|navigational|commercial|transactional",
 "audience":"",
 "primaryKeyword":"",
 "secondaryKeywords":[],
 "longTailQuestions":[],
 "entities":[],
 "synonyms":[],
 "countryModifiers":[],
 "competitorGaps":[],
 "contentAngle":"",
 "risksToAvoid":[]}

Do not scrape or restate any competitor's text. Describe gaps, not their content.`,

    outline: `${context}

Produce a structural outline only (no body paragraphs).
Return JSON:
{"h1":"",
 "seoTitle":"",
 "metaDescription":"",
 "excerpt":"",
 "outline":[{"h2":"","h3":[],"purpose":""}],
 "faqSeeds":[{"q":"","a":""}],
 "internalLinkSuggestions":[{"slug":"","reason":""}],
 "schemaRecommendation":{"primary":"Article|MedicalWebPage|FAQPage","rationale":""},
 "sourceCategories":[]}

Rules:
- Only recommend "Article" or "MedicalWebPage" or "FAQPage" as schema.
- NEVER recommend Drug, Product, Offer, Review or AggregateRating schema; this
  site does not sell anything and has no ratings.`,

    draft: `${context}

Write a complete original Arabic educational article.
Return JSON:
{"title":"","h1":"","excerpt":"","seoTitle":"","metaDescription":"",
 "primaryKeyword":"","secondaryKeywords":[],
 "blocks":[{"type":"p|h2|h3|ul|callout","text":"","items":[],"tone":"info|warning|emergency"}],
 "faqs":[{"q":"","a":""}],
 "internalLinkSuggestions":[{"slug":"","reason":""}],
 "sourceCategories":[]}

Structure requirements:
- 6-9 H2 sections, each with real substance; 2-4 H3 where genuinely useful.
- Every paragraph must add new information. No restating earlier paragraphs.
- Include, where relevant: what the condition/topic is, who is affected,
  warning signs, when to seek licensed care, follow-up, and the limits of
  online information.
- Do NOT pad to reach a word count. Shorter and accurate beats long and padded.`,
  };

  let result;
  try {
    result = await openaiJson(key, [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompts[stage] },
    ]);
  } catch (err) {
    const status = err && err.status === 401 ? 502 : 502;
    return json(res, status, {
      error: "تعذر إكمال التوليد من مزود الذكاء الاصطناعي. لم يُحفظ شيء.",
      configured: true,
      stage,
    });
  }

  const blocks = normalizeBlocks(result.blocks);
  const stats = bodyStructure(blocks);
  const words = bodyWordCount(blocks);
  const meetsDepth = words >= MIN_BODY_WORDS;

  return json(res, 200, {
    configured: true,
    stage,
    publishAllowed: true,
    result: {
      title: str(result.title),
      h1: str(result.h1),
      excerpt: str(result.excerpt),
      seoTitle: str(result.seoTitle),
      metaDescription: str(result.metaDescription),
      primaryKeyword: str(result.primaryKeyword, keyword),
      secondaryKeywords: strArray(result.secondaryKeywords),
      searchIntent: str(result.searchIntent),
      audience: str(result.audience),
      longTailQuestions: strArray(result.longTailQuestions),
      entities: strArray(result.entities),
      synonyms: strArray(result.synonyms),
      countryModifiers: strArray(result.countryModifiers),
      competitorGaps: strArray(result.competitorGaps),
      contentAngle: str(result.contentAngle),
      risksToAvoid: strArray(result.risksToAvoid),
      outline: Array.isArray(result.outline) ? result.outline : [],
      blocks,
      faqs: Array.isArray(result.faqs)
        ? result.faqs.filter((f) => f && f.q && f.a).slice(0, 12)
        : [],
      internalLinkSuggestions: Array.isArray(result.internalLinkSuggestions)
        ? result.internalLinkSuggestions.slice(0, 12)
        : [],
      schemaRecommendation: result.schemaRecommendation || {
        primary: "MedicalWebPage",
        rationale: "Educational medical page; no product or rating data exists.",
      },
      sourceCategories: strArray(result.sourceCategories),
    },
    metrics: {
      wordCount: words,
      paragraphs: stats.paragraphs,
      h2: stats.h2,
      h3: stats.h3,
      meetsRecommendedDepth: meetsDepth,
      recommendedDepth: MIN_BODY_WORDS,
      missingWords: Math.max(0, MIN_BODY_WORDS - words),
    },
    advisory: meetsDepth
      ? undefined
      : `المسودة ${words} كلمة، وأقل من العمق المقترح (${MIN_BODY_WORDS}). هذا تنبيه تحريري فقط ولا يمنع النشر — وسّعي المحتوى بمعلومات حقيقية لا بتكرار.`,
  });
}
