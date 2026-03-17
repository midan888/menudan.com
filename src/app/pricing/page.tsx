import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { PublicHeader } from "@/components/ui/PublicHeader";
import { t } from "@/lib/translations";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "menudan.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const i18n = t();

const pg = i18n.pricingPage;
const pr = i18n.landing.pricing;

export const metadata: Metadata = {
  title: `${pg.metaTitle} | ${APP_NAME}`,
  description: pg.metaDescription,
  alternates: { canonical: `${APP_URL}/pricing` },
  openGraph: {
    title: pg.metaTitle,
    description: pg.metaDescription,
    url: `${APP_URL}/pricing`,
  },
};

const plansMeta = [
  { highlighted: true, comingSoon: false, href: "/register" },
  { highlighted: false, comingSoon: true, href: "" },
  { highlighted: false, comingSoon: true, href: "" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pg.metaTitle,
  description: pg.metaDescription,
  url: `${APP_URL}/pricing`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: pg.breadcrumbHome, item: APP_URL },
      { "@type": "ListItem", position: 2, name: pr.label, item: `${APP_URL}/pricing` },
    ],
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-16 sm:pt-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-125 w-125 rounded-full bg-linear-to-br from-indigo-100 to-violet-100 opacity-50 blur-3xl" />
            <div className="absolute -bottom-20 -left-40 h-100 w-100 rounded-full bg-linear-to-br from-teal-100 to-cyan-100 opacity-40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700">
              {pg.badge}
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {pg.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {pg.subtitle}
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="relative pb-20">
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid gap-6 sm:grid-cols-3">
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
                        {pg.comingSoon}
                      </span>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {plan.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {plan.description}
                      </p>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          {plan.period}
                        </span>
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
                      <span className="mt-8 block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-3 text-center text-sm font-medium text-gray-400">
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
              {pg.allPlansInclude}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-gray-100 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              {pg.faq.title}
            </h2>
            <div className="mt-12 space-y-6">
              {pg.faq.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-16 shadow-2xl shadow-indigo-500/25 sm:px-16">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  {pg.cta.title}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
                  {pg.cta.subtitle}
                </p>
                <Link
                  href="/register"
                  className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-base font-medium text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
                >
                  {pg.cta.button}
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
            <Logo href="/" size="sm" />
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <Link href="/features" className="hover:text-gray-700">{i18n.landing.nav.features}</Link>
              <Link href="/pricing" className="hover:text-gray-700">{i18n.landing.nav.pricing}</Link>
              <Link href="/themes" className="hover:text-gray-700">{i18n.landing.footer.themes}</Link>
              <Link href="/blog" className="hover:text-gray-700">{i18n.landing.footer.blog}</Link>
              <Link href="/about" className="hover:text-gray-700">{i18n.landing.footer.about}</Link>
              <Link href="/contact" className="hover:text-gray-700">{i18n.landing.footer.contact}</Link>
              <Link href="/privacy" className="hover:text-gray-700">{i18n.landing.footer.privacy}</Link>
              <Link href="/terms" className="hover:text-gray-700">{i18n.landing.footer.terms}</Link>
              <span>&copy; {new Date().getFullYear()} {APP_NAME}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
