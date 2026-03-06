import Image from "next/image";
import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";
import { TappableDiv } from "@/components/menu/ImageLightbox";

export function VibraTheme({
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

  const accent = tenant.accentColor || "#FF4D2E";

  return (
    <div className="vibra-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="vibra-theme"
    >
      <style>{`
        .vibra-theme-bg {
          background: #FFFAF5;
          min-height: 100vh;
        }
        .vibra-theme {
          font-family: 'Outfit', system-ui, sans-serif;
          background: #FFFAF5;
          color: #111111;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 64px;
          position: relative;
        }
        .vibra-theme h1, .vibra-theme h2, .vibra-theme h3 {
          font-family: 'Syne', system-ui, sans-serif;
        }
        .vibra-hero {
          background: var(--accent);
          position: relative;
          overflow: hidden;
        }
        .vibra-hero::before {
          content: '';
          position: absolute;
          bottom: -30px;
          right: -30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .vibra-hero::after {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }
        .vibra-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--accent);
          color: white;
        }
        .vibra-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .vibra-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .vibra-card-image {
          position: relative;
          width: 100%;
          height: 160px;
          background: color-mix(in srgb, var(--accent) 8%, #FFFAF5);
          overflow: hidden;
        }
        .vibra-price-bubble {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: var(--accent);
          color: white;
          font-weight: 800;
          font-size: 14px;
          padding: 4px 10px;
          border-radius: 100px;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent);
        }
        .vibra-price-inline {
          font-weight: 800;
          font-size: 15px;
          color: var(--accent);
          white-space: nowrap;
        }
        .vibra-category-strip {
          background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #FF8C00));
          color: white;
          padding: 8px 16px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          box-shadow: 0 3px 10px color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .vibra-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 600;
          background: color-mix(in srgb, var(--accent) 10%, #FFFAF5);
          color: color-mix(in srgb, var(--accent) 90%, #111);
          border: 1.5px solid color-mix(in srgb, var(--accent) 20%, transparent);
        }
        .vibra-compact-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          transition: box-shadow 0.15s;
        }
        .vibra-compact-item:hover {
          box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Hero header */}
      <div
        className="vibra-hero relative px-6 py-8"
        style={{ minHeight: tenant.coverImageUrl ? 0 : "auto" }}
      >
        {tenant.coverImageUrl ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={tenant.coverImageUrl}
                alt={`${tenant.name} cover`}
                fill
                sizes="480px"
                className="object-cover"
                priority
                style={{ filter: "brightness(0.55)" }}
              />
            </div>
            <div className="relative z-10 py-6">
              {tenant.logoUrl && (
                <div className="mb-4 h-14 w-14 overflow-hidden rounded-2xl border-2 border-white/40">
                  <Image
                    src={tenant.logoUrl}
                    alt={tenant.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl font-black text-white leading-tight">{tenant.name}</h1>
              {tenant.description && (
                <p className="mt-1 text-sm text-white/70">{tenant.description}</p>
              )}
              {(tenant.address || tenant.phone) && (
                <p className="mt-1 text-xs text-white/50">
                  {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="relative z-10">
            {tenant.logoUrl && (
              <div className="mb-4 h-14 w-14 overflow-hidden rounded-2xl border-2 border-white/40">
                <Image
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl font-black text-white leading-tight">{tenant.name}</h1>
            {tenant.description && (
              <p className="mt-1 text-sm text-white/70">{tenant.description}</p>
            )}
            {(tenant.address || tenant.phone) && (
              <p className="mt-1 text-xs text-white/50">
                {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex gap-2 overflow-x-auto px-5 py-3 bg-white border-b border-gray-100">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { background: accent, color: "white", boxShadow: `0 3px 10px color-mix(in srgb, ${accent} 35%, transparent)` }
                  : { background: "#F3F0EC", color: "#666" }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="px-5 pt-6">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;

          // Use card layout for items with images, compact for text-only
          const hasImages = catItems.some((i) => i.imageUrl);

          return (
            <section key={category.id} className="mb-10">
              <div className="mb-5">
                <div className="vibra-category-strip">
                  <span>&#9632;</span>
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </div>
                {category.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                  </p>
                )}
              </div>

              {hasImages ? (
                <div className="space-y-4">
                  {catItems.map((item) => {
                    const badges = (item.badges as string[]) || [];
                    return (
                      <div key={item.id} className="vibra-card">
                        {item.imageUrl && (
                          <TappableDiv src={item.imageUrl} alt={item.name} className="vibra-card-image">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="440px"
                              className="object-cover"
                            />
                            <div className="vibra-price-bubble">{formatPrices(item)}</div>
                          </TappableDiv>
                        )}
                        <div className="p-4">
                          <h3 className="text-base font-bold leading-snug">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {!item.imageUrl && (
                            <span className="vibra-price-inline mt-2 block">{formatPrices(item)}</span>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span key={badge} className="vibra-badge">
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
              ) : (
                <div className="space-y-2">
                  {catItems.map((item) => {
                    const badges = (item.badges as string[]) || [];
                    return (
                      <div key={item.id} className="vibra-compact-item">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {badges.map((badge) => (
                                <span key={badge} className="vibra-badge">
                                  {badge.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="vibra-price-inline">{formatPrices(item)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
    </div>
  );
}
