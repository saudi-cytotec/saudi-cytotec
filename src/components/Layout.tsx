import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function Layout() {
  return (
    <>
      <a href="#content" className="skip-link">
        تخطي إلى المحتوى
      </a>
      <Header />
      <main id="content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
