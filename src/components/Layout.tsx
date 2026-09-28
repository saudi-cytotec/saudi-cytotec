import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppContact";
import { MedicalBanner, ConsultationBanner } from "./SiteWideBanners";
import { useLocation } from "react-router-dom";

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
      {!isHome ? <ConsultationBanner /> : null}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
