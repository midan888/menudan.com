import Image from "next/image";
import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";
import { TappableImage } from "@/components/menu/ImageLightbox";

export function NordicTheme({
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

  const accent = tenant.accentColor || "#2D6A4F";

  return (
    <div className="nordic-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="nordic-theme"
    >
      <style>{`
        .nordic-theme-bg {
          background: #F7F5F2;
          min-height: 100vh;
        }
        .nordic-theme {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #F7F5F2;
          color: #1A1A1A;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 64px;
        }
        .nordic-theme h1, .nordic-theme h2, .nordic-theme h3 {
          font-family: 'Syne', system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        .nordic-header-line {
          width: 32px;
          height: 3px;
          background: var(--accent);
          margin: 12px 0 0 0;
        }
        .nordic-item {
          display: flex;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid #EBEBEB;
        }
        .nordic-item:last-child {
          border-bottom: none;
        }
        .nordic-price {
          font-family: 'Syne', system-ui, sans-serif;
          font-weight: 700;
          color: var(--accent);
          font-size: 15px;
          white-space: nowrap;
        }
        .nordic-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 2px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: color-mix(in srgb, var(--accent) 10%, #F7F5F2);
          color: color-mix(in srgb, var(--accent) 90%, #1A1A1A);
        }
        .nordic-category-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .nordic-nav-tab {
          padding: 8px 0;
          font-size: 14px;
          font-weight: 500;
          color: #888;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nordic-nav-tab.active {
          color: #1A1A1A;
          border-bottom-color: var(--accent);
        }
      `}</style>

      {/* Cover image */}
      {tenant.coverImageUrl && (
        <div className="relative h-48 overflow-hidden">
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
            style={{ background: "linear-gradient(to top, #F7F5F2 0%, rgba(247,245,242,0.3) 100%)" }}
          />
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        {tenant.logoUrl && (
          <div className="mb-5 h-14 w-14 overflow-hidden rounded-sm" style={{ outline: `2px solid ${accent}20` }}>
            <Image
              src={tenant.logoUrl}
              alt={tenant.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold">{tenant.name}</h1>
        <div className="nordic-header-line" />
        {tenant.description && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">{tenant.description}</p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-2 text-xs text-gray-400">
            {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex gap-6 overflow-x-auto px-6 pb-2 border-b border-gray-200">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className={`nordic-nav-tab ${menu.id === activeMenu?.id ? "active" : ""}`}
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="px-6 pt-6">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-10">
              <div className="nordic-category-label">
                {t(translations, "category", category.id, "name", category.name, currentLanguage)}
              </div>
              {category.description && (
                <p className="mb-4 text-sm text-gray-400">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div>
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="nordic-item">
                      {item.imageUrl && (
                        <TappableImage
                          src={item.imageUrl}
                          alt={item.name}
                          width={72}
                          height={72}
                          className="h-18 w-18 shrink-0 rounded-sm object-cover"
                          style={{ width: 72, height: 72 }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold leading-snug">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          <span className="nordic-price">{formatPrices(item)}</span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                            {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                          </p>
                        )}
                        {badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {badges.map((badge) => (
                              <span key={badge} className="nordic-badge">
                                {badge.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
    </div>
  );
}
