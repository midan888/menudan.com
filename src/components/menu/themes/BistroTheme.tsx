import type { ThemeProps } from "./types";
import { t } from "./types";

export function BistroTheme({
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

  const accent = tenant.accentColor || "#B8860B";

  return (
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="bistro-theme"
    >
      <style>{`
        .bistro-theme {
          font-family: 'Crimson Pro', Georgia, serif;
          background: #F5EDE3;
          color: #3D2E1E;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
        }
        .bistro-theme h1, .bistro-theme h2, .bistro-theme h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .bistro-item-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .bistro-dots {
          flex: 1;
          border-bottom: 1px dotted #3D2E1E40;
          min-width: 20px;
          margin-bottom: 4px;
        }
      `}</style>

      {/* Ornamental top border */}
      <div className="flex items-center justify-center gap-3 px-8 pt-8">
        <div className="h-px flex-1" style={{ background: accent }} />
        <span style={{ color: accent }} className="text-lg">&#9830;</span>
        <div className="h-px flex-1" style={{ background: accent }} />
      </div>

      {/* Header */}
      <header className="px-6 pt-4 pb-6 text-center">
        {tenant.logoUrl && (
          <img
            src={tenant.logoUrl}
            alt={tenant.name}
            className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
          />
        )}
        <h1 className="text-3xl font-bold italic tracking-tight">
          {tenant.name}
        </h1>
        {tenant.description && (
          <p className="mt-2 text-sm opacity-60">{tenant.description}</p>
        )}
        {tenant.address && (
          <p className="mt-1 text-xs opacity-40">{tenant.address}</p>
        )}
      </header>

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 px-8">
        <div className="h-px flex-1" style={{ background: `${accent}60` }} />
        <span style={{ color: accent }} className="text-xs">&#10045;</span>
        <div className="h-px flex-1" style={{ background: `${accent}60` }} />
      </div>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-4 px-6 pt-4 pb-2">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className={`text-sm italic transition-opacity ${
                menu.id === activeMenu?.id
                  ? "font-semibold opacity-100"
                  : "opacity-40 hover:opacity-70"
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
            <section key={category.id} className="mb-10 text-center">
              <h2
                className="mb-1 text-xl font-bold italic"
                style={{ color: accent }}
              >
                {t(translations, "category", category.id, "name", category.name, currentLanguage)}
              </h2>
              {category.description && (
                <p className="mb-4 text-sm opacity-50">
                  {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                </p>
              )}

              {/* Ornamental line */}
              <div className="mx-auto mb-5 flex items-center justify-center gap-2">
                <div className="h-px w-8" style={{ background: `${accent}60` }} />
                <span className="text-[8px]" style={{ color: accent }}>&#9830;</span>
                <div className="h-px w-8" style={{ background: `${accent}60` }} />
              </div>

              <div className="space-y-4">
                {catItems.map((item) => {
                  const badges = (item.badges as string[]) || [];
                  return (
                    <div key={item.id}>
                      {/* Name ..... Price row */}
                      <div className="bistro-item-row">
                        <span className="text-base font-semibold whitespace-nowrap">
                          {t(translations, "item", item.id, "name", item.name, currentLanguage)}
                        </span>
                        <span className="bistro-dots" />
                        <span className="text-base font-semibold whitespace-nowrap" style={{ color: accent }}>
                          {item.currency} {Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-0.5 text-sm italic opacity-50">
                          {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                        </p>
                      )}
                      {badges.length > 0 && (
                        <div className="mt-1 flex justify-center gap-1">
                          {badges.map((badge) => (
                            <span
                              key={badge}
                              className="text-[10px] italic opacity-50"
                            >
                              {badge.replace(/_/g, " ")}
                              {badges.indexOf(badge) < badges.length - 1 ? " · " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Bottom ornament */}
      <div className="flex items-center justify-center gap-3 px-8">
        <div className="h-px flex-1" style={{ background: `${accent}60` }} />
        <span style={{ color: accent }} className="text-xs">&#10045;</span>
        <div className="h-px flex-1" style={{ background: `${accent}60` }} />
      </div>
    </div>
  );
}
