import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CatalogProvider } from "./cms/CatalogContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CatalogProvider>
          <App />
        </CatalogProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
