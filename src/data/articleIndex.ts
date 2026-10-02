import type { Article } from "../types";

export type ArticleSummary = Pick<
  Article,
  "slug" | "title" | "h1" | "metaTitle" | "metaDescription" | "cluster" | "excerpt" | "publishedAt" | "updatedAt" | "related" | "thumbnail" | "thumbnailAlt"
> & { noindex?: boolean };

export const articleIndex: ArticleSummary[] = [
  {
    "slug": "cytotec-definition",
    "title": "تعريف سايتوتك بعيداً عن الشائعات",
    "h1": "تعريف سايتوتك: كيف نفهم الاسم دون اختزاله",
    "metaTitle": "تعريف سايتوتك بعيداً عن الشائعات",
    "metaDescription": "مقال تعليمي يوضح أن سايتوتك اسم تجاري لمادة ميزوبروستول، ولماذا لا يكفي الاسم لفهم التحذيرات أو اتخاذ قرار صحي.",
    "cluster": "definition",
    "excerpt": "البحث عن الاسم الشائع يبدأ غالباً من القلق. هذا المقال يضع التعريف في سياقه التنظيمي ويفصل بين الشهرة والمعلومة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "misoprostol-active-ingredient",
      "difference-cytotec-misoprostol",
      "key-facts-before-reading-cytotec",
      "approved-medical-uses-misoprostol",
      "cytotec-uses"
    ],
    "noindex": false
  },
  {
    "slug": "misoprostol-active-ingredient",
    "title": "ميزوبروستول المادة الفعالة: ماذا يعني ذلك؟",
    "h1": "ميزوبروستول بوصفه المادة الفعالة لا بوصفه لقباً",
    "metaTitle": "ميزوبروستول المادة الفعالة لسايتوتك",
    "metaDescription": "شرح تعليمي للمادة الفعالة ميزوبروستول وتصنيفها كنظير للبروستاغلاندين E1 ولماذا يتعدد تأثيرها في الجسم.",
    "cluster": "definition",
    "excerpt": "المادة الفعالة هي ما يتعامل معه الجسم فعلياً. فهم ميزوبروستول يمنع الانبهار بالاسم التجاري أو الخوف المبهم منه.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "cytotec-definition",
      "misoprostol-pharmacologic-class",
      "how-misoprostol-works-in-body"
    ],
    "noindex": false
  },
  {
    "slug": "difference-cytotec-misoprostol",
    "title": "الفرق بين سايتوتك وميزوبروستول",
    "h1": "سايتوتك وميزوبروستول: فرق التسمية لا فرق الخيال",
    "metaTitle": "الفرق بين سايتوتك وميزوبروستول",
    "metaDescription": "توضيح الفرق بين الاسم التجاري سايتوتك والمادة الفعالة ميزوبروستول، ولماذا يسبب الخلط بينهما أخطاء في فهم المخاطر.",
    "cluster": "definition",
    "excerpt": "كثير من الأسئلة المكررة ناتج عن التعامل مع الاسمين وكأنهما دواءان مختلفان تماماً أو متطابقان في كل شيء.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "cytotec-definition",
      "misoprostol-other-brand-names",
      "brand-name-vs-active-ingredient",
      "misoprostol-in-clinical-references"
    ],
    "noindex": false
  },
  {
    "slug": "history-development-misoprostol",
    "title": "لمحة تاريخية عن تطوير ميزوبروستول",
    "h1": "كيف دخل ميزوبروستول المجال الطبي؟",
    "metaTitle": "تاريخ تطوير ميزوبروستول",
    "metaDescription": "لمحة تعليمية عن ظهور ميزوبروستول كنظير بروستاغلاندين ولماذا تعددت السياقات السريرية حوله لاحقاً.",
    "cluster": "definition",
    "excerpt": "فهم الخلفية التاريخية يوضح لماذا يظهر الدواء في نشرات الجهاز الهضمي ومراجع التوليد في آن واحد.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "misoprostol-pharmacologic-class",
      "misoprostol-in-clinical-references",
      "cytotec-definition"
    ],
    "noindex": false
  },
  {
    "slug": "misoprostol-pharmacologic-class",
    "title": "التصنيف الدوائي لميزوبروستول",
    "h1": "ميزوبروستول ضمن نظائر البروستاغلاندين",
    "metaTitle": "التصنيف الدوائي لميزوبروستول",
    "metaDescription": "شرح تعليمي لانتماء ميزوبروستول إلى نظائر البروستاغلاندين E1 ودلالة ذلك على التأثيرات والتحذيرات.",
    "cluster": "definition",
    "excerpt": "التصنيف الدوائي أداة للفهم لا للتبسيط المخل. هو يفسر تعدد الأعضاء المستهدفة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "misoprostol-active-ingredient",
      "how-misoprostol-works-in-body",
      "prostaglandin-allergy",
      "history-development-misoprostol"
    ],
    "noindex": false
  },
  {
    "slug": "how-misoprostol-works-in-body",
    "title": "كيف يعمل ميزوبروستول في الجسم؟",
    "h1": "آلية العمل العامة دون اختزال خطر",
    "metaTitle": "كيف يعمل ميزوبروستول في الجسم",
    "metaDescription": "تبسيط تعليمي لآلية عمل ميزوبروستول في المعدة والرحم، مع التأكيد أن الآلية لا تبرر الاستخدام الذاتي.",
    "cluster": "definition",
    "excerpt": "فهم الآلية يوضح لماذا لا يمكن «اختيار» أثر نافع وإطفاء أثر رحمي بإرادة المستخدم.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "misoprostol-pharmacologic-class",
      "misoprostol-active-ingredient",
      "uterine-reproductive-effects"
    ],
    "noindex": false
  },
  {
    "slug": "cytotec-pharmaceutical-forms",
    "title": "الأشكال الصيدلانية لسايتوتك",
    "h1": "ماذا يعني اختلاف الشكل الصيدلاني؟",
    "metaTitle": "الأشكال الصيدلانية لسايتوتك وميزوبروستول",
    "metaDescription": "شرح تعليمي لمعنى الشكل الصيدلاني ولماذا لا تُقارن الأقراص بالبروتوكولات المؤسسية عبر الصور.",
    "cluster": "definition",
    "excerpt": "الشكل الصيدلاني جزء من جودة التصنيع وطريقة الإشراف، لا دليل على أن «الحبة هي نفسها» في كل سياق.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "misoprostol-other-brand-names",
      "difference-cytotec-misoprostol",
      "unreliable-medicine-sources"
    ],
    "noindex": false
  },
  {
    "slug": "misoprostol-other-brand-names",
    "title": "أسماء تجارية أخرى لميزوبروستول",
    "h1": "تعدد الأسماء لا يلغي وحدة التحذير",
    "metaTitle": "أسماء تجارية أخرى لميزوبروستول",
    "metaDescription": "لماذا قد يظهر ميزوبروستول بأسماء مختلفة حسب البلد، ولماذا تبقى التحذيرات الجوهرية مرتبطة بالمادة.",
    "cluster": "definition",
    "excerpt": "البحث بالاسم المحلي فقط قد يخفي أنك أمام المادة نفسها أو أمام مستحضر غير مكافئ.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "difference-cytotec-misoprostol",
      "saudi-drug-regulation-context",
      "cytotec-definition",
      "cytotec-pharmaceutical-forms"
    ],
    "noindex": false
  },
  {
    "slug": "misoprostol-in-clinical-references",
    "title": "ميزوبروستول في المراجع السريرية",
    "h1": "كيف يظهر ميزوبروستول في المراجع المهنية؟",
    "metaTitle": "ميزوبروستول في المراجع السريرية",
    "metaDescription": "شرح تعليمي لكيف يظهر ميزوبروستول في المراجع السريرية، والفرق بين الدليل المهني والمعلومة العامة وحدود نقل البروتوكولات.",
    "cluster": "definition",
    "excerpt": "المراجع السريرية تُكتب لمن يديرون بروتوكولات، لا لمن يبحثون عن حل سريع في المنزل.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "official-drug-leaflets",
      "fda-cytotec-warnings",
      "how-misoprostol-works-in-body"
    ],
    "noindex": false
  },
  {
    "slug": "key-facts-before-reading-cytotec",
    "title": "حقائق أساسية قبل قراءة مقالات سايتوتك",
    "h1": "قبل أن تتابعي القراءة: إطار الأمان المعرفي",
    "metaTitle": "حقائق أساسية قبل قراءة مقالات سايتوتك",
    "metaDescription": "مجموعة حقائق تعليمية تمنع سوء فهم بقية المقالات: لا جرعة، لا بيع، لا بديل عن الطبيب.",
    "cluster": "definition",
    "excerpt": "هذه الصفحة بوابة قراءة. إن استوعبت حدودها صارت بقية المقالات أقل قابلية للالتباس.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "cytotec-definition",
      "general-info-vs-personal-advice",
      "internet-not-a-doctor"
    ],
    "noindex": false
  },
  {
    "slug": "approved-medical-uses-misoprostol",
    "title": "الاستطبابات المعتمدة لميزوبروستول",
    "h1": "ما الذي تعنيه كلمة «معتمد» في نشرة الدواء؟",
    "metaTitle": "الاستطبابات المعتمدة لميزوبروستول",
    "metaDescription": "شرح تعليمي للاستطباب المعتمد في النشرة الأمريكية وحدود نقل هذا الاستطباب إلى قرارات فردية.",
    "cluster": "uses",
    "excerpt": "الاعتماد التنظيمي وصف قانوني وعلمي مشروط، وليس دعوة عامة للاستخدام.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "misoprostol-gastric-ulcers",
      "off-label-use-meaning",
      "hospital-clinic-limits",
      "not-all-uses-are-alike",
      "obstetric-uses-under-supervision"
    ],
    "noindex": false
  },
  {
    "slug": "misoprostol-gastric-ulcers",
    "title": "ميزوبروستول وقرحة المعدة",
    "h1": "حماية المعدة في سياقها السريري فقط",
    "metaTitle": "ميزوبروستول وقرحة المعدة",
    "metaDescription": "معلومات تعليمية عن مناقشة ميزوبروستول في تقليل خطر القرحة المرتبطة بمضادات الالتهاب.",
    "cluster": "uses",
    "excerpt": "قرحة المعدة لها أسباب متعددة وبدائل متعددة. الدواء ليس عنوان الحالة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "discussing-medication-history",
      "approved-medical-uses-misoprostol",
      "gastrointestinal-effects"
    ],
    "noindex": false
  },
  {
    "slug": "obstetric-uses-under-supervision",
    "title": "الاستخدامات التوليدية تحت الإشراف",
    "h1": "لماذا تُناقش استخدامات توليدية داخل المستشفى فقط؟",
    "metaTitle": "الاستخدامات التوليدية لميزوبروستول تحت الإشراف",
    "metaDescription": "توضيح تعليمي بأن النقاش التوليدي حول ميزوبروستول موجّه للممارسين داخل أنظمة صحية.",
    "cluster": "uses",
    "excerpt": "وجود بروتوكول مستشفياتي لا يتحول إلى دليل منزلي، لأن المراقبة جزء من التدخل نفسه.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "postpartum-hemorrhage-education",
      "why-not-home-treatment",
      "hospital-clinic-limits"
    ],
    "noindex": false
  },
  {
    "slug": "postpartum-hemorrhage-education",
    "title": "نزيف ما بعد الولادة: إطار تعليمي",
    "h1": "نزيف ما بعد الولادة يحتاج فريقاً لا مقالاً",
    "metaTitle": "نزيف ما بعد الولادة ومعلومات تعليمية",
    "metaDescription": "معلومات عامة عن خطورة نزيف ما بعد الولادة ولماذا تُدار أدوية التقلص الرحمي داخل النظام الصحي.",
    "cluster": "uses",
    "excerpt": "النزيف بعد الولادة سبب رئيس لمضاعفات الأمومة عالمياً، وإدارته بروتوكول مؤسسي.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "obstetric-uses-under-supervision",
      "signs-of-dangerous-bleeding",
      "official-drug-leaflets"
    ],
    "noindex": false
  },
  {
    "slug": "off-label-use-meaning",
    "title": "ماذا يعني الاستخدام خارج النشرة؟",
    "h1": "خارج النشرة لا يعني خارج المسؤولية",
    "metaTitle": "معنى الاستخدام خارج النشرة",
    "metaDescription": "تعريف تعليمي للاستخدام خارج النشرة ولماذا يبقى قراراً مهنياً مشروطاً بالقانون والمتابعة.",
    "cluster": "uses",
    "excerpt": "Off-label مصطلح مهني يُساء فهمه على الإنترنت وكأنه ترخيص شخصي.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "approved-medical-uses-misoprostol",
      "unsafe-unsupervised-use",
      "regulatory-drug-warnings"
    ],
    "noindex": false
  },
  {
    "slug": "unsafe-unsupervised-use",
    "title": "لماذا الاستخدام دون إشراف غير آمن؟",
    "h1": "غياب الإشراف ليس تفصيلاً إجرائياً",
    "metaTitle": "مخاطر الاستخدام غير الخاضع للإشراف",
    "metaDescription": "شرح تعليمي لمخاطر استخدام ميزوبروستول دون تقييم طبي، مع التركيز على الموانع والمصدر النظامي ومتى يلزم طلب الرعاية.",
    "cluster": "uses",
    "excerpt": "الخطر لا يأتي فقط من المركب، بل من غياب التشخيص والجودة والمتابعة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "why-not-home-treatment",
      "risks-of-random-use",
      "unreliable-medicine-sources",
      "use-without-prescription"
    ],
    "noindex": false
  },
  {
    "slug": "hospital-clinic-limits",
    "title": "حدود العيادة والمستشفى",
    "h1": "ماذا يستطيع الإطار الطبي وماذا لا يستطيع المقال؟",
    "metaTitle": "حدود العيادة والمستشفى في استخدام ميزوبروستول",
    "metaDescription": "توضيح أن المراقبة والتحاليل وإمكانية التدخل هي ما يجعل الاستخدام الطبي مختلفاً.",
    "cluster": "uses",
    "excerpt": "المكان ليس جداراً، بل مجموعة قدرات: فحص، صورة، دم، إنعاش، قرار سريع.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "postpartum-hemorrhage-education",
      "why-not-home-treatment",
      "follow-up-after-medical-care"
    ],
    "noindex": false
  },
  {
    "slug": "why-not-home-treatment",
    "title": "لماذا لا يُعامل كعلاج منزلي؟",
    "h1": "المنزل مكان حياة لا مكان بروتوكول توليدي",
    "metaTitle": "لماذا لا يُستخدم ميزوبروستول كعلاج منزلي",
    "metaDescription": "أسباب تعليمية تمنع معاملة ميزوبروستول كعلاج منزلي: التشخيص والجودة والمراقبة والإنقاذ.",
    "cluster": "uses",
    "excerpt": "الراحة المنزلية لا تعوّض غياب التشخيص والمراقبة وإمكانية الإنقاذ.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "unsafe-unsupervised-use",
      "hospital-clinic-limits",
      "danger-of-delaying-care"
    ],
    "noindex": false
  },
  {
    "slug": "general-safety-warnings",
    "title": "تحذيرات الأمان العامة",
    "h1": "خريطة الأمان قبل أي تفصيل",
    "metaTitle": "تحذيرات الأمان العامة لسايتوتك",
    "metaDescription": "عرض تعليمي لأهم تحذيرات ميزوبروستول: الحمل، الموانع، الجودة، والمتابعة.",
    "cluster": "safety",
    "excerpt": "الأمان مجموعة شروط متزامنة، لا شعور شخصي بعد قراءة سريعة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pregnancy-boxed-warning",
      "why-medical-supervision-required",
      "regulatory-drug-warnings"
    ],
    "noindex": false
  },
  {
    "slug": "pregnancy-boxed-warning",
    "title": "تحذير الحمل البارز",
    "h1": "لماذا يظهر تحذير الحمل بهذا الوضوح؟",
    "metaTitle": "تحذير الحمل في نشرة سايتوتك",
    "metaDescription": "شرح تعليمي للتحذير البارز بشأن الحمل في نشرة ميزوبروستول ودلالته العملية.",
    "cluster": "safety",
    "excerpt": "التحذير البارز أداة تنظيمية تقول إن الخطر ليس هامشياً ولا نادر الذكر.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "why-contraindicated-in-pregnancy-ulcer-use",
      "general-safety-warnings",
      "early-pregnancy-overview"
    ],
    "noindex": false
  },
  {
    "slug": "why-medical-supervision-required",
    "title": "لماذا يلزم الإشراف الطبي؟",
    "h1": "الإشراف ليس روتيناً إدارياً",
    "metaTitle": "لماذا يلزم الإشراف الطبي مع ميزوبروستول",
    "metaDescription": "أسباب تعليمية لربط ميزوبروستول بالتقييم الطبي: الموانع، الحمل، الجودة، والمتابعة.",
    "cluster": "safety",
    "excerpt": "الإشراف يضيف ما لا يملكه المقال: فحصاً ومسؤولية ومسار إنقاذ.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "general-safety-warnings",
      "unsafe-unsupervised-use",
      "conditions-needing-prior-assessment"
    ],
    "noindex": false
  },
  {
    "slug": "risks-of-random-use",
    "title": "مخاطر الاستخدام العشوائي",
    "h1": "العشوائية تضاعف الخطر حتى لو كان الاسم معروفاً",
    "metaTitle": "مخاطر الاستخدام العشوائي لسايتوتك",
    "metaDescription": "كيف يرفع الاستخدام العشوائي احتمالات التشخيص الخاطئ والتزييف وتأخير الرعاية.",
    "cluster": "safety",
    "excerpt": "العشوائية تعني غياب التشخيص والجرعة الموصوفة والجودة والمتابعة في وقت واحد.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "unsafe-unsupervised-use",
      "unreliable-medicine-sources",
      "saudi-drug-regulation-context"
    ],
    "noindex": false
  },
  {
    "slug": "medicine-storage-home-safety",
    "title": "تخزين الدواء وأمان المنزل",
    "h1": "التخزين جزء صامت من الأمان",
    "metaTitle": "تخزين الأدوية وأمان المنزل",
    "metaDescription": "إرشادات تعليمية عامة لتخزين الأدوية بعيداً عن الأطفال والرطوبة والعبوات المجهولة.",
    "cluster": "safety",
    "excerpt": "كثير من الحوادث المنزلية تبدأ من علبة بلا تسمية أو درج في متناول طفل.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "unreliable-medicine-sources",
      "general-safety-warnings",
      "how-to-read-package-insert"
    ],
    "noindex": false
  },
  {
    "slug": "how-to-read-package-insert",
    "title": "كيف تقرئين نشرة الدواء؟",
    "h1": "النشرة وثيقة أمان لا ورقة مهملة",
    "metaTitle": "كيف تقرأ نشرة الدواء",
    "metaDescription": "طريقة تعليمية لقراءة أبواب النشرة: الاستطباب، الموانع، التحذيرات، والآثار الجانبية.",
    "cluster": "safety",
    "excerpt": "النشرة مكتوبة بلغة تنظيمية. معرفة أبوابها يمنع القفز إلى جملة واحدة على الإنترنت.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "official-drug-leaflets",
      "general-info-vs-personal-advice",
      "fda-cytotec-warnings"
    ],
    "noindex": false
  },
  {
    "slug": "general-info-vs-personal-advice",
    "title": "الفرق بين المعلومة العامة والنصيحة الفردية",
    "h1": "لماذا لا تتحول المقالة إلى وصفة؟",
    "metaTitle": "المعلومة العامة مقابل النصيحة الطبية الفردية",
    "metaDescription": "تمييز تعليمي بين التعليم العام والاستشارة الفردية حتى لا يُساء استخدام المقالات.",
    "cluster": "safety",
    "excerpt": "المعلومة العامة تجيب «ما الذي يُعرف؟». النصيحة الفردية تجيب «ماذا يناسبك؟».",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "internet-not-a-doctor",
      "key-facts-before-reading-cytotec",
      "education-vs-individual-treatment"
    ],
    "noindex": false
  },
  {
    "slug": "regulatory-drug-warnings",
    "title": "التحذيرات التنظيمية للأدوية",
    "h1": "كيف تعمل التحذيرات الصادرة عن الهيئات؟",
    "metaTitle": "التحذيرات التنظيمية للأدوية",
    "metaDescription": "دور هيئات الدواء في إصدار التحذيرات ولماذا تختلف الصياغة بين بلد وآخر.",
    "cluster": "safety",
    "excerpt": "التحذير التنظيمي نتيجة ملف سلامة، لا اجتهاد كاتب محتوى.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "fda-cytotec-warnings",
      "saudi-drug-regulation-context",
      "official-drug-leaflets"
    ],
    "noindex": false
  },
  {
    "slug": "unreliable-medicine-sources",
    "title": "مخاطر مصادر الدواء غير الموثوقة",
    "h1": "المصدر المجهول خطر مستقل",
    "metaTitle": "مخاطر مصادر الدواء غير الموثوقة",
    "metaDescription": "لماذا تشكل الأسواق غير النظامية والتواصل الخاص لبيع الدواء خطراً على السلامة.",
    "cluster": "safety",
    "excerpt": "قد لا تحتوي العبوة على المادة، أو تحتوي تركيزاً خاطئاً، أو شوائب، أو تعليمات مضللة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "saudi-drug-regulation-context",
      "risks-of-random-use",
      "unsafe-unsupervised-use",
      "medicine-storage-home-safety"
    ],
    "noindex": false
  },
  {
    "slug": "saudi-drug-regulation-context",
    "title": "السياق التنظيمي للدواء في السعودية",
    "h1": "كيف يُفهم تداول الدواء داخل المملكة؟",
    "metaTitle": "تنظيم الدواء في السعودية",
    "metaDescription": "إطار تعليمي لدور الهيئة العامة للغذاء والدواء ووزارة الصحة في تنظيم الأدوية.",
    "cluster": "safety",
    "excerpt": "المعلومة العالمية مفيدة، لكن التداول المحلي محكوم بنظام المملكة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "unreliable-medicine-sources",
      "regulatory-drug-warnings",
      "trusted-sources-further-reading"
    ],
    "noindex": false
  },
  {
    "slug": "common-side-effects",
    "title": "الآثار الجانبية الشائعة",
    "h1": "ما الذي تذكره النشرات بوصفه شائعاً؟",
    "metaTitle": "الآثار الجانبية الشائعة لميزوبروستول",
    "metaDescription": "عرض تعليمي للآثار الشائعة مثل أعراض الجهاز الهضمي، مع التفريق بينها وبين الطارئ.",
    "cluster": "side-effects",
    "excerpt": "الشائع لا يعني التافه. الإسهال أو الألم قد يبقيان مزعجين أو يتحولان إلى جفاف يستدعي رعاية.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "diarrhea-abdominal-pain",
      "nausea-and-vomiting",
      "what-to-do-if-side-effects"
    ],
    "noindex": false
  },
  {
    "slug": "diarrhea-abdominal-pain",
    "title": "الإسهال وألم البطن",
    "h1": "أعراض هضمية شائعة وتفسيرها الحذر",
    "metaTitle": "الإسهال وألم البطن مع ميزوبروستول",
    "metaDescription": "معلومات تعليمية عن الإسهال والتقلصات ومتى يتحول الألم البطني إلى علامة طارئة.",
    "cluster": "side-effects",
    "excerpt": "الجهاز الهضمي مرآة شائعة لتأثير نظائر البروستاغلاندين، لكن الألم الحاد قصة أخرى.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "gastrointestinal-effects",
      "common-side-effects",
      "severe-abdominal-pain"
    ],
    "noindex": false
  },
  {
    "slug": "fever-and-chills",
    "title": "الحمى والقشعريرة",
    "h1": "متى تكون الحمى عرضاً ومتى تكون إنذاراً؟",
    "metaTitle": "الحمى والقشعريرة بعد التعرض الدوائي",
    "metaDescription": "شرح تعليمي للحمى والقشعريرة والفرق بين عرض مراقب وعلامة التهاب أو تدهور.",
    "cluster": "side-effects",
    "excerpt": "الحمى تُذكر في بعض السياقات السريرية، لكنها أيضاً علامة عدوى أو مضاعفة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "high-fever-and-infection",
      "when-symptoms-are-emergencies",
      "common-side-effects"
    ],
    "noindex": false
  },
  {
    "slug": "nausea-and-vomiting",
    "title": "الغثيان والقيء",
    "h1": "الغثيان شائع… والجفاف ليس كذلك",
    "metaTitle": "الغثيان والقيء كأثر جانبي",
    "metaDescription": "معلومات تعليمية عن الغثيان والقيء ومتى يشيران إلى مشكلة أوسع من أثر مزعج.",
    "cluster": "side-effects",
    "excerpt": "القيء المتكرر يمنع الشرب والدواء الموصوف ويزيد خطر الجفاف واضطراب الأملاح.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "common-side-effects",
      "diarrhea-abdominal-pain",
      "dizziness-and-fainting"
    ],
    "noindex": false
  },
  {
    "slug": "abnormal-bleeding",
    "title": "النزيف غير الطبيعي",
    "h1": "النزيف لغة جسد لا تُترجم عبر المنتديات",
    "metaTitle": "النزيف غير الطبيعي ومتى يقلق",
    "metaDescription": "إطار تعليمي للنزيف المهبلي أو غير المعتاد وعلامات الخطورة التي تستدعي الطوارئ.",
    "cluster": "side-effects",
    "excerpt": "وصف النزيف بالقطرات أو الفوط المشبعة أوضح للطبيب من كلمات عامة مثل «كثير».",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "signs-of-dangerous-bleeding",
      "uterine-reproductive-effects",
      "bleeding-in-early-pregnancy"
    ],
    "noindex": false
  },
  {
    "slug": "rare-serious-complications",
    "title": "مضاعفات نادرة وخطيرة",
    "h1": "النادر يبقى مهماً لأنه شديد",
    "metaTitle": "مضاعفات نادرة وخطيرة",
    "metaDescription": "تذكير تعليمي بأن الندرة الإحصائية لا تعني استحالة، وأن العلامات الشديدة لها أولوية.",
    "cluster": "side-effects",
    "excerpt": "التمزق الرحمي والتفاعل التحسسي الشديد والنزف الانهياري أمثلة على ما لا يُدار بالانتظار.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "when-symptoms-are-emergencies",
      "prostaglandin-allergy",
      "signs-of-dangerous-bleeding"
    ],
    "noindex": false
  },
  {
    "slug": "when-symptoms-are-emergencies",
    "title": "متى تصبح الأعراض طارئة؟",
    "h1": "خط التحول من العرض إلى الطارئ",
    "metaTitle": "متى تصبح الأعراض طارئة",
    "metaDescription": "علامات تعليمية تساعد على فهم متى تتحول الأعراض إلى حالة تستدعي تقييماً عاجلاً أو رعاية طوارئ بدلاً من الانتظار.",
    "cluster": "side-effects",
    "excerpt": "الطوارئ ليست مبالغة؛ هي اعتراف بأن بعض التغيرات لا تحتمل جدولاً عادياً.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "when-to-see-doctor-immediately",
      "annoying-symptom-vs-emergency",
      "rare-serious-complications"
    ],
    "noindex": false
  },
  {
    "slug": "gastrointestinal-effects",
    "title": "تأثيرات الجهاز الهضمي",
    "h1": "المعدة والأمعاء في دائرة التأثير",
    "metaTitle": "تأثيرات ميزوبروستول على الجهاز الهضمي",
    "metaDescription": "شرح تعليمي لتأثيرات الجهاز الهضمي المرتبطة بنظير البروستاغلاندين وحدود التفسير الذاتي.",
    "cluster": "side-effects",
    "excerpt": "حماية الغشاء المخاطي وأعراض الإسهال قد تتجاوزان في النص نفسه، فيبدو الأمر متناقضاً وهو ليس كذلك.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "diarrhea-abdominal-pain",
      "misoprostol-gastric-ulcers",
      "nausea-and-vomiting"
    ],
    "noindex": false
  },
  {
    "slug": "uterine-reproductive-effects",
    "title": "التأثيرات الرحمية والإنجابية",
    "h1": "لماذا يظهر الرحم في نشرة دواء يُذكر مع المعدة؟",
    "metaTitle": "التأثيرات الرحمية لميزوبروستول",
    "metaDescription": "تفسير تعليمي لقدرة ميزوبروستول على التأثير في الرحم ولماذا يجعل ذلك الحمل محور أمان.",
    "cluster": "side-effects",
    "excerpt": "العضلة الرحمية عضلة ملساء تستجيب لإشارات بروستاغلاندينية. هذا أصل كثير من التحذيرات.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "how-misoprostol-works-in-body",
      "pregnancy-boxed-warning",
      "abnormal-bleeding"
    ],
    "noindex": false
  },
  {
    "slug": "what-to-do-if-side-effects",
    "title": "ماذا تفعلين إذا ظهرت آثار جانبية؟",
    "h1": "مسار عملي للتعامل مع عرض جديد",
    "metaTitle": "ماذا تفعلين إذا ظهرت آثار جانبية",
    "metaDescription": "خطوات تعليمية: تقييم الشدة، توثيق العرض، وطلب الجهة المناسبة دون إضافة أدوية عشوائية.",
    "cluster": "side-effects",
    "excerpt": "الخطوة الأولى ليست البحث عن اسم عرضك، بل تصنيف شدته ووجود علامات خطر.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "when-symptoms-are-emergencies",
      "common-side-effects",
      "what-to-say-in-emergency"
    ],
    "noindex": false
  },
  {
    "slug": "early-pregnancy-overview",
    "title": "الحمل المبكر: نظرة تعليمية",
    "h1": "الأسابيع الأولى بين الشائع وغير المطمئن",
    "metaTitle": "الحمل المبكر نظرة تعليمية",
    "metaDescription": "معلومات عامة عن الحمل المبكر، المتابعة، ولماذا تُعامل الأدوية بحذر في هذه المرحلة.",
    "cluster": "pregnancy",
    "excerpt": "الحمل المبكر مليء بالأسئلة. التعليم الجيد يقلل العشوائية ويزيد احتمال المتابعة الصحيحة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pregnancy-follow-up-care",
      "warning-signs-in-pregnancy",
      "pregnancy-and-medicines-faq"
    ],
    "noindex": false
  },
  {
    "slug": "why-contraindicated-in-pregnancy-ulcer-use",
    "title": "لماذا يُمنع في الحمل حتى عند حديث القرحة؟",
    "h1": "الاستطباب المعدي لا يلغي تحذير الحمل",
    "metaTitle": "منع ميزوبروستول في الحمل حتى لاستطباب القرحة",
    "metaDescription": "شرح تعليمي لسبب بقاء الحمل مانعاً أساسياً حتى عندما يُذكر الدواء لحماية المعدة.",
    "cluster": "pregnancy",
    "excerpt": "تسمية الغرض «للمعدة» في ذهن المستخدم لا تغيّر أثر المادة على الرحم والحمل.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pregnancy-boxed-warning",
      "pregnancy-contraindication-ulcer-indication",
      "misoprostol-gastric-ulcers"
    ],
    "noindex": false
  },
  {
    "slug": "pregnancy-follow-up-care",
    "title": "متابعة الحمل الآمنة",
    "h1": "المتابعة تحوّل القلق إلى خطة",
    "metaTitle": "متابعة الحمل والرعاية الطبية بعد الأعراض",
    "metaDescription": "لماذا تُعد زيارات المتابعة والفحوصات المبكرة جزءاً من الأمان لا أمراً شكلياً.",
    "cluster": "pregnancy",
    "excerpt": "المتابعة تلتقط ارتفاع الضغط وفقر الدم ومشكلات المكان والجنين في وقت قابل للتدخل.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "early-pregnancy-overview",
      "warning-signs-in-pregnancy",
      "routine-womens-screening"
    ],
    "noindex": false
  },
  {
    "slug": "warning-signs-in-pregnancy",
    "title": "علامات تحذيرية في الحمل",
    "h1": "علامات لا تُؤجَّل إلى الغد",
    "metaTitle": "علامات تحذيرية في الحمل",
    "metaDescription": "علامات تحذيرية أثناء الحمل قد تستدعي تقييماً عاجلاً، مع توضيح حدود المعلومات العامة وأهمية الرعاية الطبية.",
    "cluster": "pregnancy",
    "excerpt": "النزيف، الألم الشديد، الصداع غير المعتاد مع تشوش الرؤية، وانخفاض حركة الجين في مراحل لاحقة أمثلة شائعة للإنذار.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "bleeding-in-early-pregnancy",
      "when-to-see-doctor-immediately",
      "early-pregnancy-overview"
    ],
    "noindex": false
  },
  {
    "slug": "miscarriage-educational-overview",
    "title": "الإجهاض: نظرة تعليمية عامة",
    "h1": "معلومات عامة دون خطط فردية",
    "metaTitle": "الإجهاض نظرة تعليمية عامة",
    "metaDescription": "إطار تعليمي حساس عن الإجهاض كحدث طبي يحتاج رعاية ومتابعة، لا تعليمات ذاتية.",
    "cluster": "pregnancy",
    "excerpt": "الفقدان يحتاج رعاية جسدية ونفسية. المقال لا يدير الحالة ولا يقدّم خطوات منزلية.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "bleeding-in-early-pregnancy",
      "warning-signs-in-pregnancy",
      "mental-and-reproductive-health",
      "follow-up-after-medical-care"
    ],
    "noindex": false
  },
  {
    "slug": "bleeding-in-early-pregnancy",
    "title": "النزيف في الحمل المبكر",
    "h1": "النزيف المبكر يستدعي تفسيراً طبياً",
    "metaTitle": "النزيف في الحمل المبكر",
    "metaDescription": "معلومات تعليمية عن النزيف في الحمل المبكر، أسبابه المحتملة وعلامات الخطر التي تستدعي تقييماً طبياً.",
    "cluster": "pregnancy",
    "excerpt": "بعض النزيف يكون محدوداً وبعضه إنذار. التمييز ليس عبر لون الصورة في هاتف صديقة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "warning-signs-in-pregnancy",
      "abnormal-bleeding",
      "signs-of-dangerous-bleeding"
    ],
    "noindex": false
  },
  {
    "slug": "family-planning-education",
    "title": "تنظيم الأسرة: معلومات تعليمية",
    "h1": "تنظيم الأسرة قرار طبي ومعلوماتي معاً",
    "metaTitle": "تنظيم الأسرة معلومات تعليمية",
    "metaDescription": "إطار عام عن أهمية المشورة الموثوقة في تنظيم الأسرة بعيداً عن الشائعات.",
    "cluster": "pregnancy",
    "excerpt": "الخيارات تُناقش حسب العمر والرضاعة والأمراض والرغبة في الحمل لاحقاً.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "reproductive-health-reliable-info",
      "official-drug-leaflets",
      "education-vs-individual-treatment"
    ],
    "noindex": false
  },
  {
    "slug": "reproductive-health-reliable-info",
    "title": "معلومات موثوقة في الصحة الإنجابية",
    "h1": "كيف تميزين المعلومة الإنجابية الموثوقة؟",
    "metaTitle": "معلومات موثوقة في الصحة الإنجابية",
    "metaDescription": "معايير عملية للتحقق من موثوقية المعلومات الصحية عن الحمل والصحة الإنجابية بعيداً عن التسويق والمصادر المجهولة.",
    "cluster": "pregnancy",
    "excerpt": "المحتوى الجيد يذكر حدوده، ويحيل إلى هيئات، ولا يبيع دواء في الهامش.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "how-to-verify-medical-information",
      "trusted-sources-further-reading",
      "family-planning-education"
    ],
    "noindex": false
  },
  {
    "slug": "education-vs-individual-treatment",
    "title": "التعليم مقابل العلاج الفردي",
    "h1": "خط فاصل يحمي القارئة",
    "metaTitle": "التعليم مقابل العلاج الفردي في الحمل",
    "metaDescription": "توضيح الفرق بين المعلومات التعليمية والعلاج الفردي في الحمل، ولماذا لا تكفي المقالات لإدارة حالة أو دواء أو نزيف.",
    "cluster": "pregnancy",
    "excerpt": "كلما اقترب السؤال من «ماذا أفعل الليلة؟» ابتعد المقال واقتربت العيادة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "general-info-vs-personal-advice",
      "pregnancy-follow-up-care",
      "internet-not-a-doctor"
    ],
    "noindex": false
  },
  {
    "slug": "pregnancy-and-medicines-faq",
    "title": "أسئلة شائعة عن الأدوية والحمل",
    "h1": "أدوية الحمل: أسئلة تتكرر وإجابات محدودة عمداً",
    "metaTitle": "أسئلة شائعة عن الأدوية والحمل",
    "metaDescription": "إجابات تعليمية عن الأدوية والحمل، وكيفية التعامل مع المعلومات العامة دون تحويل الأسئلة الشائعة إلى وصفات فردية.",
    "cluster": "pregnancy",
    "excerpt": "القاعدة الذهبية: لا تبدئي ولا توقفي دواءاً مزمناً فجأة دون سؤال الجهة المعالجة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "early-pregnancy-overview",
      "why-contraindicated-in-pregnancy-ulcer-use",
      "discussing-medication-history",
      "breastfeeding-considerations"
    ],
    "noindex": false
  },
  {
    "slug": "womens-health-life-stages",
    "title": "صحة المرأة عبر مراحل العمر",
    "h1": "احتياجات تتغير فلا تُختزل في موضوع واحد",
    "metaTitle": "صحة المرأة عبر مراحل العمر",
    "metaDescription": "نظرة تعليمية لمحور صحة المرأة من سن الإنجاب إلى ما بعده بعيداً عن اختزال دواء واحد.",
    "cluster": "womens-health",
    "excerpt": "كل مرحلة لها فحوصات وأولويات مختلفة. البحث عن اسم دواء قد يحجب هذه الخريطة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "routine-womens-screening",
      "reproductive-age-preventive-care",
      "reliable-womens-health-sources"
    ],
    "noindex": false
  },
  {
    "slug": "irregular-menstrual-cycle",
    "title": "اضطراب الدورة الشهرية",
    "h1": "عندما يتغيّر الإيقاع المعتاد",
    "metaTitle": "اضطراب الدورة الشهرية معلومات تعليمية",
    "metaDescription": "إطار تعليمي لفهم اضطراب الدورة الشهرية وأسبابه المحتملة والعلامات التي تجعل التقييم الطبي مهماً.",
    "cluster": "womens-health",
    "excerpt": "التغير المفاجئ في الغزارة أو المدة أو التباعد معلومة سريرية، لا مجرد إزعاج.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "anemia-womens-health",
      "pelvic-pain-when-to-see-doctor",
      "family-planning-education"
    ],
    "noindex": false
  },
  {
    "slug": "pelvic-pain-when-to-see-doctor",
    "title": "ألم الحوض: متى تراجعين الطبيب؟",
    "h1": "ألم الحوض رسالة تحتاج تفسيراً",
    "metaTitle": "ألم الحوض متى تراجعين الطبيب",
    "metaDescription": "علامات ألم الحوض التي تستدعي عيادة أو طوارئ، بما في ذلك الألم مع حمل محتمل.",
    "cluster": "womens-health",
    "excerpt": "الألم الذي يوقظ من النوم أو يمنع المشي أو يرافق حمى أو إغماء لا يُدار بالمسكّن وحده.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "severe-abdominal-pain",
      "warning-signs-in-pregnancy",
      "when-to-see-doctor-immediately",
      "reproductive-tract-infections-awareness"
    ],
    "noindex": false
  },
  {
    "slug": "anemia-womens-health",
    "title": "فقر الدم وصحة المرأة",
    "h1": "التعب ليس تفصيلاً تجميلياً",
    "metaTitle": "فقر الدم وصحة المرأة",
    "metaDescription": "معلومات تعليمية عن ارتباط النزف والتعب بفقر الدم وضرورة التشخيص قبل أي علاج ذاتي.",
    "cluster": "womens-health",
    "excerpt": "فقر الدم شائع نسبياً لدى النساء في سن الإنجاب، وتشخيصه مخبري لا حدسي.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "irregular-menstrual-cycle",
      "nutrition-hormonal-health",
      "routine-womens-screening"
    ],
    "noindex": false
  },
  {
    "slug": "mental-and-reproductive-health",
    "title": "الصحة النفسية والإنجابية",
    "h1": "القلق والاكتئاب جزء من الصورة الطبية",
    "metaTitle": "الصحة النفسية والإنجابية",
    "metaDescription": "معلومات تعليمية عن العلاقة بين الصحة النفسية والصحة الإنجابية، وكيفية التعامل مع القلق والبحث الطبي المتكرر.",
    "cluster": "womens-health",
    "excerpt": "البحث المتكرر عن مضاعفات نادرة قد يكون عرضاً لقلق يستحق دعماً، لا مزيداً من الصفحات فقط.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "miscarriage-educational-overview",
      "education-vs-individual-treatment",
      "womens-health-life-stages"
    ],
    "noindex": false
  },
  {
    "slug": "routine-womens-screening",
    "title": "الفحوصات الدورية للمرأة",
    "h1": "الوقاية جدول لا مزاج",
    "metaTitle": "الفحوصات الدورية للمرأة",
    "metaDescription": "لماذا تُعد الفحوصات الدورية جزءاً من صحة المرأة رغم اختلاف الجداول حسب العمر والتاريخ.",
    "cluster": "womens-health",
    "excerpt": "الجداول تختلف حسب العمر والتاريخ العائلي، لذلك لا تُنسخ من إعلان.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "reproductive-age-preventive-care",
      "womens-health-life-stages",
      "reliable-womens-health-sources"
    ],
    "noindex": false
  },
  {
    "slug": "reproductive-tract-infections-awareness",
    "title": "التوعية بعدوى الجهاز التناسلي",
    "h1": "أعراض تستحق فحصاً لا حرجاً",
    "metaTitle": "التوعية بعدوى الجهاز التناسلي",
    "metaDescription": "توعية بأعراض قد ترتبط بعدوى الجهاز التناسلي، ومتى تحتاج الأعراض إلى تقييم طبي ومصدر معلومات موثوق.",
    "cluster": "womens-health",
    "excerpt": "الحكة أو الإفراز غير المعتاد أو الألم أو الحمى لا تُعالج بوصفة صديقة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pelvic-pain-when-to-see-doctor",
      "routine-womens-screening",
      "when-to-see-doctor-immediately"
    ],
    "noindex": false
  },
  {
    "slug": "reproductive-age-preventive-care",
    "title": "الوقاية في سن الإنجاب",
    "h1": "سنوات الانشغال لا تبرر إهمال الوقاية",
    "metaTitle": "الوقاية في سن الإنجاب",
    "metaDescription": "محاور وقائية لسن الإنجاب: الدورة، فقر الدم، التطعيم، والصحة الإنجابية.",
    "cluster": "womens-health",
    "excerpt": "سن الإنجاب مرحلة إنتاج وحمل محتمل وعمل، فيتراكم التأجيل بسهولة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "routine-womens-screening",
      "anemia-womens-health",
      "family-planning-education"
    ],
    "noindex": false
  },
  {
    "slug": "nutrition-hormonal-health",
    "title": "التغذية والصحة الهرمونية",
    "h1": "الغذاء داعم لا بروتوكول هرموني سري",
    "metaTitle": "التغذية والصحة الهرمونية",
    "metaDescription": "شرح حدود دور التغذية في الصحة الهرمونية وصحة المرأة، مع تجنب الادعاءات التي تستبدل التقييم الطبي.",
    "cluster": "womens-health",
    "excerpt": "النمط الغذائي المتوازن يدعم الطاقة والدورة والحمل، لكنه لا يعالج كل اضطراب هرموني.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "anemia-womens-health",
      "womens-health-life-stages",
      "reliable-womens-health-sources"
    ],
    "noindex": false
  },
  {
    "slug": "reliable-womens-health-sources",
    "title": "مصادر موثوقة لصحة المرأة",
    "h1": "أين تقرئين بعد مغادرة هذه الصفحة؟",
    "metaTitle": "مصادر موثوقة لصحة المرأة",
    "metaDescription": "جهات وهيئات يمكن الرجوع إليها لتعليم صحة المرأة مع الحذر من المحتوى البيعي.",
    "cluster": "womens-health",
    "excerpt": "المصدر الجيد يوقع باسم مؤسسة، ويحدّث صفحاته، ولا يبيع سايتوتك في التذييل.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "reproductive-health-reliable-info",
      "trusted-sources-further-reading",
      "how-to-verify-medical-information"
    ],
    "noindex": false
  },
  {
    "slug": "common-myths-cytotec",
    "title": "مفاهيم شائعة خاطئة عن سايتوتك",
    "h1": "الشائعة تختصر… والتحذير يطول",
    "metaTitle": "مفاهيم خاطئة عن سايتوتك",
    "metaDescription": "تصحيح تعليمي لمفاهيم شائعة تخلط بين الشهرة والأمان وبين الاسم والمادة.",
    "cluster": "faq",
    "excerpt": "أكثر الأضرار المعرفية تأتي من جمل قصيرة تبدو حاسمة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "is-cytotec-safe-for-everyone",
      "unsafe-unsupervised-use",
      "brand-name-vs-active-ingredient",
      "general-safety-warnings"
    ],
    "noindex": false
  },
  {
    "slug": "is-cytotec-safe-for-everyone",
    "title": "هل سايتوتك آمن للجميع؟",
    "h1": "لا. الأمان فردي ومشروط",
    "metaTitle": "هل سايتوتك آمن للجميع",
    "metaDescription": "إجابة تعليمية مباشرة: الأمان يعتمد على الاستطباب والحمل والموانع والجودة والمتابعة.",
    "cluster": "faq",
    "excerpt": "جملة «آمن» بدون سياق أقرب إلى الإعلان منها إلى الطب.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "common-myths-cytotec",
      "contraindications-misoprostol",
      "general-safety-warnings"
    ],
    "noindex": false
  },
  {
    "slug": "use-without-prescription",
    "title": "الاستخدام دون وصفة",
    "h1": "تجاوز الوصفة يتجاوز تقييم الخطر",
    "metaTitle": "استخدام سايتوتك دون وصفة",
    "metaDescription": "توضيح مخاطر استخدام سايتوتك دون وصفة، ولماذا يحتاج القرار إلى تقييم طبي للحمل والموانع ومصدر المستحضر.",
    "cluster": "faq",
    "excerpt": "الوصفة وثيقة أمان لا عقبة بيروقراطية.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "unsafe-unsupervised-use",
      "unreliable-medicine-sources",
      "why-medical-supervision-required",
      "saudi-drug-regulation-context"
    ],
    "noindex": false
  },
  {
    "slug": "internet-not-a-doctor",
    "title": "الإنترنت ليس طبيباً",
    "h1": "محرك البحث لا يفحص بطنك",
    "metaTitle": "لماذا الإنترنت ليس بديلاً عن الطبيب",
    "metaDescription": "حدود البحث الإلكتروني في الأسئلة الطبية الحساسة وكيفية استخدامه دون ضرر.",
    "cluster": "faq",
    "excerpt": "الترتيب في نتائج البحث يعكس خوارزمية لا درجة خطورة حالتك.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "limits-of-online-medical-info",
      "how-to-verify-medical-information",
      "general-info-vs-personal-advice"
    ],
    "noindex": false
  },
  {
    "slug": "brand-name-vs-active-ingredient",
    "title": "الاسم التجاري مقابل المادة الفعالة",
    "h1": "سؤال يتكرر لأنه يختصر نصف الالتباس",
    "metaTitle": "الاسم التجاري مقابل المادة الفعالة",
    "metaDescription": "إعادة توضيح مبسطة للفرق بين سايتوتك وميزوبروستول intra الأسئلة الشائعة.",
    "cluster": "faq",
    "excerpt": "إذا حفظتِ فرقاً واحداً فليكن هذا: المادة هي ما يتعامل معه الجسم.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "difference-cytotec-misoprostol",
      "misoprostol-other-brand-names",
      "cytotec-definition"
    ],
    "noindex": false
  },
  {
    "slug": "not-all-uses-are-alike",
    "title": "ليست كل الاستخدامات متشابهة",
    "h1": "السياق يغيّر معنى الكلمة نفسها",
    "metaTitle": "لماذا ليست استخدامات ميزوبروستول متشابهة",
    "metaDescription": "توضيح أن حماية المعدة والرعاية التوليدية سياقان مختلفان تماماً في الخطر والإشراف.",
    "cluster": "faq",
    "excerpt": "كلمة «استخدام» في مقالين قد تعني عالمين لا يلتقيان.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "approved-medical-uses-misoprostol",
      "obstetric-uses-under-supervision",
      "off-label-use-meaning"
    ],
    "noindex": false
  },
  {
    "slug": "mild-symptoms-not-always-safe",
    "title": "الأعراض الخفيفة ليست دائماً مطمئنة",
    "h1": "الخفة الحالية لا تضمن المسار",
    "metaTitle": "لماذا الأعراض الخفيفة ليست دائماً آمنة",
    "metaDescription": "لماذا لا تعني الأعراض الخفيفة دائماً غياب الخطر، ومتى قد تتطلب الأعراض المتغيرة أو المتفاقمة تقييماً طبياً.",
    "cluster": "faq",
    "excerpt": "الاطمئنان المبكر شائع في الحمل خارج الرحم وبعض النزوف قبل التدهور.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "annoying-symptom-vs-emergency",
      "warning-signs-in-pregnancy",
      "mild-symptoms-not-always-safe"
    ],
    "noindex": false
  },
  {
    "slug": "how-to-verify-medical-information",
    "title": "كيف تتحققين من المعلومة الطبية؟",
    "h1": "منهج تحقق بسيط قبل التصديق",
    "metaTitle": "كيف تتحققين من المعلومة الطبية",
    "metaDescription": "خطوات عملية للتحقق من المعلومات الطبية عن الأدوية والحمل عبر المصدر والتاريخ والسياق وحدود المعلومة.",
    "cluster": "faq",
    "excerpt": "التحقق مهارة تقلل الضرر أكثر مما تزيد المعرفة فقط.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "limits-of-online-medical-info",
      "trusted-sources-further-reading",
      "internet-not-a-doctor"
    ],
    "noindex": false
  },
  {
    "slug": "contraindications-misoprostol",
    "title": "موانع استخدام ميزوبروستول",
    "h1": "الموانع ليست قائمة تخويف بل أداة فرز",
    "metaTitle": "موانع استخدام ميزوبروستول",
    "metaDescription": "عرض تعليمي لمفهوم موانع الاستخدام، بما في ذلك اعتبارات وظائف الكبد والكلى والحمل والحساسية.",
    "cluster": "interactions",
    "excerpt": "المانع يعني أن الضرر المتوقع يفوق المنفعة في ذلك السياق حتى يقرر مختص خلاف ذلك نادراً.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pregnancy-contraindication-ulcer-indication",
      "prostaglandin-allergy",
      "conditions-needing-prior-assessment"
    ],
    "noindex": false
  },
  {
    "slug": "basic-drug-interactions",
    "title": "تداخلات دوائية أساسية",
    "h1": "الدواء لا يعيش وحده في الجسم",
    "metaTitle": "تداخلات ميزوبروستول الدوائية",
    "metaDescription": "مبادئ تعليمية لفهم التداخلات الدوائية مع ميزوبروستول ولماذا يجب إبلاغ الطبيب أو الصيدلي بكل الأدوية المستخدمة.",
    "cluster": "interactions",
    "excerpt": "التداخل قد يزيد أثراً جانبياً أو يغيّر فعالية علاج آخر.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "medicines-that-may-increase-risk",
      "discussing-medication-history",
      "misoprostol-gastric-ulcers"
    ],
    "noindex": false
  },
  {
    "slug": "prostaglandin-allergy",
    "title": "الحساسية تجاه البروستاغلاندين",
    "h1": "الحساسية سابقة تستحق أن تُروى بدقة",
    "metaTitle": "الحساسية تجاه البروستاغلاندين",
    "metaDescription": "شرح أهمية معرفة التفاعلات التحسسية السابقة مع البروستاغلاندينات أو الأدوية المشابهة قبل أي قرار دوائي.",
    "cluster": "interactions",
    "excerpt": "وصف «حساسية أدوية» عام جداً. تفاصيل الطفح أو الضيق أو الإغماء تغيّر القرار.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "contraindications-misoprostol",
      "rare-serious-complications",
      "what-to-say-in-emergency"
    ],
    "noindex": false
  },
  {
    "slug": "heart-vascular-considerations",
    "title": "اعتبارات القلب والأوعية",
    "h1": "القلب يغيّر حساب المنفعة والخطر",
    "metaTitle": "اعتبارات قلبية ووعائية",
    "metaDescription": "توضيح لماذا يجب ذكر أمراض القلب والأوعية والتاريخ الطبي للطبيب قبل تقييم أي قرار دوائي حساس.",
    "cluster": "interactions",
    "excerpt": "بعض الحالات القلبية تجعل فقدان السوائل أو التقلصات أو فقر الدم أخطر.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "conditions-needing-prior-assessment",
      "dizziness-and-fainting",
      "discussing-medication-history"
    ],
    "noindex": false
  },
  {
    "slug": "cytotec-alternatives-saudi",
    "title": "بدائل سايتوتك الطبية في المستشفيات السعودية",
    "h1": "بدائل سايتوتك الطبية والخيارات العلاجية المعتمدة في المستشفيات السعودية",
    "metaTitle": "بدائل سايتوتك في المستشفيات السعودية | الخيارات الطبية المعتمدة",
    "metaDescription": "دليل توعوي شامل حول بدائل سايتوتك وميزوبروستول في المستشفيات السعودية: البروتوكولات التوليدية بالمستشفيات، بدائل حماية المعدة المعتمدة، ومتى تراجعين الرعاية الطبية.",
    "cluster": "interactions",
    "excerpt": "الخيارات البديلة لسايتوتك وميزوبروستول تُدار حصرياً داخل المستشفيات ومراكز الرعاية المعتمدة بالمملكة وفق بروتوكولات طبية دقيقة وبإشراف استشاري متخصص.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "contraindications-misoprostol",
      "conditions-needing-prior-assessment",
      "basic-drug-interactions"
    ],
    "noindex": false
  },
  {
    "slug": "breastfeeding-considerations",
    "title": "اعتبارات الرضاعة",
    "h1": "الرضاعة سؤال مستقل عن الحمل",
    "metaTitle": "ميزوبروستول والرضاعة اعتبارات تعليمية",
    "metaDescription": "معلومات تعليمية عن مناقشة الرضاعة مع الأدوية، ولماذا يعتمد التقييم على المستحضر والحالة والسياق الطبي.",
    "cluster": "interactions",
    "excerpt": "ما يصل إلى الحليب وكيفية مراقبة الرضيع قرار يُتخذ مع الطبيب لا مع المنشور.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pregnancy-and-medicines-faq",
      "discussing-medication-history",
      "official-drug-leaflets"
    ],
    "noindex": false
  },
  {
    "slug": "medicines-that-may-increase-risk",
    "title": "أدوية قد ترفع الخطر",
    "h1": "التراكم أهم من الاسم الواحد",
    "metaTitle": "أدوية قد تزيد الخطر مع ميزوبروستول",
    "metaDescription": "إطار تعليمي عن تجمع أدوية النزف أو الجفاف أو التأثير الرحمي دون قوائم مرعبة غير مكتملة.",
    "cluster": "interactions",
    "excerpt": "الخطر غالباً تراكمي: مسكن + سيولة + جفاف + تأخير رعاية.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "basic-drug-interactions",
      "abnormal-bleeding",
      "misoprostol-gastric-ulcers"
    ],
    "noindex": false
  },
  {
    "slug": "conditions-needing-prior-assessment",
    "title": "حالات تحتاج تقييماً مسبقاً",
    "h1": "قبل أي وصف: ما الذي يجب أن يُعرف؟",
    "metaTitle": "حالات تحتاج تقييماً قبل ميزوبروستول",
    "metaDescription": "أمثلة تعليمية لحالات تستدعي تقييماً أدق: الحمل، الجراحة الرحمية، النزف، والأمراض المزمنة.",
    "cluster": "interactions",
    "excerpt": "التقييم المسبق أرخص وأأمن من إدارة مضاعفة لاحقاً.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "contraindications-misoprostol",
      "heart-vascular-considerations",
      "why-medical-supervision-required",
      "cytotec-alternatives-saudi"
    ],
    "noindex": false
  },
  {
    "slug": "pregnancy-contraindication-ulcer-indication",
    "title": "مانع الحمل مع استطباب القرحة",
    "h1": "عندما يتعارض غرضان في النشرة نفسها",
    "metaTitle": "مانع الحمل حتى مع استطباب القرحة",
    "metaDescription": "إعادة تركيز على أن حماية المعدة لا تُمنح أثناء الحمل وفق النشرة المعروفة.",
    "cluster": "interactions",
    "excerpt": "هذا التقاطع أكثر ما يُساء فهمه: «لكنني أريده للمعدة فقط».",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "why-contraindicated-in-pregnancy-ulcer-use",
      "pregnancy-boxed-warning",
      "contraindications-misoprostol"
    ],
    "noindex": false
  },
  {
    "slug": "discussing-medication-history",
    "title": "كيف تناقشين تاريخك الدوائي؟",
    "h1": "رواية الدواء مهارة تحمي",
    "metaTitle": "مناقشة التاريخ الدوائي مع الطبيب",
    "metaDescription": "طريقة عملية لسرد الأدوية والحساسيات والحمل المحتمل في العيادة أو الطوارئ.",
    "cluster": "interactions",
    "excerpt": "الدقيقة التي تُنظم فيها قائمتك قد تختصر ساعة ارتباك في الطوارئ.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "what-to-say-in-emergency",
      "basic-drug-interactions",
      "pregnancy-and-medicines-faq"
    ],
    "noindex": false
  },
  {
    "slug": "when-to-see-doctor-immediately",
    "title": "متى تراجعين الطبيب فوراً",
    "h1": "عتبة الفورية أوضح مما يظن كثيرون",
    "metaTitle": "متى تراجعين الطبيب فوراً",
    "metaDescription": "علامات وأعراض تستدعي مراجعة الطبيب فوراً أو طلب رعاية عاجلة، مع توضيح متى لا يكفي الانتظار لموعد روتيني.",
    "cluster": "emergency",
    "excerpt": "الفورية تعني الآن: نزيف غزير، إغماء، ألم حاد، حمى متدهورة، ضيق تنفس.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "signs-of-dangerous-bleeding",
      "severe-abdominal-pain",
      "dizziness-and-fainting"
    ],
    "noindex": false
  },
  {
    "slug": "signs-of-dangerous-bleeding",
    "title": "علامات النزيف الخطير",
    "h1": "كيف تصفين النزيف حتى تُفهمي بسرعة",
    "metaTitle": "علامات النزيف الخطير",
    "metaDescription": "مؤشرات تعليمية للنزيف الذي يستدعي إنقاذاً: الكمية، السرعة، والأعراض العامة.",
    "cluster": "emergency",
    "excerpt": "الشحوب والتعرق البارد وتسارع القلب مع نزيف متزايد صورة لا تُراقب في البيت.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "abnormal-bleeding",
      "bleeding-in-early-pregnancy",
      "what-to-say-in-emergency"
    ],
    "noindex": false
  },
  {
    "slug": "high-fever-and-infection",
    "title": "الحمى المرتفعة والعدوى",
    "h1": "الحمى مع تدهور عام ليست انتظاراً",
    "metaTitle": "الحمى المرتفعة والعدوى",
    "metaDescription": "متى قد تشير الحمى المرتفعة إلى عدوى أو مضاعفة تحتاج تقييماً عاجلاً، خصوصاً مع الألم أو النزيف أو الحمل.",
    "cluster": "emergency",
    "excerpt": "العدوى قد تتسارع. الرعشة والارتباك وانخفاض البول علامات سوء.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "fever-and-chills",
      "when-symptoms-are-emergencies",
      "follow-up-after-medical-care"
    ],
    "noindex": false
  },
  {
    "slug": "severe-abdominal-pain",
    "title": "ألم البطن الشديد",
    "h1": "الألم الذي يثنيك عن الحركة",
    "metaTitle": "ألم البطن الشديد متى يكون طارئاً",
    "metaDescription": "إطار تعليمي لفهم ألم البطن الشديد وعلامات الخطر التي قد تستدعي تقييماً عاجلاً، خصوصاً أثناء الحمل.",
    "cluster": "emergency",
    "excerpt": "الألم المفاجئ الكاسر مع قيء أو إغماء أو بطن قاسٍ مسار طوارئ.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pelvic-pain-when-to-see-doctor",
      "warning-signs-in-pregnancy",
      "uterine-reproductive-effects"
    ],
    "noindex": false
  },
  {
    "slug": "dizziness-and-fainting",
    "title": "الدوخة والإغماء",
    "h1": "فقدان الوعي ليس تعباً عابراً",
    "metaTitle": "الدوخة والإغماء علامات خطر",
    "metaDescription": "شرح تعليمي للدوخة والإغماء وعلاقتهما المحتملين بالنزف أو الجفاف أو حالات تستدعي تقييماً عاجلاً.",
    "cluster": "emergency",
    "excerpt": "الإغماء مع نزيف أو ألم بطني يغيّر الأولوية إلى الإنقاذ.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "signs-of-dangerous-bleeding",
      "when-to-see-doctor-immediately",
      "anemia-womens-health"
    ],
    "noindex": false
  },
  {
    "slug": "what-to-say-in-emergency",
    "title": "ماذا تقولين في قسم الطوارئ؟",
    "h1": "جمل قليلة ترتّب الفرز",
    "metaTitle": "ماذا تقولين في الطوارئ",
    "metaDescription": "عناصر عملية تُذكر في أول دقيقة: الحمل، النزف، الإغماء، الأدوية، الحساسية.",
    "cluster": "emergency",
    "excerpt": "الفرز يعتمد على وضوحك لا على بلاغتك.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "discussing-medication-history",
      "signs-of-dangerous-bleeding",
      "follow-up-after-medical-care"
    ],
    "noindex": false
  },
  {
    "slug": "follow-up-after-medical-care",
    "title": "المتابعة بعد الرعاية الطبية",
    "h1": "الخروج من الطوارئ ليس نهاية القصة",
    "metaTitle": "المتابعة بعد الرعاية الطبية",
    "metaDescription": "لماذا تُعد تعليمات الخروج ومواعيد التحليل وإعادة التقييم جزءاً من الأمان.",
    "cluster": "emergency",
    "excerpt": "بعض المضاعفات تظهر بعد ساعات أو أيام. المتابعة تلتقطها.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "what-to-do-if-side-effects",
      "high-fever-and-infection",
      "hospital-clinic-limits"
    ],
    "noindex": false
  },
  {
    "slug": "annoying-symptom-vs-emergency",
    "title": "العرض المزعج مقابل الطارئ",
    "h1": "أداة فرز ذهنية لا تغني عن الفحص",
    "metaTitle": "الفرق بين العرض المزعج والطوارئ",
    "metaDescription": "كيف تفرّقين تقريباً بين إزعاج يمكن ترتيبه في عيادة وبين علامة لا تنتظر.",
    "cluster": "emergency",
    "excerpt": "المزعج يعيق الراحة. الطارئ يهدد الاستقرار أو الوعي أو يسبب نزفاً سريعاً.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "when-symptoms-are-emergencies",
      "mild-symptoms-not-always-safe",
      "what-to-do-if-side-effects"
    ],
    "noindex": false
  },
  {
    "slug": "danger-of-delaying-care",
    "title": "خطر تأخير الرعاية",
    "h1": "التأخير يحوّل القابل للعلاج إلى معقّد",
    "metaTitle": "خطر تأخير الرعاية الطبية",
    "metaDescription": "لماذا يُعد التأخير بسبب الخوف أو الوصمة أو الانتظار الإلكتروني قراراً محفوفاً.",
    "cluster": "emergency",
    "excerpt": "ساعات الانتظار قد تعني نزفاً أكبر أو تمزقاً أو صدمة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "why-not-home-treatment",
      "when-to-see-doctor-immediately",
      "what-to-say-in-emergency"
    ],
    "noindex": false
  },
  {
    "slug": "how-to-evaluate-medical-evidence",
    "title": "كيف تُقيَّم الأدلة الطبية؟",
    "h1": "من القصة الفردية إلى الدليل",
    "metaTitle": "كيف تُقيَّم الأدلة الطبية",
    "metaDescription": "مقدمة تعليمية لتسلسل قوة الدليل: الملاحظة، الدراسات، المراجعات، والنشرات التنظيمية.",
    "cluster": "evidence",
    "excerpt": "ليست كل جملة منشورة دليلاً. القوة تأتي من المنهج وقابلية التكرار ومراجعة الجهات.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "clinical-studies-vs-anecdotes",
      "reading-a-paper-as-non-specialist",
      "trusted-sources-further-reading",
      "common-medical-terms-misoprostol"
    ],
    "noindex": false
  },
  {
    "slug": "fda-cytotec-warnings",
    "title": "تحذيرات إدارة الغذاء والدواء حول سايتوتك",
    "h1": "ماذا تفعل النشرة الأمريكية في فهمنا؟",
    "metaTitle": "تحذيرات FDA لسايتوتك",
    "metaDescription": "قراءة تعليمية لأبرز ما تشتهر به نشرة سايتوتك: الاستطباب المشروط وتحذير الحمل.",
    "cluster": "evidence",
    "excerpt": "النشرة وثيقة قانونية-علمية للمستحضر، لا مقال رأي.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "pregnancy-boxed-warning",
      "official-drug-leaflets",
      "regulatory-drug-warnings"
    ],
    "noindex": false
  },
  {
    "slug": "official-drug-leaflets",
    "title": "النشرات الدوائية الرسمية ومراجع الهيئات الصحية",
    "h1": "لماذا تبقى النشرة الرسمية ومراجع الهيئات أصلاً يمكن فحصه؟",
    "metaTitle": "النشرات الدوائية الرسمية ومراجع الهيئات الصحية",
    "metaDescription": "دور نشرات الأدوية المعتمدة وDailyMed ومراجع منظمة الصحة العالمية والهيئات الرقابية في التحقق من الاستطبابات والتحذيرات.",
    "cluster": "evidence",
    "excerpt": "النشرة الرسمية تُحدَّث، وتُنسب إلى مستحضر، وتوفر مرجعاً موثقاً يخضع لرقابة هيئات الدواء لا للمقالات الدعائية.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "how-to-read-package-insert",
      "fda-cytotec-warnings",
      "how-to-verify-medical-information"
    ],
    "noindex": false
  },
  {
    "slug": "clinical-studies-vs-anecdotes",
    "title": "الدراسات مقابل القصص الشخصية",
    "h1": "قصتك مهمة إنسانياً… وضعيفة كدليل وحيد",
    "metaTitle": "الدراسات السريرية مقابل القصص",
    "metaDescription": "الفرق بين حكاية فردية ودراسة سريرية ولماذا لا تُبنى قرارات الدواء على التعليقات.",
    "cluster": "evidence",
    "excerpt": "القصص تُحيز للنجاح أو الكارثة، والدراسات تحاول ضبط التحيز.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "how-to-evaluate-medical-evidence",
      "limits-of-online-medical-info",
      "reading-a-paper-as-non-specialist"
    ],
    "noindex": false
  },
  {
    "slug": "reading-a-paper-as-non-specialist",
    "title": "قراءة ورقة علمية لغير المتخصص",
    "h1": "ماذا يمكن أن تفهمي دون ادعاء الخبرة؟",
    "metaTitle": "قراءة ورقة علمية لغير المتخصص",
    "metaDescription": "دليل مبسط لقراءة ورقة علمية: سؤال البحث، العينة، المقارنة، النتائج، الحدود، والتمويل دون القفز إلى استنتاجات فردية.",
    "cluster": "evidence",
    "excerpt": "قراءة الملخص بذكاء خير من مشاركة العنوان فقط.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "how-to-evaluate-medical-evidence",
      "clinical-studies-vs-anecdotes",
      "why-medical-recommendations-change"
    ],
    "noindex": false
  },
  {
    "slug": "limits-of-online-medical-info",
    "title": "حدود المعلومات الطبية على الإنترنت",
    "h1": "الشبكة واسعة… والمسؤولية ضيقة",
    "metaTitle": "حدود المعلومات الطبية على الإنترنت",
    "metaDescription": "لماذا لا تعوّض المعلومات الطبية على الإنترنت الفحص والمتابعة والسجل الطبي، وكيف تُستخدم المصادر الإلكترونية بأمان.",
    "cluster": "evidence",
    "excerpt": "لا يوجد على الصفحة من يتحمل نتيجة قرارك الفردي.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "internet-not-a-doctor",
      "how-to-verify-medical-information",
      "education-vs-individual-treatment"
    ],
    "noindex": false
  },
  {
    "slug": "common-medical-terms-misoprostol",
    "title": "مصطلحات طبية شائعة حول ميزوبروستول",
    "h1": "قاموس صغير يمنع سوء الفهم",
    "metaTitle": "مصطلحات طبية شائعة حول ميزوبروستول",
    "metaDescription": "قاموس مبسط لمصطلحات ميزوبروستول مثل الاستطباب والمانع وخارج النشرة والمادة الفعالة لتقليل سوء الفهم.",
    "cluster": "evidence",
    "excerpt": "المصطلح إن لم يُعرَّف يتحول إلى رهبة أو إلى جرأة فارغة.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "off-label-use-meaning",
      "misoprostol-pharmacologic-class",
      "official-drug-leaflets"
    ],
    "noindex": false
  },
  {
    "slug": "why-medical-recommendations-change",
    "title": "لماذا تتغير التوصيات الطبية؟",
    "h1": "التغيير علامة علم لا علامة فوضى بالضرورة",
    "metaTitle": "لماذا تتغير التوصيات الطبية",
    "metaDescription": "أسباب تغير التوصيات الطبية مع ظهور أدلة جديدة وتحديثات السلامة واختلاف الموارد والسياق التنظيمي المحلي.",
    "cluster": "evidence",
    "excerpt": "ما دُرّس قبل عشر سنوات قد يُقيَّد اليوم بعد رصد أوسع.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "how-to-evaluate-medical-evidence",
      "regulatory-drug-warnings",
      "reading-a-paper-as-non-specialist"
    ],
    "noindex": false
  },
  {
    "slug": "trusted-sources-further-reading",
    "title": "مصادر موثوقة لقراءة إضافية",
    "h1": "إلى أين بعد هذه المجموعة؟",
    "metaTitle": "مصادر موثوقة لقراءة إضافية",
    "metaDescription": "قائمة هيئات يمكن الرجوع إليها: FDA وWHO وSFDA وMOH وMedlinePlus وCochrane.",
    "cluster": "evidence",
    "excerpt": "القراءة الإضافية المفيدة مؤسسية وقابلة للفتح ولا تبيع الدواء.",
    "publishedAt": "2026-01-20",
    "updatedAt": "2026-03-18",
    "related": [
      "reliable-womens-health-sources",
      "how-to-evaluate-medical-evidence",
      "official-drug-leaflets"
    ],
    "noindex": false
  },
  {
    "slug": "cytotec-uses",
    "title": "معلومات توعوية عن سايتوتك وميزوبروستول - دليل التوعية الدوائية",
    "h1": "معلومات توعوية عن سايتوتك وميزوبروستول: ما يجب أن تعرفيه قبل أي قرار",
    "metaTitle": "معلومات توعوية عن سايتوتك وميزوبروستول | صحة المرأة السعودية",
    "metaDescription": "دليل توعوي موثق عن سايتوتك وميزوبروستول: التعريف، الاستطباب، التحذيرات، أمان المصدر، ومتى تطلبين رعاية طبية. لا جرعات ولا بيع.",
    "cluster": "definition",
    "excerpt": "مقال تعليمي شامل يوضح معلومات موثقة عن سايتوتك وميزوبروستول ضمن إطار التوعية الدوائية لصحة المرأة السعودية، مع التركيز على السلامة والمصادر الرسمية وحدود التعليم العام.",
    "publishedAt": "2026-09-06",
    "updatedAt": "2026-09-15",
    "related": [
      "cytotec-definition",
      "misoprostol-active-ingredient",
      "difference-cytotec-misoprostol",
      "general-safety-warnings",
      "pregnancy-boxed-warning",
      "unreliable-medicine-sources",
      "saudi-drug-regulation-context"
    ],
    "noindex": false
  }
];

export const publicArticleIndex = articleIndex.filter((article) => !article.noindex);
