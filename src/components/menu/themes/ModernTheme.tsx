import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";

export function ModernTheme({
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

  return (
    <div className="modern-theme-bg">
    <div
      style={
        { "--accent": tenant.accentColor || "#111111" } as React.CSSProperties
      }
      className="modern-theme"
    >
      <style>{`
        .modern-theme-bg {
          background: #EEF1F8;
          min-height: 100vh;
        }
        .modern-theme {
          font-family: 'Outfit', system-ui, sans-serif;
          background: linear-gradient(160deg, #F8F9FC 0%, #FFFFFF 30%, #F4F6FB 60%, #EEF1F8 100%);
          color: #111111;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
          position: relative;
        }
        .modern-theme::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -80px;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .modern-theme::after {
          content: '';
          position: absolute;
          bottom: 100px;
          left: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .modern-theme h1, .modern-theme h2, .modern-theme h3 {
          font-family: 'Syne', system-ui, sans-serif;
        }
        .modern-item-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 16px;
          padding: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .modern-item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .modern-category-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), color-mix(in srgb, var(--accent) 6%, transparent));
          color: var(--accent);
          margin-bottom: 14px;
        }
      `}</style>

      {/* Header */}
      <header className="relative flex items-center gap-4 px-6 pt-8 pb-6">
        {tenant.logoUrl ? (
          <div className="h-16 w-16 overflow-hidden rounded-2xl p-0.5 shadow-lg" style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, white))` }}>
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="h-full w-full rounded-[14px] object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, black))` }}
          >
            {tenant.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{tenant.name}</h1>
          {tenant.description && (
            <p className="text-sm text-gray-500">{tenant.description}</p>
          )}
        </div>
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex gap-2 overflow-x-auto px-6 pb-4">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, black))`, color: "white", boxShadow: `0 4px 12px color-mix(in srgb, var(--accent) 30%, transparent)` }
                  : { background: "rgba(0,0,0,0.04)", color: "#666" }
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
            <section key={category.id} className="mb-8">
              <div className="modern-category-pill">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                {t(translations, "category", category.id, "name", category.name, currentLanguage)}
              </div>
              {category.description && (
                <p className="mb-3 text-sm text-gray-400">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-3">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="modern-item-card">
                      <div className="flex gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-20 w-20 shrink-0 rounded-xl object-cover shadow-sm"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold">
                              {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                            </h3>
                            <span
                              className="shrink-0 rounded-lg px-2 py-0.5 text-sm font-bold"
                              style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
                            >
                              {formatPrices(item)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {badges.map((badge) => (
                                <span
                                  key={badge}
                                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                  style={{
                                    background: `color-mix(in srgb, var(--accent) 10%, transparent)`,
                                    color: "var(--accent)",
                                  }}
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
