import Image from "next/image";
import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";
import { TappableImage } from "@/components/menu/ImageLightbox";

export function ZenTheme({
  tenant,
  menus,
  categories,
  items,
  translations,
  currentLanguage,
  currentMenuId,
}: ThemeProps) {
  const activeMenu = menus.find((m) => m.id === currentMenuId) || menus[0];
  const menuCategories = categories
    .filter((c) => c.menuId === activeMenu?.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const getItems = (categoryId: string) =>
    items
      .filter((i) => i.categoryId === categoryId && i.isAvailable)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  const accent = tenant.accentColor || "#C0392B";

  return (
    <div className="zen-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="zen-theme"
    >
      <style>{`
        .zen-theme-bg {
          background: #F5F0EB;
          min-height: 100vh;
        }
        .zen-theme {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: linear-gradient(180deg, #FAF7F2 0%, #F5F0EB 100%);
          color: #1C1C1C;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 64px;
          position: relative;
        }
        .zen-theme h1, .zen-theme h2 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .zen-accent-bar {
          width: 3px;
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          flex-shrink: 0;
        }
        .zen-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(28,28,28,0.07);
        }
        .zen-item:last-child {
          border-bottom: none;
        }
        .zen-item-with-image {
          grid-template-columns: 1fr auto;
        }
        .zen-price {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--accent);
          white-space: nowrap;
          align-self: flex-start;
        }
        .zen-category-section {
          margin-bottom: 32px;
        }
        .zen-category-header {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 4px;
        }
        .zen-seal {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--accent);
          flex-shrink: 0;
        }
        .zen-badge {
          display: inline-block;
          padding: 1px 7px;
          border-radius: 2px;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: color-mix(in srgb, var(--accent) 90%, #1C1C1C);
          border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
        }
        .zen-rule {
          width: 48px;
          height: 2px;
          background: var(--accent);
          margin: 8px 0 0 0;
        }
        .zen-wave {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding: 12px 0;
          opacity: 0.3;
        }
        .zen-wave span {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
        }
        .zen-wave span:nth-child(2) {
          margin-top: 4px;
        }
        .zen-wave span:nth-child(4) {
          margin-top: 4px;
        }
      `}</style>

      {/* Top accent line */}
      <div className="h-1" style={{ background: accent }} />

      {/* Cover image */}
      {tenant.coverImageUrl && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={tenant.coverImageUrl}
            alt={`${tenant.name} cover`}
            fill
            sizes="480px"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #FAF7F2 5%, rgba(250,247,242,0.5) 50%, transparent 100%)" }}
          />
        </div>
      )}

      {/* Header */}
      <header className="px-7 pt-8 pb-5">
        <div className="flex items-center gap-4">
          {tenant.logoUrl && (
            <Image
              src={tenant.logoUrl}
              alt={tenant.name}
              width={56}
              height={56}
              className="shrink-0 rounded-full object-cover"
              style={{ border: `2px solid ${accent}30` }}
            />
          )}
          <div>
            <h1 className="text-2xl font-bold leading-tight">{tenant.name}</h1>
            <div className="zen-rule" />
            {tenant.description && (
              <p className="mt-2 text-sm text-gray-500">{tenant.description}</p>
            )}
            {(tenant.address || tenant.phone) && (
              <p className="mt-1 text-xs text-gray-400">
                {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex overflow-x-auto gap-1 px-7 pb-4">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="whitespace-nowrap px-4 py-2 text-sm transition-all rounded"
              style={
                menu.id === activeMenu?.id
                  ? { background: accent, color: "white", fontWeight: 600 }
                  : { color: "#888", background: "rgba(0,0,0,0.04)" }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="px-7">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="zen-category-section">
              <div className="zen-category-header">
                <div className="zen-accent-bar" />
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--accent)" }}>
                    {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-400 mt-0.5">
                      {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                    </p>
                  )}
                </div>
              </div>

              <div className="zen-wave" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>

              <div>
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="zen-item">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <TappableImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={68}
                            height={68}
                            className="shrink-0 rounded-sm object-cover"
                            style={{ width: 68, height: 68, border: "1px solid rgba(0,0,0,0.06)" }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium leading-snug">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span key={badge} className="zen-badge">
                                  {badge.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="zen-price">{formatPrices(item)}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Bottom seal */}
      <div className="flex justify-center pb-4">
        <div className="zen-seal" aria-hidden="true">&#10021;</div>
      </div>
    </div>
    </div>
  );
}
