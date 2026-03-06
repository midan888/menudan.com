import Image from "next/image";
import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";
import { TappableImage } from "@/components/menu/ImageLightbox";

export function LuxeTheme({
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

  // Force a gold-range accent for dark backgrounds
  const rawAccent = tenant.accentColor || "#C9A84C";
  const isTooDark = (() => {
    const hex = rawAccent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 90;
  })();
  const accent = isTooDark ? "#C9A84C" : rawAccent;

  return (
    <div className="luxe-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="luxe-theme"
    >
      <style>{`
        .luxe-theme-bg {
          background: #080808;
          min-height: 100vh;
        }
        .luxe-theme {
          font-family: 'Crimson Pro', Georgia, serif;
          background: linear-gradient(180deg, #0C0C0C 0%, #080808 40%, #0A0809 100%);
          color: #E8E0D0;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 80px;
          position: relative;
          overflow: hidden;
        }
        .luxe-theme::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 500px;
          background: radial-gradient(ellipse at 50% -10%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 65%);
          pointer-events: none;
        }
        .luxe-theme h1, .luxe-theme h2, .luxe-theme h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .luxe-gold {
          color: var(--accent);
        }
        .luxe-cover-overlay {
          background: linear-gradient(to top, #0C0C0C 5%, rgba(12,12,12,0.6) 45%, rgba(12,12,12,0.15) 100%);
        }
        .luxe-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--accent);
          opacity: 0.6;
        }
        .luxe-ornament-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.4;
        }
        .luxe-category-title {
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          text-align: center;
        }
        .luxe-item {
          padding: 20px 0;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .luxe-item:last-child {
          border-bottom: none;
        }
        .luxe-item-name {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .luxe-price {
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          color: var(--accent);
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .luxe-badge {
          display: inline-block;
          padding: 2px 8px;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--accent) 70%, #E8E0D0);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .luxe-section-rule {
          width: 60px;
          height: 1px;
          margin: 0 auto 24px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.5;
        }
        .luxe-number {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: color-mix(in srgb, var(--accent) 35%, transparent);
          margin-right: 8px;
        }
      `}</style>

      {/* Cover image */}
      {tenant.coverImageUrl ? (
        <div className="relative h-56 overflow-hidden">
          <Image
            src={tenant.coverImageUrl}
            alt={`${tenant.name} cover`}
            fill
            sizes="480px"
            className="object-cover"
            priority
            style={{ filter: "brightness(0.6) contrast(1.1)" }}
          />
          <div className="absolute inset-0 luxe-cover-overlay" />
        </div>
      ) : (
        <>
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
          <div className="h-16" />
        </>
      )}

      {/* Header */}
      <header className="relative z-10 px-8 pt-8 pb-4 text-center">
        {tenant.logoUrl && (
          <div
            className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full p-px"
            style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 30%, #0C0C0C))` }}
          >
            <Image
              src={tenant.logoUrl}
              alt={tenant.name}
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover"
              style={{ filter: "brightness(0.9) contrast(1.05)" }}
            />
          </div>
        )}
        <div className="luxe-ornament mb-4 px-6">
          <div className="luxe-ornament-line" />
          <span className="text-xs tracking-widest">&#9674;</span>
          <div className="luxe-ornament-line" />
        </div>
        <h1
          className="text-3xl font-normal tracking-widest uppercase"
          style={{ color: accent, letterSpacing: "0.2em" }}
        >
          {tenant.name}
        </h1>
        <div className="luxe-ornament mt-4 px-6">
          <div className="luxe-ornament-line" />
          <span className="text-xs tracking-widest">&#9674;</span>
          <div className="luxe-ornament-line" />
        </div>
        {tenant.description && (
          <p className="mt-4 text-sm text-white/35 italic tracking-wide leading-relaxed max-w-xs mx-auto">
            {tenant.description}
          </p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-2 text-xs tracking-widest text-white/20 uppercase">
            {[tenant.address, tenant.phone].filter(Boolean).join('  ·  ')}
          </p>
        )}
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-4 px-6 py-4">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 70%, #FFD700))`, color: "#080808", fontWeight: 700 }
                  : { border: `1px solid ${accent}25`, color: `${accent}60` }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="relative z-10 px-7 pt-4">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-12">
              <h2 className="luxe-category-title">
                {t(translations, "category", category.id, "name", category.name, currentLanguage)}
              </h2>
              <div className="luxe-section-rule" />
              {category.description && (
                <p className="mb-6 text-center text-sm italic text-white/30">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div>
                {catItems.map((item, idx) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="luxe-item">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <TappableImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="shrink-0 object-cover"
                            style={{
                              width: 80,
                              height: 80,
                              filter: "brightness(0.8) contrast(1.1) saturate(0.9)",
                              outline: `1px solid ${accent}20`,
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="luxe-item-name flex items-baseline gap-1">
                                <span className="luxe-number">{String(idx + 1).padStart(2, "0")}</span>
                                {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                              </h3>
                            </div>
                            <span className="luxe-price">{formatPrices(item)}</span>
                          </div>
                          {item.description && (
                            <p className="mt-2 text-sm italic text-white/35 leading-relaxed">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {badges.map((badge) => (
                                <span key={badge} className="luxe-badge">
                                  {badge.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer ornament */}
      <div className="luxe-ornament px-12 pb-2">
        <div className="luxe-ornament-line" />
        <span className="text-sm tracking-widest">&#9674;</span>
        <div className="luxe-ornament-line" />
      </div>
    </div>
    </div>
  );
}
