import { useLayoutEffect } from "react";

// Capture only the server's initial fallback tags, before React mounts. Querying
// inside the effect would also select React 19's hoisted, page-specific tags.
// Keep this in its own module so ordinary country-page HMR does not recapture
// React-owned nodes. This read alone does not change the homepage in any way.
const fallbackSelector = [
  "title",
  'link[rel="canonical"]',
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
].join(",");
const initialFallbacks = typeof document === "undefined"
  ? []
  : [...document.head.querySelectorAll(fallbackSelector)];

/**
 * The existing HTML shell contains homepage metadata, while Helmet v3 on
 * React 19 hoists a second set rather than adopting the fallback nodes. Only
 * the new country pages opt into this boundary: their existing Seo component
 * owns one canonical/title/description/robots/social set. On route exit the
 * initial shell is restored, leaving existing pages' behavior unchanged.
 */
export function useCountryPageMetadata() {
  useLayoutEffect(() => {
    const removed = initialFallbacks
      .filter((node) => node.parentNode === document.head)
      .map((node) => ({ node, next: node.nextSibling }));
    for (const { node } of removed) node.remove();
    return () => {
      for (const { node, next } of [...removed].reverse()) {
        if (!node.isConnected) document.head.insertBefore(node, next?.parentNode === document.head ? next : null);
      }
    };
  }, []);
}
