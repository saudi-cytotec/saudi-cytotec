import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Seo } from "../components/Seo";
import { loginRequest, logoutRequest, sessionCheck } from "./api";
import { ArticlesScreen } from "./screens/ArticlesScreen";
import { CategoriesScreen } from "./screens/CategoriesScreen";
import { EditorScreen } from "./screens/EditorScreen";
import { GeneratorScreen } from "./screens/GeneratorScreen";
import { IndexabilityScreen } from "./screens/IndexabilityScreen";
import { LinksScreen } from "./screens/LinksScreen";
import { MapScreen } from "./screens/MapScreen";
import { MediaScreen } from "./screens/MediaScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";
import { Overview } from "./screens/Overview";
import { RedirectsScreen } from "./screens/RedirectsScreen";
import { ReferencesScreen } from "./screens/ReferencesScreen";
import { SeoScreen } from "./screens/SeoScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { SitemapScreen } from "./screens/SitemapScreen";
import { PreviewScreen } from "./screens/PreviewScreen";
import { inputClass } from "./ui";

const nav = [
  { to: "/admin", label: "لوحة القيادة", end: true },
  { to: "/admin/articles", label: "المقالات" },
  { to: "/admin/articles/new", label: "مقال جديد" },
  { to: "/admin/drafts", label: "المسودات" },
  { to: "/admin/scheduled", label: "المجدولة" },
  { to: "/admin/published", label: "المنشور" },
  { to: "/admin/categories", label: "التصنيفات" },
  { to: "/admin/map", label: "خريطة المحتوى" },
  { to: "/admin/seo", label: "SEO" },
  { to: "/admin/links", label: "الروابط الداخلية" },
  { to: "/admin/references", label: "المراجع" },
  { to: "/admin/media", label: "الوسائط" },
  { to: "/admin/generate", label: "مولّد المحتوى" },
  { to: "/admin/redirects", label: "إعادة التوجيه" },
  { to: "/admin/notfound", label: "مراقب 404" },
  { to: "/admin/sitemap", label: "خريطة الموقع" },
  { to: "/admin/indexability", label: "الفهرسة" },
  { to: "/admin/settings", label: "الإعدادات" },
];

export function AdminApp() {
  const [auth, setAuth] = useState<"loading" | "in" | "out">("loading");
  const [user, setUser] = useState("");

  useEffect(() => {
    sessionCheck()
      .then((res) => {
        setAuth(res.ok && res.data.authenticated ? "in" : "out");
        setUser(res.data.user ?? "");
      })
      .catch(() => setAuth("out"));
  }, []);

  if (auth === "loading") {
    return <div className="grid min-h-screen place-items-center bg-cream text-brand-deep">جاري التحقق من الجلسة...</div>;
  }
  if (auth === "out") {
    return (
      <LoginScreen
        onSuccess={(name) => {
          setUser(name);
          setAuth("in");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink" dir="rtl">
      <Seo title="لوحة التحرير" description="لوحة إدارة المحتوى الطبي التعليمي" path="/admin" noindex />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-l border-line bg-brand-deep text-white">
          <div className="px-5 py-6">
            <p className="text-xs text-sand">منصة النشر الطبي التعليمي</p>
            <strong className="mt-1 block text-lg">SAUDIERSAA · التحرير</strong>
            <p className="mt-1 text-xs text-sand">Cytotec في السعودية — محتوى تعليمي فقط</p>
          </div>
          <nav className="grid gap-1 overflow-y-auto px-3 pb-8" style={{ maxHeight: "calc(100vh - 130px)" }}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm ${isActive ? "bg-white/15 text-white" : "text-sand hover:bg-white/10"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div>
          <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-4">
            <div>
              <p className="text-sm text-ink-soft">مرحباً {user || "المحرر"}</p>
              <p className="text-xs text-ink-soft">النشر: Git → Vercel → Production · التحذيرات لا تمنع النشر، الأخطاء التقنية فقط تمنعه</p>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="rounded-full border border-line px-3 py-1.5 text-sm">
                الموقع العام
              </Link>
              <button
                type="button"
                className="rounded-full bg-accent px-3 py-1.5 text-sm text-white"
                onClick={async () => {
                  await logoutRequest();
                  setAuth("out");
                }}
              >
                خروج
              </button>
            </div>
          </header>
          <div className="p-6">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="articles" element={<ArticlesScreen filter="all" />} />
              <Route path="articles/new" element={<EditorScreen mode="create" />} />
              <Route path="articles/:id" element={<EditorScreen mode="edit" />} />
              <Route path="preview/:id" element={<PreviewScreen />} />
              <Route path="drafts" element={<ArticlesScreen filter="draft" />} />
              <Route path="review" element={<ArticlesScreen filter="review" />} />
              <Route path="scheduled" element={<ArticlesScreen filter="scheduled" />} />
              <Route path="published" element={<ArticlesScreen filter="published" />} />
              <Route path="categories" element={<CategoriesScreen />} />
              <Route path="map" element={<MapScreen />} />
              <Route path="seo" element={<SeoScreen />} />
              <Route path="links" element={<LinksScreen />} />
              <Route path="references" element={<ReferencesScreen />} />
              <Route path="media" element={<MediaScreen />} />
              <Route path="generate" element={<GeneratorScreen />} />
              <Route path="redirects" element={<RedirectsScreen />} />
              <Route path="notfound" element={<NotFoundScreen />} />
              <Route path="sitemap" element={<SitemapScreen />} />
              <Route path="indexability" element={<IndexabilityScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4" dir="rtl">
      <Seo title="دخول التحرير" description="دخول لوحة التحرير" path="/admin" noindex />
      <form
        className="w-full max-w-md rounded-[2rem] border border-line bg-paper p-8 shadow-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const res = await loginRequest(username, password);
            if (res.ok && res.data.authenticated) {
              onSuccess(username);
              return;
            }
            setError(res.data.error || "تعذر تسجيل الدخول.");
          } catch {
            setError("تعذر الاتصال بواجهة المصادقة.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm font-semibold text-brand">لوحة تحرير محمية</p>
        <h1 className="mt-2 text-3xl font-bold text-brand-deep">دخول المشرف</h1>
        <p className="mt-2 text-xs leading-6 text-ink-soft">
          الجلسة كوكي HttpOnly موقّع لمدة 12 ساعة. بدون ADMIN_PASSWORD وADMIN_SESSION_SECRET في بيئة Vercel يبقى الدخول متوقفاً.
        </p>
        <label className="mt-6 block text-sm font-semibold">
          اسم المستخدم
          <input value={username} onChange={(e) => setUsername(e.target.value)} className={`${inputClass()} mt-1`} />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          كلمة المرور
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass()} mt-1`} />
        </label>
        {error ? <p className="mt-4 rounded-2xl bg-accent-soft px-3 py-2 text-sm text-clay">{error}</p> : null}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-brand py-2.5 text-white disabled:opacity-60">
          {busy ? "جاري التحقق..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
