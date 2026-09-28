import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { SITE } from "../src/data/site";

const IMAGE_NS = "http://www.google.com/schemas/sitemap-image/1.1";

const IMAGE_ENTRIES = [
  { page: "/", images: ["/images/Bannerrr.png", "/images/logo.png", "/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/what-is-cytotec", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/service-areas", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/blog", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/womens-health", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
];

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function emitImageSitemap(): Plugin {
  return {
    name: "emit-image-sitemap",
    buildStart() {
      const body = IMAGE_ENTRIES.map(({ page, images }) => {
        const imageXml = images.map((image) => `    <image:image><image:loc>${escapeXml(SITE.domain + image)}</image:loc></image:image>`).join("\n");
        return `  <url>\n    <loc>${escapeXml(SITE.domain + (page === "/" ? "/" : page))}</loc>\n${imageXml}\n  </url>`;
      }).join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="${IMAGE_NS}">\n${body}\n</urlset>\n`;
      const target = path.resolve("public/image-sitemap.xml");
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, xml);
      console.log(`[image-sitemap] wrote ${IMAGE_ENTRIES.reduce((sum, item) => sum + item.images.length, 0)} image references to public/image-sitemap.xml`);
    },
  };
}
