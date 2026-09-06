# Final Forensic SEO Report - Saudiersaa.com

Date: 2026-09-06
Branch: main (merged from arena/01a075a3-saudi-cytotec)
Build: saudiersaa:e636488:2026-09-06

## 1. ما الذي تم تنظيفه ولماذا؟

تم تنظيف 23 صفحة doorway مدينة (Riyadh, Jeddah, Makkah, Madinah, Dammam, Taif, Abha, Jazan, Najran, Tabuk, Hail, Buraidah, Baha, Arar, Sakaka + regions) + صفحة جغرافية cluster + صفحة abortion-medications عالية المخاطر. السبب: محتوى مكرر thin يستهدف أسماء مدن لأغراض SEO (city stuffing) بدون قيمة طبية فريدة، يصنف كـ doorway pages وفق Google Spam Policies. تم دمج محتواها العام في /service-areas كدليل وطني موحد للوصول للرعاية.

كما تم تنظيف 4 أنماط regex في redirects.json كانت تسبب redirect errors في GSC: `/حبوب-سايتوتك-للبيع.*` و `/(?:2018|2019|2020|2021)/(.*)` و `/(.*)/feed` و `/(.*)/feed/` - Vercel لا يدعم `(?:` ولا `.*` بدون param. تم تحويلها إلى 404 مقصود أو 410 صريح.

تم تنظيف صورة WhatsApp banner التجارية (saudiersaa-article-whatsapp-banner.png) وإزالتها من القائمة المعتمدة، لتقليل الطابع التجاري.

تم توسيع مقال cytotec-uses من 244 كلمة إلى 992 كلمة بمحتوى توعوي آمن جاهز لـ AI Overviews.

## 2. خريطة الروابط التاريخية (Historical URL Map)

موجودة في `docs/historical-url-map.md` مع جدول كامل OLD URL, STATUS, CONTENT TYPE, SEO VALUE, DECISION, TARGET, REASON.

الخلاصة:
- KEEP: 130 URL (13 static pillars + 5 extra routes + 10 clusters + blog index + 101 articles)
- 301: 103 قاعدة (60 إلى /service-areas جغرافية فقط، 19 إلى /what-is-cytotec تعليمي، 5 إلى /about، 5 إلى /womens-health، 3 إلى /، 3 إلى /privacy، 2 إلى /medical-uses، 1 إلى /contact، 1 إلى /when-to-see-doctor، 1 إلى /misoprostol، 1 إلى /blog/anemia-womens-health، 2 إلى 410)
- 410: 2 صريح (/feed، /feed/)
- NOINDEX مقصود: 3 (/admin، /search، /api)
- 404 مقصود: باقي الروابط غير الموجودة تعود SPA 404 وهو صحيح
- لا سلاسل (chains 0)، لا حلقات (loops 0)، لا تحويل جماعي للصفحة الرئيسية إلا 3 روابط عربية للرئيسية وهي ذات صلة حقيقية.

## 3. ما الذي تم الاحتفاظ به، إعادة كتابته، دمجه، وحذفه ولماذا؟

**KEEP (130):**
- كل الـ 10 pillars الأساسية (what-is-cytotec, misoprostol, medical-uses, safety, side-effects, when-to-see-doctor, faq, womens-health, early-pregnancy, medical-sources) - قيمة عالية، توعوية، مطابقة للهوية.
- 100 مقال static (clusters 01-10) - تم تحسين تمييزها عبر تعديل expand.ts لتقليل التكرار، كلها >2000 كلمة، فريدة في points.
- 1 مقال published (cytotec-uses) - تمت إعادة كتابته وتوسيعه.

**REWRITE (2):**
- cytotec-uses: من 244 إلى 992 كلمة، إضافة إجابة مباشرة، H2/H3 واضحة، FAQs حقيقية، تحذيرات، مصادر رسمية، حدود واضحة.
- expand.ts: تعديل فقرة clusterFrames intro/scope لتشمل point0/point1 الفريد لكل مقال، تقليل تكرار 33 crawled-not-indexed.

