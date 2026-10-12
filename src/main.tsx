import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Cloudflare's prerender script builds the initial HTML by rendering the app
// in JSDOM; it is not ReactDOMServer output, so it must not be hydrated.
// Mount React normally to avoid hydration error #418. The prerendered HTML
// remains available in the delivered document until the client app mounts.
createRoot(root).render(app);
