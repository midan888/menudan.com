import type { Metadata } from "next";
import { articles } from "./_data/articles";
import { BlogHeader } from "./_components/BlogHeader";
import { BlogFooter } from "./_components/BlogFooter";
import { BlogCard } from "./_components/BlogCard";
import { t } from "@/lib/translations";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const i18n = t();

export const metadata: Metadata = {
  title: i18n.blog.title,
  description: i18n.blog.metaDescription,
  alternates: { canonical: `${APP_URL}/blog` },
  openGraph: {
    title: i18n.blog.heading,
    description: i18n.blog.metaDescription,
    url: `${APP_URL}/blog`,
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-gray-100 pb-16 pt-16 sm:pt-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-100 w-100 rounded-full bg-linear-to-br from-indigo-100 to-violet-100 opacity-40 blur-3xl" />
            <div className="absolute -bottom-20 -left-40 h-80 w-80 rounded-full bg-linear-to-br from-teal-100 to-cyan-100 opacity-30 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {i18n.blog.title}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {i18n.blog.subtitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
              {i18n.blog.description}
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <BlogCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: i18n.blog.heading,
            description: i18n.blog.metaDescription,
            url: `${APP_URL}/blog`,
          }),
        }}
      />

      <BlogFooter />
    </div>
  );
}