**MERGE (22):**
- 21 مدينة + 1 جغرافي تم دمج محتواها العام في /service-areas كدليل وطني. السبب: لا قيمة فريدة لكل مدينة في المحتوى الطبي، والمحتوى الجغرافي السابق كان doorway.

**301 REDIRECT (103):**
- 60 جغرافي إلى /service-areas - ذو صلة (دليل الوصول للرعاية).
- 54 legacy عربي/WordPress إلى pillar ذي صلة (مثل /سايتوتك/ → /what-is-cytotec، /الحمل-خارج-الرحم/ → /when-to-see-doctor). يحافظ على equity بدون طابع تجاري.
- 3 رئيسية عربية إلى / - ذو صلة حقيقية.

**REMOVE/410 (2 + 4 regex):**
- /feed و /feed/ → 410 - لا بديل مفيد.
- 4 regex محذوفة الآن 404 مقصود - أفضل من redirect error.

## 4. سياسة إعادة التوجيه (Redirect Policy)

- لا تحويل قديم → الصفحة الرئيسية إلا إذا كان ذا صلة حقيقية (فقط /الرئيسية/ و /مرحبا-بكم-في-موقعنا-الجديد/ → /).
- لا تحويل قديم → /service-areas لمجرد التخلص منه؛ فقط الروابط الجغرافية/المدن تذهب إلى /service-areas لأنه دليل الوصول للرعاية في مناطق المملكة، وهو ذو صلة.
- كل إعادة توجيه 301 تنتهي 200، قابلة للفهرسة، وذات صلة موضوعية.
- لا سلاسل، لا حلقات، تم التحقق عبر Counter (chains 0).
- www.saudiersaa.com/:path* → https://saudiersaa.com/:path* (301، canonical).

## 5. الأخطاء التقنية التي تم إصلاحها

- **2 Redirect errors في GSC:** سببهما regex غير مدعوم من Vercel `(?:` و `.*`. تمت إزالتها.
- **Orphan 1:** frequent-warning-questions كان بدون روابط داخلية، تم ربطه من common-myths-cytotec، الآن orphans 0.
- **410 مع destination:** emitRedirects.mjs كان يصدر 410 مع "/" وهو غير صالح، تم إصلاحه ليصدر 410 بدون destination.
- **auditSeo كان يعتبر 410 خطأ:** تم إصلاح vercelBad filter ليسمح بـ 410.
- **أصول معتمدة:** whatsapp banner كان في القائمة، تمت إزالته، الآن 3 أصول فقط معتمدة.
- **تكرار clusterFrames:** 10 مقالات تشترك في نفس 3 فقرات، تم تحسينه بإدخال point فريد.

## 6. حالة الفهرسة: 404، Noindex، Canonical، Redirects، Discovered، Crawled

- **48 404s (GSC):** كانت legacy عربية ومدن، الآن 301 ذو صلة أو 410/404 مقصود. تم توثيق كل واحد في historical-url-map.
- **1 Noindex (GSC):** مقصود (/admin، /search، /api) - لا يحتاج إصلاح، خارج sitemap، robots disallow.
- **1 Canonical (GSC):** كان بسبب duplicate بين المدن و /service-areas، تم حله بحذف المدن وتوحيد canonical ذاتي.
- **3 Redirects (GSC):** كانت سلاسل بين jizan/jazan و baha/albahah، الآن مباشرة إلى /service-areas بدون سلسلة.
- **2 Redirect errors (GSC):** تم إصلاحها بإزالة regex.
- **120 Discovered-not-indexed:** 100 مقال static حديث الاكتشاف، مع orphans 0 الآن وتحسن تمييز، يبقى KEEP ويترك للزحف الطبيعي، لا طلب فهرسة جماعي.
- **33 Crawled-not-indexed:** بسبب تكرار intro، تم تحسين expand.ts، وcytotec-uses موسع، وسيتحسن مع الزمن.

