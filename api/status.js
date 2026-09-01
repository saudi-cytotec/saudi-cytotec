import { json } from "./_lib/session.js";
import { publishToken, REPO_CONTEXT } from "./_lib/repo.js";

/**
 * GET /api/status
 * -----------------
 * Environment status for the CMS dashboard — which capabilities are live in
 * THIS deployment. Reports configuration presence only; never values, and
 * never any secret material.
 *
 * Deliberately absent: scheduling/cron — no automatic publishing exists.
 */
export default async function handler(_req, res) {
  const configured = {
    adminAuth: Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET),
    publishToken: Boolean(publishToken()),
    openai: Boolean(process.env.OPENAI_API_KEY),
  };
  return json(res, 200, {
    environment: process.env.NODE_ENV === "production" ? "production" : "development",
    repo: REPO_CONTEXT,
    configured,
    capabilities: {
      login: configured.adminAuth,
      publish: configured.publishToken,
      unpublish: configured.publishToken,
      aiWriter: configured.openai,
      registrySave: configured.publishToken,
      mediaUpload: configured.publishToken,
      mediaDelete: configured.publishToken,
      // No schedule / autoRelease capability: automatic publishing does not
      // exist. Every publish is an explicit administrator action.
    },
  });
}
