import Link from "next/link";
import type { BlogArticle } from "../_data/articles";

const categoryColors: Record<string, string> = {
  Technology: "bg-indigo-50 text-indigo-600",
  "Menu Design": "bg-violet-50 text-violet-600",
  Industry: "bg-teal-50 text-teal-600",
  Operations: "bg-purple-50 text-purple-600",
  Marketing: "bg-amber-50 text-amber-600",
};

export function BlogCard({ article }: { article: BlogArticle }) {
  const colorClass = categoryColors[article.category] || "bg-gray-50 text-gray-600";

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5"
    >
      <span
        className={`inline-block self-start rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
      >
        {article.category}
      </span>
      <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
        {article.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
        {article.excerpt}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-gray-400">
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <span>&middot;</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>
    </Link>
  );
}
