import { makeArticle } from "../../utils/content";
import type { Article, ClusterId, ContentBlock } from "../../types";

const cornerstoneMap: Record<ClusterId, string[]> = {
  definition: ["/what-is-cytotec", "/misoprostol", "/medical-sources", "/abortion-pills-saudi-arabia"],
  uses: ["/medical-uses", "/safety", "/what-is-cytotec"],
  safety: ["/safety", "/medical-disclaimer", "/when-to-see-doctor", "/abortion-pills-saudi-arabia"],
  "side-effects": ["/side-effects", "/when-to-see-doctor", "/safety"],
  pregnancy: ["/early-pregnancy", "/safety", "/when-to-see-doctor", "/abortion-pills-saudi-arabia"],
  "womens-health": ["/womens-health", "/early-pregnancy", "/when-to-see-doctor"],
  faq: ["/faq", "/medical-disclaimer", "/what-is-cytotec"],
  interactions: ["/safety", "/medical-uses", "/when-to-see-doctor"],
  emergency: ["/when-to-see-doctor", "/side-effects", "/contact", "/abortion-pills-saudi-arabia"],
  evidence: ["/medical-sources", "/medical-disclaimer", "/about"],
  geographic: [
    "/abortion-pills-saudi-arabia",
    "/abortion-pills-uae",
    "/abortion-pills-kuwait",
    "/abortion-pills-bahrain",
    "/safety",
    "/what-is-cytotec",
  ],
};

const referenceMap: Record<ClusterId, string[]> = {
  definition: ["fdaLabel", "dailyMed", "medlinePlus", "sfda"],
  uses: ["fdaLabel", "whoPph", "whoEml", "figo"],
  safety: ["fdaLabel", "sfda", "moh", "dailyMed"],
  "side-effects": ["fdaLabel", "dailyMed", "medlinePlus"],
  pregnancy: ["fdaLabel", "acog", "whoSafeMotherhood", "moh"],
  "womens-health": ["acog", "moh", "whoSafeMotherhood"],
  faq: ["fdaLabel", "medlinePlus", "sfda"],
  interactions: ["fdaLabel", "dailyMed", "ema"],
  emergency: ["moh", "whoSafeMotherhood", "fdaLabel"],
  evidence: ["fdaLabel", "whoEml", "cochrane", "nice", "sfda"],
  geographic: ["fdaLabel", "sfda", "moh", "dailyMed"],
};

export function edu(
  cluster: ClusterId,
  data: {
    slug: string;
    title: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
    excerpt: string;
    related: string[];
    blocks: ContentBlock[];
    faqs?: { q: string; a: string }[];
    references?: string[];
  },
): Article {
  return makeArticle({
    cluster,
    cornerstones: cornerstoneMap[cluster],
    references: data.references ?? referenceMap[cluster],
    ...data,
  });
}
