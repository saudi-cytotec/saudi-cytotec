import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppContact";

const DeferredFooter = lazy(() =>
  import("./Footer").then((module) => ({ default: module.Footer })),
);

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
      <Suspense fallback={null}>
        <div className="defer-render" data-deferred-footer="true">
          <DeferredFooter />
        </div>
      </Suspense>
      <WhatsAppFloat />
    </>
  );
}
