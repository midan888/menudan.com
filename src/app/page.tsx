import Link from "next/link";
import type { Metadata } from "next";
import { t } from "@/lib/translations";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "menudan.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const i18n = t();

export const metadata: Metadata = {
  title: `${APP_NAME} — ${i18n.meta.title}`,
  description: i18n.landing.hero.subtitle,
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    url: APP_URL,
  },
};

const featureIcons = [
  "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
  "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
  "M13 10V3L4 14h7v7l9-11h-7z",
  "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
];

const featureColors = [
  { color: "from-indigo-500 to-indigo-600", bgLight: "bg-indigo-50", textColor: "text-indigo-600" },
  { color: "from-violet-500 to-violet-600", bgLight: "bg-violet-50", textColor: "text-violet-600" },
  { color: "from-teal-500 to-teal-600", bgLight: "bg-teal-50", textColor: "text-teal-600" },
  { color: "from-purple-500 to-purple-600", bgLight: "bg-purple-50", textColor: "text-purple-600" },
  { color: "from-amber-500 to-amber-600", bgLight: "bg-amber-50", textColor: "text-amber-600" },
  { color: "from-cyan-500 to-cyan-600", bgLight: "bg-cyan-50", textColor: "text-cyan-600" },
];

const stepIcons = [
  "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
];

