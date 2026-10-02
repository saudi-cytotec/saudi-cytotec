import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";

import { Home } from "./pages/Home";

const AdminApp = lazy(() => import("./admin/AdminApp").then((module) => ({ default: module.AdminApp })));
const ArticlePage = lazy(() => import("./pages/ArticlePage").then((m) => ({ default: m.ArticlePage })));
const BlogIndex = lazy(() => import("./pages/BlogIndex").then((m) => ({ default: m.BlogIndex })));
const ClusterPage = lazy(() => import("./pages/ClusterPage").then((m) => ({ default: m.ClusterPage })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const CountryCornerstonePage = lazy(() =>
  import("./pages/CountryCornerstonePage").then((m) => ({ default: m.CountryCornerstonePage })),
);
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));
const FaqHub = lazy(() => import("./pages/FaqHub").then((m) => ({ default: m.FaqHub })));
const SearchPage = lazy(() => import("./pages/SearchPage").then((m) => ({ default: m.SearchPage })));
const ServiceAreas = lazy(() => import("./pages/ServiceAreas").then((m) => ({ default: m.ServiceAreas })));
const SitemapPage = lazy(() => import("./pages/SitemapPage").then((m) => ({ default: m.SitemapPage })));
const StaticPage = lazy(() => import("./pages/StaticPage").then((m) => ({ default: m.StaticPage })));
const TopicsPage = lazy(() => import("./pages/TopicsPage").then((m) => ({ default: m.TopicsPage })));

const STATIC_PAGE_PATHS = [
  "/what-is-cytotec",
  "/misoprostol",
  "/medical-uses",
  "/safety",
  "/side-effects",
  "/when-to-see-doctor",
  "/faq",
  "/womens-health",
  "/early-pregnancy",
  "/medical-sources",
  "/about",
  "/privacy",
  "/medical-disclaimer",
  "/cytotec-saudi-arabia",
] as const;

const COUNTRY_PAGE_PATHS = [
  "/abortion-pills-saudi-arabia",
  "/abortion-pills-uae",
  "/abortion-pills-kuwait",
  "/abortion-pills-bahrain",
  "/abortion-pills-qatar",
] as const;

type RoutePathProps = { path: string };

const StaticPageRoute = lazy(() =>
  Promise.all([import("./pages/StaticPage"), import("./data/pages")]).then(([pageModule, dataModule]) => ({
    default: function StaticPageRoute({ path }: RoutePathProps) {
      const page = dataModule.staticPages.find((candidate) => candidate.path === path);
      if (!page) return null;
      const Component = pageModule.StaticPage;
      return <Component page={page} />;
    },
  })),
);

const CountryPageRoute = lazy(() =>
  Promise.all([import("./pages/CountryCornerstonePage"), import("./data/country")]).then(([pageModule, dataModule]) => ({
    default: function CountryPageRoute({ path }: RoutePathProps) {
      const spec = dataModule.countryPages.find((candidate) => candidate.path === path);
      if (!spec) return null;
      const Component = pageModule.CountryCornerstonePage;
      return <Component spec={spec} />;
    },
  })),
);


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window !== "undefined" && !navigator.userAgent.includes("jsdom")) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-cream" aria-hidden="true" />}>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="grid min-h-screen place-items-center bg-cream text-brand-deep">جاري تحميل لوحة التحرير...</div>}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/faq" element={<FaqHub />} />
            <Route path="/service-areas" element={<ServiceAreas />} />
            {STATIC_PAGE_PATHS.filter((path) => path !== "/faq").map((path) => (
              <Route key={path} path={path} element={<StaticPageRoute path={path} />} />
            ))}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/cluster/:slug" element={<ClusterPage />} />
            <Route path="/blog/:slug" element={<ArticlePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/contact" element={<Contact />} />
            {COUNTRY_PAGE_PATHS.map((path) => (
              <Route key={path} path={path} element={<CountryPageRoute path={path} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
