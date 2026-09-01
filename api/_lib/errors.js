/**
 * Shared, specific failure reporting for the Git-backed CMS endpoints.
 *
 * The CMS must tell the administrator WHAT actually failed instead of a vague
 * "تعذر النشر". Every branch below maps a real condition to a stable machine
 * code, an Arabic explanation and a concrete remedy.
 *
 * Nothing here ever includes the token, its length, or any secret material —
 * only the HTTP status and GitHub's own public error message (truncated).
 */

/** Missing GITHUB_PUBLISH_TOKEN — the single most common production blocker. */
export function tokenMissingResponse(action = "النشر") {
  return {
    status: 503,
    body: {
      code: "PUBLISH_TOKEN_MISSING",
      error: `${action} إلى المستودع غير مُفعّل: مفتاح الكتابة GITHUB_PUBLISH_TOKEN غير موجود في بيئة التشغيل.`,
      remedy:
        "أضيفي متغير البيئة GITHUB_PUBLISH_TOKEN (Fine-grained PAT بصلاحية Contents: Read and write على مستودع saudi-cytotec/saudi-cytotec) في إعدادات Vercel ثم أعيدي النشر.",
      configured: false,
    },
  };
}

/**
 * Translate a failed GitHub API result into a precise, actionable error.
 * `result` is the { ok, status, payload } shape returned by gh().
 */
export function classifyGitHubFailure(result) {
  const status = result?.status ?? 0;
  const detail =
    result?.payload && typeof result.payload.message === "string"
      ? String(result.payload.message).slice(0, 200)
      : "";

  if (status === 0 || status >= 520) {
    return {
      status: 504,
      body: {
        code: "NETWORK_FAILURE",
        error: "تعذر الوصول إلى GitHub (فشل شبكة أو انقطاع مؤقت).",
        remedy: "تحققي من الاتصال ثم أعيدي المحاولة. لم يُفقد أي تعديل.",
        detail,
      },
    };
  }

  if (status === 401) {
    return {
      status: 502,
      body: {
        code: "GITHUB_AUTH_FAILED",
        error: "فشل التوثيق مع GitHub: المفتاح GITHUB_PUBLISH_TOKEN غير صالح أو منتهي الصلاحية.",
        remedy: "أنشئي مفتاحاً جديداً (Fine-grained PAT) وحدّثي متغير البيئة في Vercel.",
        detail,
      },
    };
  }

  if (status === 403) {
    const rateLimited = /rate limit|abuse|secondary/i.test(detail);
    return {
      status: 502,
      body: rateLimited
        ? {
            code: "GITHUB_RATE_LIMITED",
            error: "رفض GitHub الطلب مؤقتاً بسبب تجاوز حد المعدل (rate limit).",
            remedy: "انتظري دقيقة ثم أعيدي المحاولة.",
            detail,
          }
        : {
            code: "GITHUB_PERMISSION_DENIED",
            error:
              "رفض GitHub الكتابة: صلاحيات المفتاح غير كافية للكتابة في المستودع (مطلوب Contents: Read and write).",
            remedy:
              "افتحي إعدادات المفتاح على GitHub وامنحيه صلاحية Contents: Read and write على مستودع saudi-cytotec/saudi-cytotec.",
            detail,
          },
    };
  }

  if (status === 404) {
    return {
      status: 502,
      body: {
        code: "REPO_OR_BRANCH_NOT_FOUND",
        error: "لم يعثر GitHub على المستودع أو الفرع المستهدف (أو أن المفتاح لا يرى المستودع).",
        remedy: "تأكدي من أن المفتاح يشمل مستودع saudi-cytotec/saudi-cytotec وأن الفرع main موجود.",
        detail,
      },
    };
  }

  if (status === 409) {
    return {
      status: 409,
      body: {
        code: "WRITE_CONFLICT",
        error: "تعارض في الكتابة: تغيّر الملف على المستودع أثناء الحفظ.",
        remedy: "أعيدي المحاولة — سيُقرأ الإصدار الأحدث تلقائياً.",
        detail,
      },
    };
  }

  if (status === 422) {
    return {
      status: 502,
      body: {
        code: "REPOSITORY_WRITE_REJECTED",
        error: "رفض المستودع الكتابة (بيانات غير صالحة أو حماية على الفرع).",
        remedy: "تحققي من قواعد حماية الفرع main، أو من صحة اسم الملف.",
        detail,
      },
    };
  }

  return {
    status: 502,
    body: {
      code: "GITHUB_API_ERROR",
      error: `فشل طلب GitHub (HTTP ${status}).`,
      remedy: "أعيدي المحاولة؛ إن تكرر الفشل راجعي حالة GitHub.",
      detail,
    },
  };
}
