const RESERVED = new Set([
  "admin",
  "api",
  "blog",
  "search",
  "sitemap",
  "contact",
  "about",
  "privacy",
  "faq",
  "login",
  "preview",
]);

export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function suggestSlug(keyword: string): string {
  const cleaned = normalizeSlug(keyword).replace(/[0-9]/g, "");
  const parts = cleaned.split("-").filter(Boolean).slice(0, 4);
  return parts.join("-");
}

export function slugWordCount(slug: string): number {
  return slug.split("-").filter(Boolean).length;
}

export function isValidShortSlug(slug: string): { ok: boolean; reason: string } {
  if (!slug) return { ok: false, reason: "الرابط المختصر مطلوب." };
  if (/[A-Z]/.test(slug)) return { ok: false, reason: "يجب أن يكون الرابط بأحرف إنجليزية صغيرة فقط." };
  if (/[\u0600-\u06FF]/.test(slug)) return { ok: false, reason: "لا يُسمح بأي حروف عربية في الرابط." };
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(slug)) {
    return { ok: false, reason: "الرابط يجب أن يكون إنجليزياً صغيراً مفصولاً بشرطات، بلا أرقام أو رموز." };
  }
  if (/\d/.test(slug)) return { ok: false, reason: "لا يُسمح بالأرقام أو التواريخ في الرابط." };
  const words = slugWordCount(slug);
  if (words < 1 || words > 4) return { ok: false, reason: "الرابط يجب أن يتكوّن من 1 إلى 4 كلمات ذات معنى." };
  if (slug.length > 40) return { ok: false, reason: "الرابط طويل جداً. اختصريه إلى كلمات مفتاحية قصيرة." };
  if (RESERVED.has(slug)) return { ok: false, reason: "هذا الرابط محجوز للنظام." };
  const filler = new Set(["the", "and", "for", "with", "from", "about", "this", "that"]);
  if (slug.split("-").some((w) => filler.has(w))) {
    return { ok: false, reason: "أزيلي الكلمات الزائدة من الرابط وأبقي المعنى فقط." };
  }
  return { ok: true, reason: "رابط إنجليزي قصير وصالح." };
}
