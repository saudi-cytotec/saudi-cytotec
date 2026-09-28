import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppContact";
import { MedicalBanner, ConsultationBanner } from "./SiteWideBanners";

export function Layout() {
  return (
    <>
      <a href="#content" className="skip-link">
        تخطي إلى المحتوى
      </a>
      <Header />
      <MedicalBanner />
      <main id="content">
        <Outlet />
      </main>
      <ConsultationBanner />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
