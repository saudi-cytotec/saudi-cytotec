import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { countryPagePaths, countryPages } from "./data/country";
import { staticPages } from "./data/pages";

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


function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
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
            {staticPages
              .filter((page) => page.path !== "/faq" && !countryPagePaths.has(page.path))
              .map((page) => (
                <Route key={page.path} path={page.path} element={<StaticPage page={page} />} />
              ))}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/cluster/:slug" element={<ClusterPage />} />
            <Route path="/blog/:slug" element={<ArticlePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/contact" element={<Contact />} />
            {countryPages.map((spec) => (
              <Route key={spec.path} path={spec.path} element={<CountryCornerstonePage spec={spec} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
