import Image from "next/image";
import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";
import { TappableImage } from "@/components/menu/ImageLightbox";

export function RusticTheme({
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

  const accent = tenant.accentColor || "#8B3A2A";

  return (
    <div className="rustic-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="rustic-theme"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');

        .rustic-theme-bg {
          background: #2A1F14;
          min-height: 100vh;
        }
        .rustic-theme {
          font-family: 'Crimson Pro', Georgia, serif;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,0.03) 0px,
              rgba(0,0,0,0.03) 1px,
              transparent 1px,
              transparent 40px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.02) 0px,
              rgba(0,0,0,0.02) 1px,
              transparent 1px,
              transparent 40px
            ),
            linear-gradient(175deg, #2E1F12 0%, #3A2618 30%, #2E1C10 70%, #251810 100%);
          color: #F2E8D9;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 64px;
          position: relative;
        }
        .rustic-theme h1, .rustic-theme h2 {
          font-family: 'Caveat', 'Crimson Pro', cursive;
        }
        .rustic-theme h3 {
          font-family: 'Crimson Pro', Georgia, serif;
        }
        .rustic-plank {
          background: linear-gradient(
            170deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.02) 50%,
            rgba(0,0,0,0.1) 100%
          );
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .rustic-plank::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
        .rustic-category-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--accent);
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
          line-height: 1.1;
        }
        .rustic-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0 20px;
        }
        .rustic-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 40%, transparent), transparent);
        }
        .rustic-divider-icon {
          color: color-mix(in srgb, var(--accent) 70%, #F2E8D9);
          font-size: 12px;
        }
        .rustic-price {
          font-family: 'Caveat', cursive;
          font-size: 20px;
          font-weight: 700;
          color: var(--accent);
          text-shadow: 1px 1px 4px rgba(0,0,0,0.4);
          white-space: nowrap;
        }
        .rustic-badge {
          display: inline-block;
          padding: 1px 7px;
          border-radius: 3px;
          font-size: 10px;
          font-style: italic;
          color: color-mix(in srgb, var(--accent) 80%, #F2E8D9);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          background: color-mix(in srgb, var(--accent) 10%, transparent);
        }
        .rustic-chalk-num {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: rgba(242,232,217,0.3);
          margin-right: 8px;
        }
      `}</style>

      {/* Cover image */}
      {tenant.coverImageUrl ? (
        <div className="relative h-52 overflow-hidden">
          <Image
            src={tenant.coverImageUrl}
            alt={`${tenant.name} cover`}
            fill
            sizes="480px"
            className="object-cover"
            priority
            style={{ filter: "sepia(0.2) contrast(1.1) brightness(0.65)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #2E1F12 8%, rgba(46,31,18,0.5) 50%, rgba(46,31,18,0.2) 100%)" }}
          />
        </div>
      ) : (
        <div className="pt-2">
          <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        </div>
      )}

      {/* Header */}
      <header className="relative px-6 pt-6 pb-4 text-center">
        {tenant.logoUrl && (
          <div
            className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full p-0.5"
            style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 40%, #2E1F12))` }}
          >
            <Image
              src={tenant.logoUrl}
              alt={tenant.name}
              width={80}
              height={80}
              className="h-full w-full rounded-full object-cover"
              style={{ filter: "sepia(0.1)" }}
            />
          </div>
        )}
        <h1
          className="text-4xl leading-tight"
          style={{ color: accent, textShadow: `2px 2px 12px rgba(0,0,0,0.6)` }}
        >
          {tenant.name}
        </h1>
        {tenant.description && (
          <p className="mt-2 text-sm italic text-white/45">{tenant.description}</p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-1 text-xs text-white/30">
            {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="rustic-divider mt-4 px-8">
          <div className="rustic-divider-line" />
          <span className="rustic-divider-icon">&#10022;</span>
          <div className="rustic-divider-line" />
        </div>
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-4 px-6 pb-4">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="text-base italic transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "2px" }
                  : { color: "rgba(242,232,217,0.35)", paddingBottom: "4px" }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="px-5 pt-2">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-8">
              <div className="rustic-plank p-5 mb-2">
                <h2 className="rustic-category-title">
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm italic text-white/40">
                    {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                  </p>
                )}
                <div className="rustic-divider mt-3">
                  <div className="rustic-divider-line" />
                  <span className="rustic-divider-icon" style={{ fontSize: 8 }}>&#9830;</span>
                  <div className="rustic-divider-line" />
                </div>
                <div className="space-y-5">
                  {catItems.map((item, idx) => {
                    const badges = (item.badges as string[]) || [];
                    return (
                      <div key={item.id} className="flex gap-4">
                        {item.imageUrl && (
                          <TappableImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={76}
                            height={76}
                            className="shrink-0 rounded-md object-cover"
                            style={{
                              width: 76,
                              height: 76,
                              filter: "sepia(0.15) contrast(1.05)",
                              border: `1px solid ${accent}30`,
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-baseline gap-1">
                              <span className="rustic-chalk-num">{String(idx + 1).padStart(2, "0")}</span>
                              <h3 className="text-base font-semibold">
                                {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                              </h3>
                            </div>
                            <span className="rustic-price">{formatPrices(item)}</span>
                          </div>
                          {item.description && (
                            <p className="mt-0.5 text-sm italic text-white/40 leading-relaxed">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span key={badge} className="rustic-badge">
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
              </div>
            </section>
          );
        })}
      </main>
    </div>
    </div>
  );
}
