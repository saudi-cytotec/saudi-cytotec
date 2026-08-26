import { testArticleReport } from "./testArticle";

const report = [
  "REPORT",
  String(testArticleReport.wordCount),
  String(testArticleReport.paragraphs),
  String(testArticleReport.h2),
  String(testArticleReport.h3),
  String(testArticleReport.expansions),
  testArticleReport.validationPassed ? "PASS" : "FAIL",
  testArticleReport.publishAllowed ? "PUBLISH_YES" : "PUBLISH_NO",
].join("|");

export const REPORT_BRIDGE = report;
