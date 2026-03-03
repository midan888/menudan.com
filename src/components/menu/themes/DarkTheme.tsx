import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";

export function DarkTheme({
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

  const rawAccent = tenant.accentColor || "#C8A064";
  // If accent color is too dark for dark background, use gold fallback
  const isDarkAccent = (() => {
    const hex = rawAccent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Relative luminance threshold — anything below ~30% brightness is too dark
    return (r * 299 + g * 587 + b * 114) / 1000 < 80;
  })();
  const accent = isDarkAccent ? "#C8A064" : rawAccent;

  return (
    <div className="dark-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="dark-theme"
    >
      <style>{`
        .dark-theme-bg {
          background: #0A0A0A;
          min-height: 100vh;
        }
        .dark-theme {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: linear-gradient(170deg, #0F0F0F 0%, #0A0A0A 20%, #080808 50%, #0D0B0F 100%);
          color: #F5F5F5;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .dark-theme::before {
          content: '';
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent), transparent 60%);
          pointer-events: none;
        }
        .dark-theme::after {
          content: '';
          position: absolute;
          bottom: 50px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 6%, transparent), transparent 60%);
          pointer-events: none;
        }
        .dark-theme h1, .dark-theme h2, .dark-theme h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .dark-theme .price {
          font-family: 'Space Mono', monospace;
        }
        .dark-item-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(8px);
        }
        .dark-item-card:hover {
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--accent) 8%, transparent);
        }
      `}</style>

      {/* Cover image */}
      {tenant.coverImageUrl ? (
        <div className="relative h-52 overflow-hidden">
          <img
            src={tenant.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, #0F0F0F 5%, rgba(15,15,15,0.6) 40%, rgba(15,15,15,0.2) 100%)",
            }}
          />
        </div>
      ) : (
        /* Accent gradient bar */
        <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      )}

      {/* Header */}
      <header className="relative px-6 pt-8 pb-6 text-center">
        {tenant.logoUrl && (
          <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full p-0.5" style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 30%, black))` }}>
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
        {tenant.description && (
          <p className="mt-2 text-sm text-white/40">{tenant.description}</p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-1 text-xs text-white/30">
            {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
          </p>
        )}
        {/* Decorative accent line */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${accent}60)` }} />
          <div className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}60` }} />
          <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${accent}60)` }} />
        </div>
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-2 px-6 pb-6">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 70%, black))`, color: "#0A0A0A", boxShadow: `0 4px 16px color-mix(in srgb, ${accent} 30%, transparent)` }
                  : { border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="relative px-6">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />
                <h2 className="text-lg font-bold uppercase tracking-widest" style={{ color: accent, textShadow: `0 0 20px ${accent}30` }}>
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </h2>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${accent}50, transparent)` }} />
              </div>
              {category.description && (
                <p className="mb-4 text-center text-sm text-white/30">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-3">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="dark-item-card">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-20 w-20 shrink-0 rounded-xl object-cover"
                            loading="lazy"
                            style={{ boxShadow: `0 2px 12px ${accent}15` }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-semibold">
                              {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                            </h3>
                            <span className="price shrink-0 text-sm" style={{ color: accent, textShadow: `0 0 8px ${accent}40` }}>
                              {formatPrices(item)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm leading-relaxed text-white/40">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span
                                  key={badge}
                                  className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                                  style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent, border: `1px solid ${accent}25` }}
                                >
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
