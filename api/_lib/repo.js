/**
 * Shared Git-commit helpers for the git-backed CMS endpoints.
 *
 * A "save" to a registry file (content/*.json) is a commit to the repository;
 * the commit triggers a Vercel redeploy, which is what makes the change live.
 * All writers require GITHUB_PUBLISH_TOKEN and are admin-authenticated by the
 * calling endpoint. The token is never logged or returned.
 */

const OWNER = process.env.GITHUB_REPO_OWNER || "saudi-cytotec";
const REPO = process.env.GITHUB_REPO_NAME || "saudi-cytotec";
const BRANCH = process.env.GITHUB_REPO_BRANCH || "main";
const API = "https://api.github.com";

export function publishToken() {
  return process.env.GITHUB_PUBLISH_TOKEN || "";
}

export async function gh(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  return { ok: response.ok, status: response.status, payload };
}

function toBase64(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

export async function existingSha(token, filePath) {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`, { token });
  if (res.ok && res.payload?.sha) return res.payload.sha;
  return undefined;
}

export async function readFile(token, filePath) {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`, { token });
  if (!res.ok || !res.payload) return null;
  const { sha, content, encoding } = res.payload;
  if (typeof content !== "string") return { sha, text: "" };
  if (encoding === "base64") return { sha, text: Buffer.from(content, "base64").toString("utf8") };
  return { sha, text: content };
}

export async function writeFile(token, filePath, content, message) {
  const sha = await existingSha(token, filePath);
  return gh(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: "PUT",
    token,
    body: {
      message,
      branch: BRANCH,
      content: toBase64(content),
      ...(sha ? { sha } : {}),
    },
  });
}

/**
 * Atomic multi-file commit via the Git Data API: either every change lands or
 * none does. Used wherever two files must change together (media bytes +
 * registry row, redirect registry + generated vercel.json).
 *
 * `files`   — [{ path, content, encoding }]; encoding defaults to "utf-8",
 *             pass "base64" for binary payloads such as uploaded images.
 * `deletes` — repository paths to remove in the same commit.
 */
export async function commitFilesAtomic(token, files, message, deletes = []) {
  // Head ref
  const headRes = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, { token });
  if (!headRes.ok) return headRes;
  const baseSha = headRes.payload.object.sha;

  const baseTreeRes = await gh(`/repos/${OWNER}/${REPO}/git/commits/${baseSha}`, { token });
  if (!baseTreeRes.ok) return baseTreeRes;
  const baseTreeSha = baseTreeRes.payload.tree.sha;

  // Build blobs + tree
  const treeItems = [];
  for (const file of files) {
    const blobRes = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: "POST",
      token,
      body: { content: file.content, encoding: file.encoding || "utf-8" },
    });
    if (!blobRes.ok) return blobRes;
    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blobRes.payload.sha,
    });
  }

  // A null sha removes the path from the tree.
  for (const path of deletes) {
    treeItems.push({ path, mode: "100644", type: "blob", sha: null });
  }

  const treeRes = await gh(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    token,
    body: { base_tree: baseTreeSha, tree: treeItems },
  });
  if (!treeRes.ok) return treeRes;

  const commitRes = await gh(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    token,
    body: {
      message,
      tree: treeRes.payload.sha,
      parents: [baseSha],
    },
  });
  if (!commitRes.ok) return commitRes;

  const refRes = await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    token,
    body: { sha: commitRes.payload.sha, force: false },
  });
  if (refRes.ok) refRes.commitSha = commitRes.payload.sha;
  return refRes;
}

export const REPO_CONTEXT = { OWNER, REPO, BRANCH };