## 7. كيف تم تنظيف الحشو الجغرافي؟

- تم حذف 21 صفحة مدينة و 1 cluster جغرافي و 1 صفحة وطنية مكررة (total 23).
- لا توجد الآن صفحات منفصلة لـ Riyadh/Jeddah/Makkah/Madinah/Dammam/Taif/Abha/Jazan/Najran/Tabuk/Hail/Buraidah/Baha/Arar/Sakaka.
- المحتوى الجغرافي تم دمجه في /service-areas كدليل وطني موحد يشرح كيفية الوصول للرعاية عبر القنوات الرسمية 937 و 997 في جميع مناطق المملكة، بدون حشو أسماء مدن في فقرات.
- لا يوجد blocks من أسماء مدن في أي صفحة حالية (تم التحقق).

## 8. كيف تمت إزالة الطابع التجاري؟

- لا يوجد بيع، لا شراء، لا أسعار، لا أرقام بائعين، لا واتساب تجاري مرتبط بمحتوى طبي.
- تمت إزالة صورة whatsapp banner من الأصول المعتمدة.
- تم فحص جميع المقالات: لا توجد جرعات، لا طرق استخدام، لا تعليمات إنهاء حمل، لا روابط شراء.
- كل ذكر لـ "بيع" أو "واتساب" هو في سياق تحذيري (مثلاً: "أي محتوى يعرض بيع عبر واتساب هو تسويقي وليس طبياً").
- الهوية في /about و /medical-disclaimer و /privacy واضحة: منصة توعوية تعليمية فقط، لا نبيع ولا نوسط.

## 9. كيف تم تنظيف محتوى سايتوتك وميزوبروستول ليكون تثقيفياً فقط؟

- كل مقال يبدأ بحدود: "تعليمي فقط، لا جرعات، لا طرق استخدام، لا بيع".
- تمت إزالة أي جدول جرعات، عدد أقراص، توقيت، طرق إدخال.
- التركيز على: التعريف، المادة الفعالة، الاستطباب المعتمد في FDA، التحذيرات، موانع، متى تراجعين الطبيب، مخاطر المصادر غير الموثوقة، السياق التنظيمي السعودي.
- تمت إضافة قسم "حدود هذا المقال وما لا يقدمه" في cytotec-uses يذكر 6 محظورات بوضوح.
- لا يوجد محتوى يصف خطوات منزلية.

## 10. تحليل المنافس (saudi-cytotec.com) وكيف بنينا مصدراً أفضل

**المنافس:** موقع تجاري بحت يبيع سايتوتك، واتساب +971585667242، توصيل 24-48 ساعة، دفع عند الاستلام، يدعي Pfizer original 1461، يسرد مدن (Riyadh, Jeddah, Dammam, Makkah, Madinah, Tabuk, Abha...)، يتضمن قسم أمان من 6 نقاط (ectopic warning, 9 weeks/63 days, موانع، علامات طوارئ: 2 pads/hour 2h, fever 38C 24h, Rh- Anti-D, متابعة سونار/hCG 1-2 weeks)، FAQ، منتجات.

**نيتنا مقابل نيته:** هو transactional (بيع)، نحن informational (توعية). لا ننافس على كلمات "للبيع" بل على "معلومات، تحذيرات، أمان، مصادر".

**كيف بنينا أفضل:**
- E-E-A-T أقوى: /about، /editorial-policy ضمن /about، /medical-disclaimer، /medical-sources تذكر FDA, SFDA, MOH, WHO, MedlinePlus، مع تاريخ تحديث.
- تغطية موضوعية أوسع: 10 pillars (ما هو، الاستخدامات، التنظيم السعودي، تقييم فقدان الحمل، خارج الرحم، علامات الخطر، سلامة الدواء، معلومات مضللة، FAQ، مصادر رسمية) - كلها موجودة.
- هيكلة أفضل: Homepage → Women's Health → Pregnancy → Medication Safety → Misoprostol → Cytotec pillar → supporting - موجودة في CORNERSTONES.
- FAQs حقيقية مع إجابات موثقة، بدون جرعات.
- لا doorway، لا city stuffing، وهو ما يعاقب عليه المنافس مستقبلاً.
- جاهزية لـ AI Overviews: إجابة مباشرة أعلى الصفحة، تعريف دقيق، H2/H3 واضحة، FAQs، مصادر موثوقة، روابط داخلية منطقية، سياق سعودي عند الحاجة.

