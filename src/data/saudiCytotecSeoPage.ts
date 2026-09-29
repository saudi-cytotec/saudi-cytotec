import { buildCytotecPillarBlocks } from "./longFormContent";
import type { StaticPage } from "../types";

export const saudiCytotecSeoPage: StaticPage = {
  path: "/حبوب-سايتوتك-في-السعودية",
  title: "حبوب سايتوتك في السعودية",
  h1: "حبوب سايتوتك في السعودية | Cytotec وميزوبروستول",
  metaTitle: "حبوب سايتوتك في السعودية | Cytotec وميزوبروستول",
  metaDescription:
    "دليل مركز لعبارة حبوب سايتوتك في السعودية، يشرح Cytotec وميزوبروستول والمصطلحات المحلية مثل سايتوتك الرياض وسايتوتك النهدي، مع معلومات دوائية ومصادر رسمية وسياق البحث السعودي دون جرعات أو وعود بتوفر المنتج.",
  blocks: buildCytotecPillarBlocks(),
};
