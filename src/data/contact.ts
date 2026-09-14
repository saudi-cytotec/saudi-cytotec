/**
 * Contact channels — official health lines + approved WhatsApp editorial channel.
 *
 * Commit 8ac2a34: WhatsApp 00966530945626 as the official editorial/drug-info
 * channel (green identity). Health lines remain the primary medical channels.
 *
 * Verified sources:
 *  - Saudi Ministry of Health contact centre: 937 (inside KSA), +966 920005937
 *    (from outside KSA). See https://www.moh.gov.sa
 *  - Saudi medical emergency (ambulance): 997
 *  - Approved WhatsApp editorial channel: 00966530945626 / +966 53 094 5626
 *    (wa.me/966530945626) — for general drug-info and editorial queries only,
 *    no prescriptions, no direct sales.
 *
 * Standard GCC emergency numbers are listed below (UAE 998, Kuwait 112,
 * Bahrain 999). Non-emergency health lines outside Saudi Arabia are NOT listed
 * rather than guessed; each entry links the reader to the ministry's own site.
 */

export interface HealthLine {
  country: string;
  code: string;
  flag: string;
  lines: { label: string; value: string; note?: string }[];
  authority: string;
  authorityUrl: string;
}

export const WHATSAPP_CHANNEL = {
  digits: "966530945626",
  display: "+966 53 094 5626",
  raw: "00966530945626",
  url: "https://wa.me/966530945626",
  note: "للاستفسارات التحريرية والدوائية العامة فقط — بلا وصفات فردية ولا بيع مباشر",
};

export const HEALTH_LINES: HealthLine[] = [
  {
    country: "السعودية",
    code: "sa",
    flag: "🇸🇦",
    lines: [
      { label: "واتساب — استفسارات", value: WHATSAPP_CHANNEL.display, note: WHATSAPP_CHANNEL.note },
      { label: "مركز اتصال وزارة الصحة", value: "937", note: "من داخل المملكة، على مدار الساعة" },
      { label: "من خارج المملكة", value: "+966 920005937" },
      { label: "الإسعاف / الطوارئ الطبية", value: "997" },
    ],
    authority: "وزارة الصحة السعودية",
    authorityUrl: "https://www.moh.gov.sa",
  },
  {
    country: "الإمارات",
    code: "ae",
    flag: "🇦🇪",
    lines: [{ label: "الطوارئ الطبية", value: "998" }],
    authority: "وزارة الصحة ووقاية المجتمع",
    authorityUrl: "https://www.mohap.gov.ae",
  },
  {
    country: "الكويت",
    code: "kw",
    flag: "🇰🇼",
    lines: [{ label: "الطوارئ الطبية", value: "112" }],
    authority: "وزارة الصحة الكويتية",
    authorityUrl: "https://www.moh.gov.kw",
  },
  {
    country: "البحرين",
    code: "bh",
    flag: "🇧🇭",
    lines: [{ label: "الطوارئ الطبية", value: "999" }],
    authority: "وزارة الصحة البحرينية",
    authorityUrl: "https://www.moh.gov.bh",
  },
];

/** Editorial contact for corrections only. Never used for medical advice. */
export const EDITORIAL_EMAIL = "info@saudiersaa.com";
