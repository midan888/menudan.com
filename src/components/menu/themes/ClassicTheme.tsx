import type { ThemeProps } from "./types";
import { t } from "./types";

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
    <div
      style={
        { "--accent": tenant.accentColor || "#8B4513" } as React.CSSProperties
      }
      className="classic-theme"
    >
      <style>{`
        .classic-theme {
          font-family: 'Crimson Pro', Georgia, serif;
          background: #FDFBF7;
          color: #2C2420;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
        }
        .classic-theme h1, .classic-theme h2, .classic-theme h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      {/* Cover image */}
      {tenant.coverImageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={tenant.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-8 pb-4 text-center">
        {tenant.logoUrl && (
          <img
            src={tenant.logoUrl}
            alt={tenant.name}
            className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
          />
        )}
        <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
        {tenant.description && (
          <p className="mt-2 text-sm opacity-60">{tenant.description}</p>
        )}
        {tenant.address && (
          <p className="mt-1 text-xs opacity-40">{tenant.address}</p>
        )}
      </header>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-4 border-b border-[#2C2420]/10 px-6 pb-3">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className={`text-sm transition-colors ${
                menu.id === activeMenu?.id
                  ? "font-semibold opacity-100"
                  : "opacity-50 hover:opacity-75"
              }`}
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
              <h2 className="mb-1 text-xl font-bold">
                {t(translations, "category", category.id, "name", category.name, currentLanguage)}
              </h2>
              {category.description && (
                <p className="mb-4 text-sm opacity-50">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}
              <div className="space-y-5">
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
                          <h3 className="text-base font-semibold leading-tight">
                            {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                          </h3>
                          <span className="flex-shrink-0 text-base font-semibold" style={{ color: "var(--accent)" }}>
                            {item.currency} {Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm leading-relaxed opacity-60">
                            {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                          </p>
                        )}
                        {badges.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {badges.map((badge) => (
                              <span
                                key={badge}
                                className="rounded-full bg-[#2C2420]/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider opacity-60"
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
