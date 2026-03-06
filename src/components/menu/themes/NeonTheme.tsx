import Image from "next/image";
import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";
import { TappableImage } from "@/components/menu/ImageLightbox";

export function NeonTheme({
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

  // Ensure accent is bright enough on dark background
  const rawAccent = tenant.accentColor || "#00FF94";
  const isDark = (() => {
    const hex = rawAccent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 100;
  })();
  const accent = isDark ? "#00FF94" : rawAccent;

  return (
    <div className="neon-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="neon-theme"
    >
      <style>{`
        .neon-theme-bg {
          background: #060610;
          min-height: 100vh;
        }
        .neon-theme {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: linear-gradient(170deg, #07071A 0%, #060610 40%, #08061A 100%);
          color: #E8E8FF;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 64px;
          position: relative;
          overflow: hidden;
        }
        .neon-theme::before {
          content: '';
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .neon-theme h1, .neon-theme h2, .neon-theme h3 {
          font-family: 'Syne', system-ui, sans-serif;
        }
        .neon-glow {
          text-shadow: 0 0 20px color-mix(in srgb, var(--accent) 60%, transparent),
                       0 0 40px color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .neon-border {
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
          border-radius: 12px;
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--accent) 5%, #0A0A1E),
            rgba(10, 10, 30, 0.6)
          );
          backdrop-filter: blur(10px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .neon-border:hover {
          border-color: color-mix(in srgb, var(--accent) 50%, transparent);
          box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 10%, transparent),
                      inset 0 0 20px color-mix(in srgb, var(--accent) 3%, transparent);
        }
        .neon-price {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: var(--accent);
          text-shadow: 0 0 8px color-mix(in srgb, var(--accent) 50%, transparent);
        }
        .neon-cat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .neon-cat-header::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 18px;
          background: var(--accent);
          border-radius: 2px;
          box-shadow: 0 0 10px var(--accent), 0 0 20px color-mix(in srgb, var(--accent) 50%, transparent);
        }
        .neon-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 8%, transparent);
        }
        .neon-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent);
          margin: 4px 0;
        }
      `}</style>

      {/* Cover image */}
      {tenant.coverImageUrl ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={tenant.coverImageUrl}
            alt={`${tenant.name} cover`}
            fill
            sizes="480px"
            className="object-cover"
            priority
            style={{ filter: "saturate(0.7) brightness(0.5)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #07071A 10%, rgba(7,7,26,0.5) 60%, rgba(7,7,26,0.2) 100%)" }}
          />
        </div>
      ) : (
        <div className="neon-line" style={{ margin: 0 }} />
      )}

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-6 text-center">
        {tenant.logoUrl && (
          <div
            className="mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full"
            style={{
              border: `2px solid ${accent}`,
              boxShadow: `0 0 20px color-mix(in srgb, ${accent} 40%, transparent), 0 0 40px color-mix(in srgb, ${accent} 15%, transparent)`,
            }}
          >
            <Image
              src={tenant.logoUrl}
              alt={tenant.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <h1
          className="text-3xl font-bold tracking-tight neon-glow"
          style={{ color: accent }}
        >
          {tenant.name}
        </h1>
        {tenant.description && (
          <p className="mt-2 text-sm text-white/40">{tenant.description}</p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-1 text-xs text-white/25">
            {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="relative z-10 flex justify-center gap-2 px-6 pb-6">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={
                menu.id === activeMenu?.id
                  ? {
                      background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 60%, #00B3FF))`,
                      color: "#060610",
                      fontWeight: 700,
                      boxShadow: `0 0 16px color-mix(in srgb, ${accent} 50%, transparent)`,
                    }
                  : {
                      border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
                      color: "rgba(232,232,255,0.5)",
                    }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="relative z-10 px-5">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-10">
              <div className="neon-cat-header">
                <h2 className="text-base font-bold tracking-widest uppercase" style={{ color: accent }}>
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </h2>
              </div>
              {category.description && (
                <p className="mb-4 text-sm text-white/30">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-3">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="neon-border p-4">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <TappableImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={72}
                            height={72}
                            className="shrink-0 rounded-lg object-cover"
                            style={{
                              width: 72,
                              height: 72,
                              filter: "saturate(0.8)",
                              boxShadow: `0 2px 12px color-mix(in srgb, ${accent} 15%, transparent)`,
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-white/90">
                              {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                            </h3>
                            <span className="neon-price shrink-0">{formatPrices(item)}</span>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-xs text-white/35 leading-relaxed">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span key={badge} className="neon-badge">
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
    </div>
    </div>
  );
}
