import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev";

const features = [
  {
    title: "AI Menu Extraction",
    description:
      "Snap a photo of your paper menu — our AI reads it and creates your digital menu automatically.",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "4 Beautiful Themes",
    description:
      "Classic, Modern, Dark, or Bistro — pick a vibe that matches your restaurant. No design skills needed.",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    color: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    title: "Instant QR Codes",
    description:
      "Download print-ready QR codes in PNG or SVG. Place them on tables and your guests are one scan away.",
    icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
    color: "from-teal-500 to-teal-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    title: "Multi-Language",
    description:
      "AI-powered translation into 16 languages. Your international guests read the menu in their own language.",
    icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
    color: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    title: "Real-Time Updates",
    description:
      "86 an item or change prices instantly. Your digital menu updates in real time — no reprinting.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    title: "Custom Domains",
    description:
      "Use your own domain like menu.yourrestaurant.com with automatic HTTPS. Looks professional, loads fast.",
    icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
    color: "from-cyan-500 to-cyan-600",
    bgLight: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying it out",
    features: [
      "1 menu",
      "20 item images",
      "1 AI upload",
      "All 4 themes",
      "QR code download",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For growing restaurants",
    features: [
      "5 menus",
      "200 item images",
      "Unlimited AI uploads",
      "Custom domain",
      "No watermark",
    ],
    cta: "Start with Pro",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$19",
    period: "/month",
    description: "For multi-menu establishments",
    features: [
      "Unlimited menus",
      "Unlimited images",
      "Unlimited AI uploads",
      "Custom domain",
      "Priority support",
    ],
    cta: "Go Business",
    href: "/register",
    highlighted: false,
  },
];

const steps = [
  {
    step: "1",
    title: "Upload your menu",
    description: "Take a photo of your paper menu or enter items manually.",
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    step: "2",
    title: "Pick a theme",
    description: "Choose from 4 beautiful designs that match your restaurant.",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    step: "3",
    title: "Share your QR code",
    description: "Download, print, and place on tables. You're live!",
    icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-indigo-100/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </h1>
          <nav className="hidden items-center gap-6 sm:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110"
            >
              Get Started
            </Link>
          </nav>
          <div className="flex items-center gap-3 sm:hidden">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

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
            No credit card required
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Your restaurant menu,
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              online in 5 minutes
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Upload a photo of your paper menu — AI extracts items automatically.
            Choose a beautiful theme, get a QR code, and you&apos;re live. No
            technical skills required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 sm:w-auto"
            >
              Create Your Menu — Free
            </Link>
            <a
              href="#how-it-works"
              className="w-full rounded-lg border border-gray-200 px-8 py-3.5 text-base font-medium text-gray-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
            >
              See How It Works
            </a>
          </div>

          {/* Theme preview mockup */}
          <div id="themes" className="mx-auto mt-16 max-w-3xl">
            <p className="mb-3 text-center text-sm text-gray-500">Click a theme to preview</p>
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-gray-100 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
                <div className="ml-4 h-4 w-48 rounded bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-0 sm:grid-cols-4">
                {/* Classic theme preview */}
                <Link href="/demo/classic" className="block border-r border-b border-gray-100 p-4 transition-all hover:bg-indigo-50/50 hover:scale-[1.02] sm:border-b-0">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FDFBF7" }}
                  >
                    <div className="text-center">
                      <div className="text-[10px] font-bold" style={{ fontFamily: "serif", color: "#2C2420" }}>Classic</div>
                      <div className="mx-auto mt-2 h-1 w-6 rounded" style={{ backgroundColor: "#8B4513" }} />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1 rounded bg-gray-200" />
                        <div className="mx-auto h-1 w-3/4 rounded bg-gray-200" />
                        <div className="h-1 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Modern theme preview */}
                <Link href="/demo/modern" className="block border-b border-gray-100 p-4 transition-all hover:bg-indigo-50/50 hover:scale-[1.02] sm:border-r sm:border-b-0">
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-900">Modern</div>
                      <div className="mx-auto mt-2 h-1 w-6 rounded bg-gray-900" />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1 rounded bg-gray-100" />
                        <div className="mx-auto h-1 w-3/4 rounded bg-gray-100" />
                        <div className="h-1 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Dark theme preview */}
                <Link href="/demo/dark" className="block border-r border-gray-100 p-4 transition-all hover:bg-indigo-50/50 hover:scale-[1.02]">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#0A0A0A" }}
                  >
                    <div className="text-center">
                      <div className="text-[10px] font-bold" style={{ color: "#F5F5F5" }}>Dark</div>
                      <div className="mx-auto mt-2 h-1 w-6 rounded" style={{ backgroundColor: "#C8A064" }} />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1 rounded" style={{ backgroundColor: "#1a1a1a" }} />
                        <div className="mx-auto h-1 w-3/4 rounded" style={{ backgroundColor: "#1a1a1a" }} />
                        <div className="h-1 rounded" style={{ backgroundColor: "#1a1a1a" }} />
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Bistro theme preview */}
                <Link href="/demo/bistro" className="block p-4 transition-all hover:bg-indigo-50/50 hover:scale-[1.02]">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#F5EDE3" }}
                  >
                    <div className="text-center">
                      <div className="text-[10px] font-bold italic" style={{ fontFamily: "serif", color: "#3D2E1E" }}>Bistro</div>
                      <div className="mx-auto mt-2 h-1 w-6 rounded" style={{ backgroundColor: "#B8860B" }} />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1 rounded" style={{ backgroundColor: "#e8ddd0" }} />
                        <div className="mx-auto h-1 w-3/4 rounded" style={{ backgroundColor: "#e8ddd0" }} />
                        <div className="h-1 rounded" style={{ backgroundColor: "#e8ddd0" }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-indigo-100/50 bg-linear-to-b from-slate-50 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Simple setup
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Three steps to go digital
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From paper menu to QR code in minutes, not weeks.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+32px)] top-6 hidden h-0.5 w-[calc(100%-64px)] bg-linear-to-r from-indigo-300 to-violet-300 sm:block" />
                )}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-md shadow-indigo-500/25">
                  {s.step}
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
              Features
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to go paperless
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features, simple interface. Built for restaurant owners.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br ${feature.color} shadow-sm`}>
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={feature.icon}
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
              Pricing
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 bg-white p-8 transition-shadow ${
                  plan.highlighted
                    ? "border-indigo-600 shadow-xl shadow-indigo-500/10"
                    : "border-gray-200 hover:shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-1 text-xs font-medium text-white shadow-md shadow-indigo-500/25">
                    Most Popular
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
                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-medium transition-all ${
                    plan.highlighted
                      ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110"
                      : "border border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            All plans include all 4 themes, QR code generation, multi-language
            support, and real-time updates.
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
                Ready to ditch the paper menu?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
                Join restaurants worldwide that use {APP_NAME} to create
                beautiful digital menus their guests love.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-base font-medium text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
              >
                Create Your Menu — Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm font-bold">
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
