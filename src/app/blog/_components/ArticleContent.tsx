import type { ArticleSection } from "../_data/articles";
import { CallToAction } from "./CallToAction";

export function ArticleContent({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section, i) => {
        switch (section.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="text-base leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: section.content! }}
              />
            );
          case "heading2":
            return (
              <h2
                key={i}
                className="mt-10 mb-4 text-2xl font-bold text-gray-900"
                dangerouslySetInnerHTML={{ __html: section.content! }}
              />
            );
          case "heading3":
            return (
              <h3
                key={i}
                className="mt-8 mb-3 text-xl font-semibold text-gray-900"
                dangerouslySetInnerHTML={{ __html: section.content! }}
              />
            );
          case "list":
            return (
              <ul
                key={i}
                className="list-disc space-y-2 pl-5 text-base text-gray-700"
              >
                {section.items?.map((item, j) => (
                  <li
                    key={j}
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </ul>
            );
          case "blockquote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-indigo-500 pl-4 italic text-gray-600"
                dangerouslySetInnerHTML={{ __html: section.content! }}
              />
            );
          case "cta":
            return (
              <CallToAction
                key={i}
                text={section.ctaText!}
                href={section.ctaHref!}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
