import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";

export function ClassicTheme({
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
    <div className="classic-theme-bg">
    <div
      style={
        { "--accent": tenant.accentColor || "#8B4513" } as React.CSSProperties
      }
      className="classic-theme"
    >
      <style>{`
        .classic-theme-bg {
          background: #F5EDE0;
          min-height: 100vh;
        }
        .classic-theme {
          font-family: 'Crimson Pro', Georgia, serif;
          background: linear-gradient(180deg, #F7F0E6 0%, #FDFBF7 15%, #FBF6EE 50%, #F5EDE0 100%);
          color: #2C2420;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
          position: relative;
        }
        .classic-theme::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: radial-gradient(ellipse at top center, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%);
          pointer-events: none;
        }
        .classic-theme h1, .classic-theme h2, .classic-theme h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .classic-category-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .classic-category-divider::before,
        .classic-category-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent);
        }
        .classic-item-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3));
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 12px;
          padding: 14px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .classic-item-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--accent) 10%, transparent);
        }
      `}</style>

      {/* Cover image with gradient overlay */}
      {tenant.coverImageUrl && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={tenant.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, #F7F0E6 5%, rgba(247,240,230,0.6) 40%, rgba(247,240,230,0.2) 100%)",
            }}
          />
        </div>
      )}

      {/* Header */}
      <header className="relative px-6 pt-8 pb-4 text-center">
        {tenant.logoUrl && (
          <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full p-0.5" style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 50%, #F7F0E6))` }}>
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
        {tenant.description && (
          <p className="mt-2 text-sm opacity-60">{tenant.description}</p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-1 text-xs opacity-40">
            {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
          </p>
        )}
        {/* Decorative flourish */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, var(--accent))` }} />
          <div className="h-1.5 w-1.5 rotate-45" style={{ background: "var(--accent)" }} />
          <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, var(--accent))` }} />
        </div>
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-4 px-6 pb-3 pt-2">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="text-sm transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { fontWeight: 600, color: "var(--accent)", borderBottom: "2px solid var(--accent)", paddingBottom: "4px" }
                  : { opacity: 0.5, paddingBottom: "6px" }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="relative px-6 pt-6">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-10">
              <div className="classic-category-divider">
                <h2 className="text-xl font-bold whitespace-nowrap" style={{ color: "var(--accent)" }}>
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </h2>
              </div>
              {category.description && (
                <p className="mb-4 text-center text-sm opacity-50">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-3">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="classic-item-card">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-20 w-20 shrink-0 rounded-lg object-cover shadow-sm"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-semibold leading-tight">
                              {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                            </h3>
                            <span className="shrink-0 rounded-full px-2.5 py-0.5 text-sm font-bold" style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
                              {formatPrices(item)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm leading-relaxed opacity-55">
                              {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                            </p>
                          )}
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span
                                  key={badge}
                                  className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                                  style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: "color-mix(in srgb, var(--accent) 80%, #2C2420)" }}
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
