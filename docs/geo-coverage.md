# Geographic Coverage Strategy — Saudi service-area architecture

Date: 2026-08-30. Scope: Saudi Arabia only, matching the requested regional architecture.

## Policy

- No thin city pages.
- No duplicate city templates with swapped city names.
- No doorway pages.
- No delivery, availability, pricing or drug-store claims.
- A standalone city page may exist only when it contains genuinely distinct local healthcare-resource information managed through the existing CMS.

## Implemented route

`/service-areas` is the canonical service-area hub. It groups cities by region, explains that medical facts do not change by city, and sends readers to relevant topic hubs, FAQs, safety pages, resources and official care pathways.

## Regions and cities

| Region | Cities | Implementation |
|---|---|---|
| Central | Riyadh, Qassim, Hail | Regional section with city-specific healthcare-access notes and 937/997 references. |
| Western | Jeddah, Makkah, Madinah, Taif | Regional section focused on licensed facilities and emergency signs, not availability. |
| Eastern | Dammam, Khobar, Qatif, Al Ahsa, Jubail | Regional section linking city discovery to safety, FAQ and official resources. |
| Southern/Other | Abha, Jazan, Najran, Tabuk | Regional section emphasizing urgent-care planning where distance can matter. |

## Why no city pages were generated

The requested rule is to avoid mass-generated thin city pages. For this medical-information platform, the core answer is the same in each Saudi city: use licensed healthcare, understand warnings, and seek emergency care for danger signs. The city-specific value currently fits inside a single regional hub.

If the CMS later stores verified local-resource information for a city — for example, a curated official directory page or a health-system pathway that materially differs — then a city page can be created with:

- unique local healthcare discovery information;
- relevant women's-health topics;
- emergency/resource information;
- related articles;
- local FAQs;
- legitimate references;
- contextual internal links.

Until then, `/service-areas` is intentionally stronger and safer than duplicated city landing pages.
