import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AdminApp } from "./admin/AdminApp";
import { Layout } from "./components/Layout";
import { staticPages } from "./data/pages";
import { ArticlePage } from "./pages/ArticlePage";
import { BlogIndex } from "./pages/BlogIndex";
import { ClusterPage } from "./pages/ClusterPage";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { FaqHub } from "./pages/FaqHub";
import { SearchPage } from "./pages/SearchPage";
import { ServiceAreas } from "./pages/ServiceAreas";
import { SitemapPage } from "./pages/SitemapPage";
import { StaticPage } from "./pages/StaticPage";
import { TopicsPage } from "./pages/TopicsPage";

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
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/faq" element={<FaqHub />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          {staticPages.filter((page) => page.path !== "/faq").map((page) => (
            <Route key={page.path} path={page.path} element={<StaticPage page={page} />} />
          ))}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/cluster/:slug" element={<ClusterPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