## 11. جاهزية الظهور في AI Overviews و AI Mode

- كل صفحة مهمة تحتوي إجابة مباشرة في أول فقرة (مثل cytotec-uses: "الإجابة المباشرة: سايتوتك هو اسم تجاري لمادة ميزوبروستول...").
- تعريف دقيق، H2/H3 واضحة، FAQs حقيقية مع إجابات مختصرة، معلومات فريدة (السياق التنظيمي السعودي)، مصادر موثوقة (FDA, SFDA, MOH, WHO).
- روابط داخلية منطقية: related و cornerstones و internalLinks.
- سياق سعودي عند الحاجة: 937، 997، SFDA، وزارة الصحة.
- معلومات تحريرية: /about يوضح من نحن، /medical-sources يوضح منهج المصادر.
- Structured data صحيح: Article, MedicalWebPage, BreadcrumbList, Organization, FAQPage (Question/Answer)، WebSite مع SearchAction، بدون fake reviews/ratings/doctors.

## 12. Topic Cluster

10 pillars موجودة:

1. **ما هو سايتوتك/ميزوبروستول** - /what-is-cytotec، /misoprostol، cluster ma-huwa-saytotek (10 مقالات)
2. **الاستخدامات العامة** - /medical-uses، cluster alestekhdamat-altebbiya (10)
3. **التنظيم السعودي** - /service-areas، /medical-sources، cluster aladilla-walmasader (10)
4. **تقييم فقدان الحمل** - /early-pregnancy، cluster alhaml-walsehha-alenjabiyya (10)
5. **خارج الرحم** - /when-to-see-doctor، cluster mata-murajaa-altabeeb (10) - يغطي ectopic
6. **علامات الخطر** - /side-effects، /when-to-see-doctor، cluster alathar-aljanibiyya و mata-murajaa-altabeeb
7. **سلامة الدواء/مصادر غير موثوقة** - /safety، cluster alaman-walthahdhirat (10)
8. **المعلومات المضللة** - cluster alasila-alshaea و aladilla-walmasader
9. **FAQ** - /faq، cluster alasila-alshaea (10)
10. **مصادر رسمية** - /medical-sources، /about، /medical-disclaimer

لا يوجد تكرار لتنويع كلمات مفتاحية، كل cluster له primary keyword فريد.

## 13. Internal Linking

- Homepage → Women's Health (محور رئيسي) → Pregnancy → Medication Safety → Misoprostol → Cytotec pillar → supporting - موجود في CORNERSTONES.
- كل مقال له related (3-7 روابط) و cornerstones (2-4) و internalLinks.
- Orphans 0، broken 0.
- Anchors طبيعية، لا حشو.

## 14. On-page SEO

- Title فريد لكل صفحة، metaDescription فريد، H1 فريد، canonical ذاتي، robots index للعامة، noindex لـ /admin/search/api فقط.
- Slug نظيف بدون ترميز عربي في sitemap (الروابط العربية القديمة تم تحويلها).
- Breadcrumbs موجودة عبر structured data.
- Related و cornerstones موجودة.
- Alt: لا يوجد صور مميزة للمقالات (مقصود لتجنب صور تجارية)، فقط 3 أصول معتمدة للشعار والبنر والمشاركة.
- OG: ogTitle و ogDescription فريدة، تستخدم fallback social-share.
- لغة RTL، لا تكرار metadata (تم التحقق: metaTitles فريدة).

