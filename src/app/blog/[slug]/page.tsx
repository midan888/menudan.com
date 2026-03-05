import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "../_data/articles";
import { BlogHeader } from "../_components/BlogHeader";
import { BlogFooter } from "../_components/BlogFooter";
import { ArticleContent } from "../_components/ArticleContent";
import { RelatedArticles } from "../_components/RelatedArticles";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `${APP_URL}/blog/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `${APP_URL}/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const categoryColors: Record<string, string> = {
    Technology: "bg-indigo-50 text-indigo-600",
    "Menu Design": "bg-violet-50 text-violet-600",
    Industry: "bg-teal-50 text-teal-600",
    Operations: "bg-purple-50 text-purple-600",
    Marketing: "bg-amber-50 text-amber-600",
  };
  const colorClass =
    categoryColors[article.category] || "bg-gray-50 text-gray-600";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    author: {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${APP_URL}/blog/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${APP_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <BlogHeader />

      <main>
        <article className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
              <Link href="/blog" className="hover:text-indigo-600 transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-600 truncate">{article.title}</span>
            </nav>

            {/* Header */}
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
            >
              {article.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {article.title}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
              <span>{article.author}</span>
              <span>&middot;</span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span>&middot;</span>
              <span>{article.readingTimeMinutes} min read</span>
            </div>

            {/* Content */}
            <div className="mt-8 border-t border-gray-100 pt-8">
              <ArticleContent sections={article.sections} />
            </div>
          </div>
        </article>

        {/* Related articles */}
        <RelatedArticles current={article} />

        {/* Final CTA */}
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-14 shadow-2xl shadow-indigo-500/25 sm:px-16">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
              </div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Ready to create your digital menu?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-base text-indigo-100">
                  Upload a photo of your menu, pick a theme, and get a QR code
                  — all in under 5 minutes. Free to start.
                </p>
                <Link
                  href="/register"
                  className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-base font-medium text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <BlogFooter />
    </div>
  );
}
