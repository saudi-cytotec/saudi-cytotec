import { SITE } from "../data/site";
import type { ManagedArticle } from "../types";
import { defaultImage } from "../utils/content";
import { runGenerationPipeline } from "./generationPipeline";

const topic = "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات";

export const testGeneration = runGenerationPipeline({
  topic,
  primaryKeyword: "سايتوتك",
  cluster: "definition",
  searchIntent: "informational",
  articleType: "explainer",
});

if (testGeneration.wordCount < 2000) {
  throw new Error(
    `Test article body word count is ${testGeneration.wordCount}, missing ${testGeneration.missingWords}. Generator failed.`,
  );
}

export const testArticle: ManagedArticle = {
  id: "cms-test-cytotec-uses-warnings",
  slug: "cytotec-uses-warnings",
  title: topic,
  h1: "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات في إطار تعليمي",
  metaTitle: "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات",
  metaDescription:
    "مقال تعليمي مطوّل عن سايتوتك وميزوبروستول: التعريف، الاستخدامات تحت الإشراف، التحذيرات، ومتى تجب مراجعة الطبيب.",
  cluster: "definition",
  excerpt:
    "شرح تعليمي موسّع يفصل بين الاسم التجاري والمادة الفعالة، ويوضح حدود الاستطباب والتحذير دون أي مسار علاجي فردي.",
  publishedAt: "2026-03-22",
  updatedAt: "2026-03-22",
  image: defaultImage("definition"),
  imageAlt: "عنصر بصري تعليمي صغير",
  related: ["cytotec-definition", "approved-medical-uses-misoprostol", "general-safety-warnings"],
  cornerstones: ["/what-is-cytotec", "/medical-uses", "/safety", "/medical-disclaimer"],
  references: ["fdaLabel", "sfda", "dailyMed", "medlinePlus"],
  blocks: testGeneration.blocks,
  faqs: [
    {
      q: "هل يكفي هذا المقال لاتخاذ قرار علاجي؟",
      a: "لا. المقال تعليمي عام ولا يستبدل الفحص أو الوصفة أو المتابعة.",
    },
    {
      q: "هل يتضمن المقال جرعة أو طريقة استخدام؟",
      a: "لا. الجرعة قرار سريري فردي، ونشرها للعامة يُساء استخدامه.",
    },
  ],
  status: "draft",
  primaryKeyword: "سايتوتك",
  secondaryKeywords: ["ميزوبروستول", "الاستخدامات الطبية", "تحذيرات سايتوتك"],
  searchIntent: "informational",
  articleType: "explainer",
  seoTitle: "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات",
  ogTitle: "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات",
  ogDescription:
    "مقال تعليمي مطوّل عن سايتوتك وميزوبروستول: التعريف، الاستخدامات تحت الإشراف، التحذيرات، ومتى تجب مراجعة الطبيب.",
  canonical: `${SITE.domain}/blog/cytotec-uses-warnings`,
  description:
    "شرح تعليمي موسّع يفصل بين الاسم التجاري والمادة الفعالة، ويوضح حدود الاستطباب والتحذير دون أي مسار علاجي فردي.",
  slugLocked: false,
  source: "cms",
  internalLinks: ["/what-is-cytotec", "/safety", "/when-to-see-doctor"],
  hasDisclaimer: true,
};

export const testArticleReport = {
  topic,
  wordCount: testGeneration.wordCount,
  paragraphs: testGeneration.paragraphs,
  h2: testGeneration.h2,
  h3: testGeneration.h3,
  expansions: testGeneration.expansions,
  validationPassed: testGeneration.ok,
  publishAllowed: testGeneration.publishAllowed && testGeneration.wordCount >= 2000,
  missingWords: testGeneration.missingWords,
};

export const TEST_REPORT_LINE = `TEST_REPORT wordCount=${testArticleReport.wordCount} paragraphs=${testArticleReport.paragraphs} h2=${testArticleReport.h2} h3=${testArticleReport.h3} expansions=${testArticleReport.expansions} passed=${testArticleReport.validationPassed} publish=${testArticleReport.publishAllowed}`;
