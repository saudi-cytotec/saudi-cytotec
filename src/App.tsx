import { useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { staticPages } from "./data/pages";
import { ArticlePage } from "./pages/ArticlePage";
import { BlogIndex } from "./pages/BlogIndex";
import { ClusterPage } from "./pages/ClusterPage";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { SearchPage } from "./pages/SearchPage";
import { SitemapPage } from "./pages/SitemapPage";
import { StaticPage } from "./pages/StaticPage";

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
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {staticPages.map((page) => (
            <Route key={page.path} path={page.path} element={<StaticPage page={page} />} />
          ))}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/cluster/:slug" element={<ClusterPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
