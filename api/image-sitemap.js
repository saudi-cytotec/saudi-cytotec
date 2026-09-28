const SITE = "https://saudiersaa.com";

const entries = [
  {
    page: "/",
    images: [
      "/images/Bannerrr.png",
      "/images/logo.png",
      "/images/site-medical-banner.png",
      "/images/site-consultation-banner.png",
    ],
  },
  { page: "/what-is-cytotec", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/service-areas", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/blog", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
  { page: "/womens-health", images: ["/images/site-medical-banner.png", "/images/site-consultation-banner.png"] },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildXml() {
  const body = entries.map(({ page, images }) => {
    const imageXml = images
      .map((image) => `    <image:image><image:loc>${escapeXml(SITE + image)}</image:loc></image:image>`)
      .join("\n");
    return `  <url>\n    <loc>${escapeXml(SITE + page)}</loc>\n${imageXml}\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`;
}

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).send("Method Not Allowed");
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(buildXml());
}
