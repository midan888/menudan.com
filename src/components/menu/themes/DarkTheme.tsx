import type { ThemeProps } from "./types";
import { t } from "./types";

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

  const accent = tenant.accentColor || "#C8A064";

  return (
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="dark-theme"
    >
      <style>{`
        .dark-theme {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #0A0A0A;
          color: #F5F5F5;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
        }
        .dark-theme h1, .dark-theme h2, .dark-theme h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .dark-theme .price {
          font-family: 'Space Mono', monospace;
        }
      `}</style>

      {/* Accent line */}
      <div className="h-1" style={{ background: accent }} />

      {/* Header */}
      <header className="px-6 pt-8 pb-6 text-center">
        {tenant.logoUrl && (
          <img
            src={tenant.logoUrl}
            alt={tenant.name}
            className="mx-auto mb-4 h-16 w-16 rounded-full object-cover ring-2"
            style={{ borderColor: accent }}
          />
        )}
        <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
        {tenant.description && (
          <p className="mt-2 text-sm text-white/50">{tenant.description}</p>
        )}
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-2 px-6 pb-6">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                menu.id === activeMenu?.id
                  ? "text-black"
                  : "border border-white/20 text-white/60 hover:border-white/40"
              }`}
              style={
                menu.id === activeMenu?.id
                  ? { background: accent }
                  : undefined
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="px-6">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <section key={category.id} className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: `${accent}40` }} />
                <h2 className="text-lg font-bold uppercase tracking-widest" style={{ color: accent }}>
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </h2>
                <div className="h-px flex-1" style={{ background: `${accent}40` }} />
              </div>
              {category.description && (
                <p className="mb-4 text-center text-sm text-white/40">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-4">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id} className="flex gap-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-semibold">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          <span className="price flex-shrink-0 text-sm" style={{ color: accent }}>
                            {item.currency} {Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm leading-relaxed text-white/50">
                            {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                          </p>
                        )}
                        {badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {badges.map((badge) => (
                              <span
                                key={badge}
                                className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                                style={{ borderColor: `${accent}40`, color: accent }}
                              >
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
  );
}
