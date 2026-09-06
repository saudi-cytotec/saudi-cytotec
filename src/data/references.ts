import type { Reference } from "../types";
import { countryCornerstoneReferences } from "./countryCornerstones/references";

export const references: Record<string, Reference> = {
  ...countryCornerstoneReferences,
  fdaLabel: {
    id: "fdaLabel",
    title: "Cytotec (misoprostol) prescribing information",
    source: "U.S. Food and Drug Administration",
    url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2012/019268s047lbl.pdf",
    note: "النشرة الرسمية تتضمن الاستطباب المعتمد وتحذير الحمل والآثار الضارة وموانع الاستخدام.",
  },
  dailyMed: {
    id: "dailyMed",
    title: "Misoprostol tablet — drug label",
    source: "DailyMed / U.S. National Library of Medicine",
    url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c4fe14fb-0a43-4c31-9cd6-29eb0d156705",
    note: "ملخص تنظيمي للنشرة يتضمن التحذيرات والآثار الجانبية والحركية الدوائية.",
  },
  whoEml: {
    id: "whoEml",
    title: "WHO Model List of Essential Medicines",
    source: "World Health Organization",
    url: "https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines/essential-medicines-lists",
    note: "تُدرج منظمة الصحة العالمية ميزوبروستول ضمن أدوية أساسية لاستطبابات سريرية محددة تحت أنظمة صحية.",
  },
  whoPph: {
    id: "whoPph",
    title: "WHO recommendations on uterotonics for postpartum haemorrhage",
    source: "World Health Organization",
    url: "https://www.who.int/publications/i/item/9789241550420",
    note: "توصيات سريرية لمقدمي الخدمة حول أدوية تقلص الرحم بعد الولادة، وليس للاستخدام الذاتي.",
  },
  medlinePlus: {
    id: "medlinePlus",
    title: "Misoprostol",
    source: "MedlinePlus",
    url: "https://medlineplus.gov/druginfo/meds/a689009.html",
    note: "شرح مبسط للمريض عن الاستخدام المعتمد والتحذيرات العامة.",
  },
  nhsMedicines: {
    id: "nhsMedicines",
    title: "About misoprostol",
    source: "NHS",
    url: "https://www.nhs.uk/medicines/",
    note: "مرجع عام لثقافة استخدام الأدوية والمراجعة الطبية في الأنظمة الصحية.",
  },
  sfda: {
    id: "sfda",
    title: "Saudi Food and Drug Authority",
    source: "الهيئة العامة للغذاء والدواء",
    url: "https://www.sfda.gov.sa/",
    note: "الجهة التنظيمية للأدوية في المملكة العربية السعودية.",
  },
  moh: {
    id: "moh",
    title: "Ministry of Health — Kingdom of Saudi Arabia",
    source: "وزارة الصحة السعودية",
    url: "https://www.moh.gov.sa/",
    note: "مظلة الخدمات الصحية والتوعية الرسمية في المملكة.",
  },
  whoSafeMotherhood: {
    id: "whoSafeMotherhood",
    title: "Maternal health",
    source: "World Health Organization",
    url: "https://www.who.int/health-topics/maternal-health",
    note: "إطار عام لصحة الأمومة والمخاطر التي تستدعي رعاية مؤسسية.",
  },
  acog: {
    id: "acog",
    title: "American College of Obstetricians and Gynecologists",
    source: "ACOG",
    url: "https://www.acog.org/womens-health",
    note: "مواد تعليمية عامة لصحة المرأة والحمل، تختلف التوصيات حسب البلد.",
  },
  nice: {
    id: "nice",
    title: "NICE guidance hub",
    source: "National Institute for Health and Care Excellence",
    url: "https://www.nice.org.uk/guidance",
    note: "إرشادات سريرية بريطانية تُستخدم أحياناً كمرجع منهجي، وليست بديلاً عن التنظيم المحلي.",
  },
  cochrane: {
    id: "cochrane",
    title: "Cochrane Library",
    source: "Cochrane",
    url: "https://www.cochranelibrary.com/",
    note: "مراجعات منهجية تساعد على فهم قوة الدليل، لا على اتخاذ قرار فردي دون طبيب.",
  },
  whoMedicalEligibility: {
    id: "whoMedicalEligibility",
    title: "Medical eligibility criteria for contraceptive use",
    source: "World Health Organization",
    url: "https://www.who.int/publications/i/item/9789241549158",
    note: "مرجع سريري لأهلية وسائل تنظيم الأسرة، وليس دليلاً ذاتياً للعلاج.",
  },
  figo: {
    id: "figo",
    title: "International Federation of Gynecology and Obstetrics",
    source: "FIGO",
    url: "https://www.figo.org/",
    note: "اتحاد مهني دولي ينشر بيانات ومواقف سريرية للمختصين.",
  },
  ema: {
    id: "ema",
    title: "European Medicines Agency",
    source: "EMA",
    url: "https://www.ema.europa.eu/en",
    note: "هيئة تنظيمية أوروبية لنشرات الأدوية وتقييم المنافع والمخاطر.",
  },
};

export const referenceList = Object.values(references);
