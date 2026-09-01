# Competitor Research — designated competitors only

Date: 2026-08-30. Scope is intentionally limited to the three requested competitors:

1. `https://saudi-cytotec.com/`
2. `https://cytotecmedicine.com/`
3. `https://cytotecsa.com/`

No other competitor was used. Findings below are structural only; no wording, claims, testimonials, prices, sales promises, dosing instructions, or unsafe medical instructions were copied.

## Competitor 1 — saudi-cytotec.com

### Useful structural patterns observed

- Broad navigation: home, about, products/topic pages, FAQ, testimonials-like trust section, contact, city coverage, quick links.
- Homepage exposes multiple pathways instead of relying on a single article.
- FAQ sits near conversion areas.
- Basic safety blocks are placed after commercial blocks.
- About/contact/privacy/disclaimer-style pages exist or are linked.

### Weaknesses deliberately removed

- Commercial drug-store framing, purchase/order CTAs, delivery and payment claims.
- Authenticity claims and product-card language.
- Testimonials / experience snippets.
- Specific protocols or individualized medical direction.
- City coverage tied to delivery promises.

### Original saudiersaa implementation

- Rebuilt discovery around information first: `/topics`, `/what-is-cytotec`, `/misoprostol`, `/medical-uses`, `/safety`, `/side-effects`, `/when-to-see-doctor`, `/faq`, `/medical-sources`, `/service-areas`, `/blog`, `/about`, `/contact`.
- Article pages connect to cluster hub, relevant FAQ, safety pages, resources, service-area hub, previous/next in cluster, and related articles.
- Contact CTA uses the approved WhatsApp number only for general content navigation, with explicit no-sale/no-diagnosis framing.

## Competitor 2 — cytotecmedicine.com

### Useful structural patterns observed

- Geographic discovery is prominent.
- Cities are grouped by region.
- City names are exposed from the homepage.
- User pathway repeats city → topic → action.

### Weaknesses deliberately removed

- Thin duplicated city blocks.
- Keyword stuffing city names.
- Delivery/availability claims and 24/7 sales language.
- City pages that differ only by name or commercial promise.

### Original saudiersaa implementation

- Reused `/service-areas` as the authoritative Saudi hub for the query family around `سايتوتك في السعودية`.
- Preserved the protected 20-article geographic layer through the existing CMS build path, with distinct healthcare-access context rather than swapped-name templates.
- The hub links to all priority cities and back into safety, FAQ, emergency, and source content.
- Each city page carries unique value such as pilgrimage/visitor context, inter-city movement, or distance-to-care planning — never delivery, pricing, or purchase language.

## Competitor 3 — cytotecsa.com

### Useful structural patterns observed

- Very clear CTA visibility.
- Simple repeated journey.
- City chooser and topic cards make discovery easy.
- FAQ near decision points.
- Internal paths repeat the same next action.

### Weaknesses deliberately removed

- Store/product/price/quantity/delivery journey.
- Buyer-intent CTAs and city-specific purchase flows.
- Unverified customer comments.
- Commercial claims around legality, availability or authenticity.

### Original saudiersaa implementation

Conversion model is intentionally educational:

Information → trust → safety/context → FAQ → next step → relevant resource/contact.

This is implemented via:

- contextual links on homepage, cluster pages, FAQ hub, service-area hub and article pages;
- `ContactCta` using approved WhatsApp `00966538159747` for general website/content navigation only;
- `CareReferral` for official emergency and health-line routing;
- no Drug/Product/Offer/Review/AggregateRating schema.

## Final architecture advantages

- Stronger topic hubs and cluster graph.
- 100-topic blueprint with intent, keywords, URL, related links, internal links, FAQ opportunities, references and next step.
- Safer geographic discovery with no doorway pages.
- FAQ hub with JSON-LD and contextual links.
- Article discovery through related articles, previous/next and cluster links.
- Metadata preserved, selected image fields remain independent, and the approved social-share fallback is metadata-only for OG/Twitter.
- CMS remains the single source for articles, map, competitor gap matrix and geo registry.
