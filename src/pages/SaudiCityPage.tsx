import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { JsonLd, Seo } from "../components/Seo";
import { PageHero } from "../components/PageHero";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { ReferencesList } from "../components/ReferencesList";
import { CareReferral } from "../components/CareReferral";
import { ContentBlocks } from "../components/ContentBlocks";
import { buildCityLongForm } from "../data/cityLongForm";
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
  <div className="max-w-4xl"><ContentBlocks blocks={buildCityLongForm(spec)} /></div>
  <ReferencesList ids={["sfda","moh","fdaLabel","dailyMed","medlinePlus"]}/><CareReferral/>
  <section className="card-premium p-6"><h2 className="font-display text-2xl font-extrabold text-brand-deep">صفحات ذات صلة</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{saudiCityPages.filter(x=>x.slug!==spec.slug).map(x=><Link key={x.slug} to={`/سايتوتك-في-${x.city}`} className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">سايتوتك في {x.city}</Link>)}<Link to="/حبوب-إجهاض-الحمل-في-السعودية" className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">أدوية الإجهاض في السعودية</Link><Link to="/service-areas" className="rounded-2xl bg-cream p-4 font-bold text-brand-deep hover:bg-brand-soft">سايتوتك في السعودية</Link></div></section>
 </div>
}
export function getSaudiCitySpec(slug:string){return saudiCityPages.find(x=>x.slug===slug)}
