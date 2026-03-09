import type { BlogArticle } from "../_data/articles";
import { articles } from "../_data/articles";
import { BlogCard } from "./BlogCard";
import { t } from "@/lib/translations";

const i18n = t();

export function RelatedArticles({ current }: { current: BlogArticle }) {
  const related = articles
    .filter(
      (a) => a.slug !== current.slug && a.category === current.category
    )
    .slice(0, 2);

  // If not enough from same category, fill from other categories
  if (related.length < 2) {
    const remaining = articles
      .filter(
        (a) =>
          a.slug !== current.slug &&
          !related.some((r) => r.slug === a.slug)
      )
      .slice(0, 2 - related.length);
    related.push(...remaining);
  }

  if (related.length === 0) return null;

  return (
    <section className="border-t border-gray-100 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {i18n.blog.continueReading}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {related.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
