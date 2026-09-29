import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { JsonLd, Seo } from "../components/Seo";
import { PageHero } from "../components/PageHero";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { ReferencesList } from "../components/ReferencesList";
import { CareReferral } from "../components/CareReferral";
import { SITE } from "../data/site";
import { saudiCityPages, type SaudiCitySpec } from "../data/saudiCities";

function Section({title,children}:{title:string;children:ReactNode}){return <section className="card-premium p-6"><h2 className="font-display text-2xl font-extrabold text-brand-deep">{title}</h2><div className="article-prose mt-4">{children}</div></section>}

export function SaudiCityPage({spec}:{spec:SaudiCitySpec}){
 const path=`/سايتوتك-في-${spec.city}`;
 const faq=[
  {q:`ما المقصود بالبحث عن سايتوتك في ${spec.city}؟`,a:"قد يكون المقصود معرفة ماهية الدواء أو المادة الفعالة أو التحذيرات أو البحث عن جهة صحية. اسم المدينة يحدد سياق البحث فقط ولا يثبت توفر الدواء."},
  {q:`هل تختلف معلومات سايتوتك من ${spec.city} عن بقية السعودية؟`,a:"المعلومات الدوائية الأساسية والتنظيم العام لا تتغير لمجرد اختلاف المدينة. الذي قد يختلف هو الوصول إلى الرعاية والجهات المرخصة."},
  {q:"هل ذكر اسم صيدلية يعني أن سايتوتك متوفر لديها؟",a:"لا. ذكر اسم سلسلة أو صيدلية في دليل بحثي لا يمثل تأكيداً للمخزون أو التوفر أو البيع. يجب التحقق من الجهة المرخصة والمصادر الرسمية."},
  {q:"ما المادة الفعالة في Cytotec؟",a:"المادة الفعالة في Cytotec هي ميزوبروستول. تختلف الاستطبابات والاحتياطات بحسب النشرة الرسمية والسياق الطبي."},
  {q:"أين أتحقق من المعلومات الدوائية في السعودية؟",a:"ابدئي بمصادر الهيئة العامة للغذاء والدواء والنشرة الرسمية، ثم استخدمي الجهات الصحية المرخصة عندما تحتاجين إلى تقييم شخصي."},
  {q:`ما المدن القريبة من ${spec.city}؟`,a:`نربط ${spec.city} بمدن قريبة لتسهيل التنقل والبحث، لكن لا ننشئ صفحات متطابقة لمجرد إضافة كلمة مفتاحية.`}
 ];
 return <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
  <Seo title={spec.metaTitle} description={spec.metaDescription} path={path} image={spec.banner}/>
  <JsonLd data={[
   {"@context":"https://schema.org","@type":["WebPage","MedicalWebPage"],name:spec.title,url:`${SITE.domain}${path}`,inLanguage:"ar-SA",description:spec.metaDescription,publisher:{"@type":"Organization",name:SITE.name,url:SITE.domain}},
   {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"الرئيسية",item:SITE.domain},{"@type":"ListItem",position:2,name:"سايتوتك في السعودية",item:`${SITE.domain}/service-areas`},{"@type":"ListItem",position:3,name:spec.city,item:`${SITE.domain}${path}`}]}
  ]}/>
  <PageHero crumbs={[{name:"سايتوتك في السعودية",path:"/service-areas"},{name:spec.city,path}]} title={spec.title} description={spec.intro}/>
  <figure className="overflow-hidden rounded-[1.75rem] bg-brand-deep ring-1 ring-white/10"><img src={spec.banner} alt={spec.bannerAlt} width={1600} height={600} loading="eager" decoding="async" className="h-auto w-full"/></figure>
  <DisclaimerBanner/>
  <Section title={`سايتوتك في ${spec.city}: إجابة مباشرة`}><p>{spec.intro}</p><p>سايتوتك اسم تجاري والمادة الفعالة هي ميزوبروستول. هذه الصفحة لا تقدم جرعات أو خطوات استخدام أو تعليمات لإنهاء الحمل؛ هدفها تنظيم المعلومات الطبية ومساعدة الباحثة على التمييز بين المصدر الموثوق والادعاء غير الموثق.</p></Section>
  <Section title={`لماذا يبحث المستخدمون عن سايتوتك ${spec.city}؟`}>{spec.localContext.map(p=><p key={p}>{p}</p>)}</Section>
  <Section title="سايتوتك والميزوبروستول: المصطلحات التي يجب التفريق بينها"><p>Cytotec هو اسم تجاري لدواء يحتوي على ميزوبروستول. قد تظهر كلمات مثل سايتوتك وميزوبروستول وحبوب الإجهاض في نتائج البحث، لكنها ليست مترادفات كاملة من الناحية الطبية. لذلك نربط الاستعلامات بالصفحات التي تشرح التعريف والاستطبابات والسلامة والمصادر.</p><div className="grid gap-3 sm:grid-cols-2">{[["/what-is-cytotec","ما هو سايتوتك؟"],["/misoprostol","ميزوبروستول"],["/medical-uses","الاستخدامات الطبية"],["/safety","الأمان والتحذيرات"],["/side-effects","الآثار الجانبية"],["/medical-sources","المصادر الطبية"]].map(([to,label])=><Link key={to} to={to} className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">{label}</Link>)}</div></Section>
  <Section title={`كيف تتحققين من المعلومة الدوائية في ${spec.city}؟`}><p>قد تقود نتائج البحث المحلية إلى صفحات تجارية أو أدلة صيدليات أو منشورات غير رسمية. ظهور اسم صيدلية أو عبارة بحث لا يثبت تسجيل المنتج أو توفره أو ملاءمته لحالة معينة.</p><p>ابدئي من النشرة الرسمية وبيانات الهيئة العامة للغذاء والدواء، ثم استخدمي جهة صحية مرخصة عندما تحتاجين إلى تقييم شخصي. هكذا يبقى البحث المحلي وسيلة للوصول إلى المعلومة، لا بديلاً عن التقييم الطبي.</p><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-line bg-cream p-4"><h3 className="font-bold text-brand-deep">تحققي من المصدر</h3><p className="mt-2 text-sm leading-7 text-ink-soft">هل المعلومة صادرة عن جهة صحية أو نشرة رسمية؟</p></div><div className="rounded-2xl border border-line bg-cream p-4"><h3 className="font-bold text-brand-deep">لا تفترضي التوفر</h3><p className="mt-2 text-sm leading-7 text-ink-soft">نتيجة البحث لا تعني وجود الدواء في مخزون صيدلية معينة.</p></div><div className="rounded-2xl border border-line bg-cream p-4"><h3 className="font-bold text-brand-deep">اطلبي تقييماً عند الحاجة</h3><p className="mt-2 text-sm leading-7 text-ink-soft">المعلومة العامة لا تحل محل التقييم الطبي الفردي.</p></div></div></Section>
  <Section title={`السلامة والمصادر الرسمية للباحثات في ${spec.city}`}><p>المعلومات المتعلقة بالأدوية الخاضعة للتنظيم يجب أن تبدأ من المصدر الرسمي. الهيئة العامة للغذاء والدواء توفر قاعدة بيانات للأدوية وقواعد لتصنيف الوضع القانوني والتوزيعي، لذلك استخدمي المصدر الرسمي للتحقق من بيانات المنتج بدلاً من منشور مجهول.</p><p>إذا كانت هناك أعراض شديدة أو حالة طارئة، فالأولوية للرعاية العاجلة وليس لنتائج البحث. لا تحل صفحة ويب محل الفحص الطبي أو التشخيص الفردي.</p><div className="grid gap-3 sm:grid-cols-2"><Link to="/safety" className="rounded-2xl bg-warn-soft p-4 font-bold text-brand-deep">الأمان والتحذيرات</Link><Link to="/when-to-see-doctor" className="rounded-2xl bg-clay/10 p-4 font-bold text-brand-deep">متى تراجعين الطبيب؟</Link></div></Section>
  <Section title={`مدن قريبة من ${spec.city}`}><p>هذه روابط بحثية للمدن القريبة. الصفحات التي لم تُطلق بعد ستظهر كأسماء فقط حتى لا نضع روابط ميتة.</p><div className="flex flex-wrap gap-2">{spec.nearbyCities.map(city=>{const target=saudiCityPages.find(x=>x.city===city);return target?<Link key={city} to={`/سايتوتك-في-${target.city}`} className="rounded-full border border-line bg-cream px-4 py-2 font-semibold text-brand-deep hover:bg-brand-soft">{city}</Link>:<span key={city} className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink-soft">{city}</span>})}</div></Section>
  <section className="card-premium p-6"><h2 className="font-display text-2xl font-extrabold text-brand-deep">الأسئلة الشائعة</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{faq.map(x=><article key={x.q} className="rounded-2xl bg-cream p-5"><h3 className="font-bold text-brand-deep">{x.q}</h3><p className="mt-2 text-sm leading-8 text-ink-soft">{x.a}</p></article>)}</div></section>
  <ReferencesList ids={["sfda","moh","fdaLabel","dailyMed","medlinePlus"]}/><CareReferral/>
  <section className="card-premium p-6"><h2 className="font-display text-2xl font-extrabold text-brand-deep">صفحات ذات صلة</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{saudiCityPages.filter(x=>x.slug!==spec.slug).map(x=><Link key={x.slug} to={`/سايتوتك-في-${x.city}`} className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">سايتوتك في {x.city}</Link>)}<Link to="/حبوب-إجهاض-الحمل-في-السعودية" className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">أدوية الإجهاض في السعودية</Link><Link to="/service-areas" className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">سايتوتك في السعودية</Link></div></section>
 </div>
}
export function getSaudiCitySpec(slug:string){return saudiCityPages.find(x=>x.slug===slug)}