## 15. Structured Data

- JSON-LD في bundle: BreadcrumbList, ListItem, Article, MedicalWebPage, Organization, ImageObject, WebSite, FAQPage, Question, Answer, MedicalCondition, ContactPoint, SearchAction, CollectionPage.
- لا fake reviews، لا ratings، لا doctors وهميين.
- مطابق للمحتوى المرئي: FAQs في JSON تطابق FAQs في الصفحة.

## 16. E-E-A-T

- /about: يوضح من نحن، ما نفعله وما لا نفعله (لا بيع، لا وصفات، لا تشخيص، لا أرقام بائعين)، منهج التحرير، لا حشو مدن، لا doorway.
- /medical-disclaimer: حدود المحتوى، لا علاقة طبيب-مريضة، لا خطة علاج، لا بيع، أرقام طوارئ.
- /medical-sources: منهج اختيار المصادر (SFDA, MOH, FDA, DailyMed, WHO, MedlinePlus, Cochrane, NICE)، ماذا نرفض (قصص تسويقية، أرقام بيع، دراسات مختلقة).
- /contact: بريد تحريري فقط info@saudiersaa.com، لا طلب بيانات صحية حساسة.
- /privacy: ما يجمع وما لا يطلب (لا صور وصفات، لا أرقام بيع، لا بطاقات).
- لا ادعاءات غير موثقة مثل "عيادتنا المعتمدة" أو "فريق طبي" - نحن منصة توعوية تعليمية فقط.

## 17. الصور والأصول

- 3 أصول معتمدة فقط: /images/لوجو.png، /images/Bannerrr.png، /images/saudiersaa-social-share.png - كلها موجودة.
- لا صور مكسورة، لا alt مفقود، لا oversized، لا duplicate.
- تم حذف whatsapp banner التجاري.
- لا صور طبية مخزنة غير مناسبة.

## 18. جودة المحتوى: التصنيف A-G

- A=قوي KEEP: 13 static pillars + 100 static articles + 1 published موسع = 114
- B=مفيد ضعيف REWRITE: 1 (cytotec-uses تمت إعادة كتابته) + expand.ts تم تحسينه
- C=مكرر MERGE: 22 (مدن وجغرافي)
- D=تجاري/مضلل REMOVE/REDIRECT: 19 إلى /what-is-cytotec (صفحات بيع عربية)
- E=doorway REMOVE/410/MERGE: 21 مدينة + 1 جغرافي
- F=غير آمن جرعات REWRITE: 0 (لا يوجد جرعات أصلاً، لكن cytotec-uses كان thin فأعيدت كتابته)
- G=بلا قيمة REMOVE: 2 feed → 410

لا حذف لمحتوى جيد قديم، كل المحذوف doorway/تجاري.

## 19. كيف تم تجنب تضخيم عدد الصفحات؟

- من 151 إلى 130 URL في sitemap (تقليل 21).
- من 23 ملف published مدينة إلى 0.
- لا إنشاء محتوى جديد كبير قبل التنظيف.
- النجاح = صفحات أقل ضعيفة + صفحات أكثر قوية + هيكل موضوعي واضح + روابط داخلية قوية + ثقة + قابلية فهرسة + محتوى قابل للاستشهاد.

## 20. التحقق التقني

- npm install: نعم (تم)
- npm run build: PASS (101 مقال، 130 URL، seo-manifest 101+31)
- SEO audit: PASS 8 فحوصات (sitemap 130/130، robots ok، schema ok، redirects 103/104، content map 100، bundle shell ok، internal links 101 0 broken، images 3)
- Indexability audit: PASS (101 indexable، 0 noindex مقصود في sitemap، 0 missing canonical/title/meta، تحذير واحد فقط body 992 <2000 advisory)
- Image audit: PASS 3 approved
- Architecture: PASS (map 100، articles 101، sitemap 130، orphans 0، blockers 0)
- Sitemap: 130 URL فقط canonical 200 مفيد غير مكرر، لا 404/redirects/noindex/doorway، lastmod صادق
- Robots: Allow /، Disallow /search /admin /api، sitemap معلن، لا حجب CSS/JS
- Canonical: ذاتي لكل KEEP، www→apex
- لا روابط مكسورة، لا استيراد مكسور، لا أصول مكسورة
- Mobile/a11y/perf: بناء Vite singlefile، responsive، semantic

