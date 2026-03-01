import type { ThemeProps } from "./types";
import { t } from "./types";

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
    <div
      style={
        { "--accent": tenant.accentColor || "#111111" } as React.CSSProperties
      }
      className="modern-theme"
    >
      <style>{`
        .modern-theme {
          font-family: 'Outfit', system-ui, sans-serif;
          background: #FFFFFF;
          color: #111111;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
        }
        .modern-theme h1, .modern-theme h2, .modern-theme h3 {
          font-family: 'Syne', system-ui, sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-8 pb-6">
        {tenant.logoUrl ? (
          <img
            src={tenant.logoUrl}
            alt={tenant.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: "var(--accent)" }}
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
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                menu.id === activeMenu?.id
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={
                menu.id === activeMenu?.id
                  ? { background: "var(--accent)" }
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
            <section key={category.id} className="mb-8">
              <h2 className="mb-1 text-lg font-bold">
                {t(translations, "category", category.id, "name", category.name, currentLanguage)}
              </h2>
              {category.description && (
                <p className="mb-3 text-sm text-gray-400">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-3">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl bg-gray-50 p-3"
                    >
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
                          <h3 className="text-sm font-semibold">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          <span
                            className="flex-shrink-0 text-sm font-bold"
                            style={{ color: "var(--accent)" }}
                          >
                            {item.currency} {Number(item.price).toFixed(2)}
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
