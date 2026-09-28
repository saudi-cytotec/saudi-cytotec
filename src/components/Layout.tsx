import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppContact";
import { MedicalBanner } from "./SiteWideBanners";

// Vercel redeploy trigger: keep production build in sync with main.
export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <>
      <a href="#content" className="skip-link">
        تخطي إلى المحتوى
      </a>
      <Header />
      {!isHome ? <MedicalBanner /> : null}
      <main id="content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