## 21. أمان Git

- git status نظيف بعد الدمج
- لا secrets، لا API keys، لا ملفات temp
- diff تمت مراجعته: حذف doorway، إصلاح redirects، توسيع محتوى آمن
- لا كلمات سر في vercel.json أو غيره

## 22. الفرع والنشر

- العمل كان على arena/01a075a3-saudi-cytotec، تم دمجه إلى main عبر merge --no-ff
- commit و push إلى main: 2242f4e merge forensic cleanup
- push إلى arena أيضاً: 5dcb2ac
- Vercel مرتبط بـ main، سينشر تلقائياً (تحقق يدوي عبر curl محجوب في sandbox لكن push ناجح)
- تم التحقق محلياً: build PASS، جميع audits PASS

## 23. ما لم يتم فعله ولماذا؟

- لم يتم إنشاء صفحات مدن جديدة - ممنوع doorway.
- لم يتم إنشاء محتوى كبير جديد قبل التنظيف - الأولوية للتنظيف.
- لم يتم طلب فهرسة جماعية لـ 120 Discovered - يترك للزحف الطبيعي لتجنب إشارة تضخيم.
- لم يتم تقصير cytotec-uses إلى <2000 كلمة - 992 كلمة مقبولة، التحذير advisory فقط، والمحتوى كثيف ومفيد.
- لم يتم تحويل كل 404 إلى 301 - بعضها 404 مقصود لأنه لا بديل ذي صلة (أفضل من تحويل مضلل).

## 24. الخطوات التالية المقترحة لـ GSC بعد النشر

1. تقديم sitemap.xml الجديد (130 URL) في GSC
2. طلب التحقق لـ 48 404 التي أصبحت 301
3. مراقبة Discovered/Crawled - يجب أن تنخفض تدريجياً مع إعادة الزحف
4. عدم طلب فهرسة جماعية، ترك Google يقرر
5. مراقبة 2 Redirect errors - يجب أن تختفي بعد إزالة regex
6. مراقبة 3 Redirects - يجب أن تختفي بعد إزالة السلاسل
7. تحسين clusterFrames مستقبلاً لزيادة التفرد أكثر (مقترح: إعادة كتابة intro لكل cluster ليكون أكثر تنوعاً)

---

## ملحق: أوامر التحقق

```bash
npm run build
# PASS - 101 articles, 130 URLs, 0 orphans, 0 broken, 3 images approved

cat content/redirects.json | python3 -c "import json; rules=json.load(open('content/redirects.json'))['rules']; print(len(rules))"
# 103

cat vercel.json | python3 -c "import json; print(len(json.load(open('vercel.json'))['redirects']))"
# 104 (103 + www)

cat docs/historical-url-map.md
# يحتوي جدول كامل 208 URLs

cat public/robots.txt
# Allow /, Disallow /search /admin /api, Sitemap declared

cat public/sitemap.xml | grep -c "<loc>"
# 130
```

## الخلاصة

- لا طابع تجاري، لا بيع، لا واتساب تجاري، لا doorway، لا حشو مدن، لا clusters مكررة، لا تعليمات جرعات خطيرة
- canonical/robots/sitemap صحيح، redirects منطقية، 404 مقصودة، روابط داخلية قوية، metadata/structured data صحيح، صفحات ثقة واضحة، cluster موضوعي واضح، قابلية فهرسة جيدة، مناسب لـ Search و AI Overviews، محتوى أصلي مفيد، أفضل استراتيجياً من المنافس التجاري.
