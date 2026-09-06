import type { ArticleFaq, ClusterId, ContentBlock, ResourceLink, StaticPage } from "../../types";

export interface CountrySection {
  id: string;
  heading: string;
  blocks: ContentBlock[];
  /** Sources are displayed beside the claims, not just in a closing bibliography. */
  sources: string[];
  links?: ResourceLink[];
}

export interface CountryFaq extends ArticleFaq {
  sources: string[];
}

/** A static editorial cornerstone, not a CMS article or a geographic doorway. */
export interface CountryCornerstone extends StaticPage {
  kind: "country-cornerstone";
  countryCode: "SA" | "AE" | "KW" | "BH";
  countryName: string;
  primaryKeywords: [string, string];
  updatedAt: string;
  topicClusters: ClusterId[];
  /** The inherited blocks are the direct answer, rendered before the long-form sections. */
  introSources: string[];
  emergency: { text: string; phone: string; source: string };
  sections: CountrySection[];
  faqs: CountryFaq[];
}