const plansMeta = [
  { highlighted: false, comingSoon: false, href: "/register" },
  { highlighted: true, comingSoon: true, href: "" },
  { highlighted: false, comingSoon: true, href: "" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
      logo: `${APP_URL}/apple-touch-icon.png`,
      description: i18n.meta.description,
    },
    {
      "@type": "WebApplication",
      name: APP_NAME,
      url: APP_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: i18n.landing.hero.subtitle,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function HomePage() {
  const nav = i18n.landing.nav;
  const hero = i18n.landing.hero;
  const feat = i18n.landing.features;
  const hw = i18n.landing.howItWorks;
  const pr = i18n.landing.pricing;
  const cta = i18n.landing.cta;
  const footer = i18n.landing.footer;

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-indigo-100/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-gray-900">
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </span>
          <nav className="hidden items-center gap-6 sm:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              {nav.features}
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              {nav.pricing}
            </a>
            <Link
              href="/blog"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              {nav.blog}
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              {nav.login}
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110"
            >
              {nav.getStarted}
            </Link>
          </nav>
          <div className="flex items-center gap-3 sm:hidden">
            <Link
              href="/blog"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              {nav.blog}
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              {nav.login}
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/25"
            >
              {nav.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pt-28">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-125 w-125 rounded-full bg-linear-to-br from-indigo-100 to-violet-100 opacity-50 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 h-100 w-100 rounded-full bg-linear-to-br from-teal-100 to-cyan-100 opacity-40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            {hero.badge}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {hero.titleLine1}
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              {hero.titleLine2}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 sm:w-auto"
            >
              {hero.cta}
            </Link>
            <a
              href="#how-it-works"
              className="w-full rounded-lg border border-gray-200 px-8 py-3.5 text-base font-medium text-gray-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>

          {/* Theme preview badges */}
          <div id="themes" className="mx-auto mt-16 max-w-4xl">
            <p className="mb-6 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
              {hero.themesLabel}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {/* Classic */}
              <Link href="/demo/classic" className="group relative overflow-hidden rounded-2xl border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200" style={{ backgroundColor: "#FDFBF7" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#8B4513" }} />
                    <span className="text-xs font-semibold" style={{ color: "#2C2420", fontFamily: "Georgia, serif" }}>Classic</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#e8d9c8" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#e8d9c8" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#e8d9c8" }} />
                  </div>
                  <div className="mt-3 h-0.5 w-full rounded-full" style={{ background: "linear-gradient(to right, transparent, #8B4513, transparent)" }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                  {hero.preview}
                </div>
              </Link>

              {/* Modern */}
              <Link href="/demo/modern" className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-gray-900" />
                    <span className="text-xs font-semibold text-gray-900" style={{ fontFamily: "system-ui" }}>Modern</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full bg-gray-100" />
                    <div className="h-1.5 rounded-full w-4/5 bg-gray-100" />
                    <div className="h-1.5 rounded-full w-3/5 bg-gray-100" />
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "rgba(17,24,39,0.07)" }}>
                    <div className="h-1 w-1 rounded-full bg-gray-900" />
                    <div className="h-1 w-6 rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                  {hero.preview}
                </div>
              </Link>

              {/* Dark */}
              <Link href="/demo/dark" className="group relative overflow-hidden rounded-2xl border border-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-700/40" style={{ backgroundColor: "#0A0A0A" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#C8A064" }} />
                    <span className="text-xs font-semibold" style={{ color: "#F5F5F5", fontFamily: "Georgia, serif" }}>Dark</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#1a1a1a" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#1a1a1a" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#1a1a1a" }} />
                  </div>
                  <div className="mt-3 h-1 w-1 rounded-full" style={{ backgroundColor: "#C8A064", boxShadow: "0 0 6px #C8A064" }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#C8A064", background: "rgba(0,0,0,0.7)" }}>
                  {hero.preview}
                </div>
              </Link>

              {/* Bistro */}
              <Link href="/demo/bistro" className="group relative overflow-hidden rounded-2xl border border-amber-200/60 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-300" style={{ backgroundColor: "#F5EDE3" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#B8860B" }} />
                    <span className="text-xs font-semibold italic" style={{ color: "#3D2E1E", fontFamily: "Georgia, serif" }}>Bistro</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#ddd0be" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#ddd0be" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#ddd0be" }} />
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #B8860B60)" }} />
                    <div className="text-[8px]" style={{ color: "#B8860B" }}>◆</div>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #B8860B60)" }} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-50/80">
                  {hero.preview}
                </div>
              </Link>

              {/* Nordic */}
              <Link href="/demo/nordic" className="group relative overflow-hidden rounded-2xl border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-200" style={{ backgroundColor: "#F7F5F2" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: "#2D6A4F" }} />
                    <span className="text-xs font-semibold text-gray-800" style={{ fontFamily: "system-ui", letterSpacing: "-0.01em" }}>Nordic</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#E8E5E0" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#E8E5E0" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#E8E5E0" }} />
                  </div>
                  <div className="mt-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: "#2D6A4F" }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                  {hero.preview}
                </div>
              </Link>

              {/* Neon */}
              <Link href="/demo/neon" className="group relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: "#07071A", borderColor: "#00FF9430" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#00FF94", boxShadow: "0 0 6px #00FF94" }} />
                    <span className="text-xs font-bold" style={{ color: "#00FF94", fontFamily: "system-ui", textShadow: "0 0 8px #00FF9460" }}>Neon</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#0d0d25" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#0d0d25" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#0d0d25" }} />
                  </div>
                  <div className="mt-3 h-px w-full" style={{ background: "linear-gradient(to right, transparent, #00FF9440, transparent)" }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00FF94", background: "rgba(7,7,26,0.8)" }}>
                  {hero.preview}
                </div>
              </Link>

              {/* Rustic */}
              <Link href="/demo/rustic" className="group relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-900/20" style={{ backgroundColor: "#2E1F12", borderColor: "#8B3A2A40" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#8B3A2A" }} />
                    <span className="text-xs font-bold" style={{ color: "#F2E8D9", fontFamily: "Georgia, serif" }}>Rustic</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#3d2a1a" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#3d2a1a" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#3d2a1a" }} />
                  </div>
                  <div className="mt-3 text-[10px]" style={{ color: "#8B3A2A40" }}>01  02  03</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#F2E8D9", background: "rgba(46,31,18,0.85)" }}>
                  {hero.preview}
                </div>
              </Link>

              {/* Zen */}
              <Link href="/demo/zen" className="group relative overflow-hidden rounded-2xl border border-red-100/60 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10 hover:border-red-200" style={{ backgroundColor: "#FAF7F2" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-0.5 rounded-full" style={{ backgroundColor: "#C0392B" }} />
                    <span className="text-xs font-semibold text-gray-800" style={{ fontFamily: "Georgia, serif" }}>Zen</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#EBE5DC" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#EBE5DC" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#EBE5DC" }} />
                  </div>
                  <div className="mt-3 flex gap-1">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="h-1 w-1 rounded-full" style={{ backgroundColor: "#C0392B", opacity: i % 2 === 0 ? 0.4 : 0.2, marginTop: i % 2 !== 0 ? 2 : 0 }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium text-red-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                  {hero.preview}
                </div>
              </Link>

              {/* Luxe */}
              <Link href="/demo/luxe" className="group relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10" style={{ backgroundColor: "#0C0C0C", borderColor: "#C9A84C30" }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2" style={{ backgroundColor: "#C9A84C", transform: "rotate(45deg)" }} />
                    <span className="text-xs font-normal tracking-widest uppercase" style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: 9 }}>Luxe</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#141414" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#141414" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#141414" }} />
                  </div>
                  <div className="mt-3 h-px w-full" style={{ background: "linear-gradient(to right, transparent, #C9A84C50, transparent)" }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#C9A84C", background: "rgba(12,12,12,0.85)" }}>
                  {hero.preview}
                </div>
              </Link>

              {/* Vibra */}
              <Link href="/demo/vibra" className="group relative overflow-hidden rounded-2xl border border-orange-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/15 hover:border-orange-300" style={{ backgroundColor: "#FFFAF5" }}>
                <div className="p-4">
                  <div className="h-5 rounded-md mb-3" style={{ background: "linear-gradient(135deg, #FF4D2E, #FF8C00)" }} />
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: "#F0EBE3" }} />
                    <div className="h-1.5 rounded-full w-4/5" style={{ backgroundColor: "#F0EBE3" }} />
                    <div className="h-1.5 rounded-full w-3/5" style={{ backgroundColor: "#F0EBE3" }} />
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ background: "#FF4D2E" }}>
                    &#9632; Vibra
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-2 text-center text-[10px] font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-50/80">
                  {hero.preview}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-indigo-100/50 bg-linear-to-b from-slate-50 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {hw.label}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {hw.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {hw.subtitle}
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {i18n.landing.steps.map((s, i) => (
              <div key={i} className="relative text-center">
                {/* Connector line */}
                {i < i18n.landing.steps.length - 1 && (
                  <div className="absolute left-[calc(50%+32px)] top-6 hidden h-0.5 w-[calc(100%-64px)] bg-linear-to-r from-indigo-300 to-violet-300 sm:block" />
                )}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-md shadow-indigo-500/25">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {feat.label}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {feat.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {feat.subtitle}
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feat.items.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br ${featureColors[idx].color} shadow-sm`}>
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={featureIcons[idx]}
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative border-t border-gray-100 py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-150 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-50 to-violet-50 opacity-60 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {pr.label}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {pr.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {pr.subtitle}
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {pr.plans.map((plan, idx) => {
              const meta = plansMeta[idx];
              return (
              <div
                key={idx}
                className={`relative rounded-2xl border-2 bg-white p-8 transition-shadow ${
                  meta.highlighted
                    ? "border-indigo-600 shadow-xl shadow-indigo-500/10"
                    : "border-gray-200 hover:shadow-lg"
                }`}
              >
                {meta.comingSoon && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-medium text-white shadow-md shadow-amber-500/25">
                    {pr.comingSoon}
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-gray-600"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-teal-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {meta.comingSoon ? (
                  <span
                    className="mt-8 block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-3 text-center text-sm font-medium text-gray-400"
                  >
                    {plan.cta}
                  </span>
                ) : (
                  <Link
                    href={meta.href}
                    className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-medium transition-all ${
                      meta.highlighted
                        ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110"
                        : "border border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            {pr.allPlansInclude}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-16 shadow-2xl shadow-indigo-500/25 sm:px-16">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
                {cta.subtitle.replace('{appName}', APP_NAME)}
              </p>
              <Link
                href="/register"
                className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-base font-medium text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
              >
                {cta.button}
              </Link>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm font-bold">
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/blog" className="hover:text-gray-700">
                {footer.blog}
              </Link>
              <Link href="/privacy" className="hover:text-gray-700">
                {footer.privacy}
              </Link>
              <span>&copy; {new Date().getFullYear()} {APP_NAME}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
