import type { ThemeProps } from "./types";
import { t, formatPrices } from "./types";

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
    <div className="bistro-theme-bg">
    <div
      style={{ "--accent": accent } as React.CSSProperties}
      className="bistro-theme"
    >
      <style>{`
        .bistro-theme-bg {
          background: #EBE0D0;
          min-height: 100vh;
        }
        .bistro-theme {
          font-family: 'Crimson Pro', Georgia, serif;
          background: linear-gradient(175deg, #EDE4D6 0%, #F5EDE3 15%, #F8F2EA 40%, #F0E6D8 70%, #EBE0D0 100%);
          color: #3D2E1E;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .bistro-theme::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 350px;
          background: radial-gradient(ellipse at top center, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%);
          pointer-events: none;
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
          border-bottom: 1px dotted color-mix(in srgb, var(--accent) 35%, transparent);
          min-width: 20px;
          margin-bottom: 4px;
        }
        .bistro-section {
          position: relative;
          padding: 24px 20px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 16px;
          backdrop-filter: blur(6px);
        }
        .bistro-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bistro-ornament::before,
        .bistro-ornament::after {
          content: '';
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
      `}</style>

      {/* Cover image or ornamental top border */}
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
              background: "linear-gradient(to top, #F5EDE3 5%, rgba(245,237,227,0.6) 40%, rgba(245,237,227,0.2) 100%)",
            }}
          />
        </div>
      ) : (
        <>
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div className="flex items-center justify-center gap-3 px-8 pt-6">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent}80)` }} />
            <span style={{ color: accent, textShadow: `0 0 10px ${accent}30` }} className="text-xl">&#9830;</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent}80)` }} />
          </div>
        </>
      )}

      {/* Header */}
      <header className="relative px-6 pt-4 pb-4 text-center">
        {tenant.logoUrl && (
          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full p-0.5" style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 40%, #F5EDE3))` }}>
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold italic tracking-tight">
          {tenant.name}
        </h1>
        {tenant.description && (
          <p className="mt-2 text-sm opacity-55">{tenant.description}</p>
        )}
        {(tenant.address || tenant.phone) && (
          <p className="mt-1 text-xs opacity-35">
            {[tenant.address, tenant.phone].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      {/* Divider */}
      <div className="bistro-ornament px-8 pb-2">
        <span className="text-xs" style={{ color: accent }}>&#10045;</span>
      </div>

      {/* Menu tabs */}
      {menus.length > 1 && (
        <nav className="flex justify-center gap-4 px-6 pt-2 pb-2">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={`?menu=${menu.id}${currentLanguage !== "en" ? `&lang=${currentLanguage}` : ""}`}
              className="text-sm italic transition-all"
              style={
                menu.id === activeMenu?.id
                  ? { fontWeight: 600, color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px" }
                  : { opacity: 0.4, paddingBottom: "6px" }
              }
            >
              {menu.name}
            </a>
          ))}
        </nav>
      )}

      {/* Categories & Items */}
      <main className="relative px-5 pt-4">
        {menuCategories.map((category) => {
          const catItems = getItems(category.id);
          if (catItems.length === 0) return null;
          return (
            <div key={category.id} className="bistro-section">
              <div className="text-center">
                <h2
                  className="mb-1 text-xl font-bold italic"
                  style={{ color: accent }}
                >
                  {t(translations, "category", category.id, "name", category.name, currentLanguage)}
                </h2>
                {category.description && (
                  <p className="mb-3 text-sm opacity-45">
                    {t(translations, "category", category.id, "description", category.description, currentLanguage)}
                  </p>
                )}

                {/* Ornamental line */}
                <div className="bistro-ornament mb-5">
                  <span className="text-[8px]" style={{ color: accent }}>&#9830;</span>
                </div>
              </div>

              <div className="space-y-5">
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
                          {formatPrices(item)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-0.5 text-sm italic opacity-45">
                          {t(translations, "item", item.id, "description", item.description, currentLanguage)}
                        </p>
                      )}
                      {badges.length > 0 && (
                        <div className="mt-1.5 flex justify-center gap-1">
                          {badges.map((badge, i) => (
                            <span
                              key={badge}
                              className="text-[10px] italic"
                              style={{ color: `color-mix(in srgb, ${accent} 70%, #3D2E1E)` }}
                            >
                              {badge.replace(/_/g, " ")}
                              {i < badges.length - 1 ? " \u00b7 " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom ornament */}
      <div className="flex items-center justify-center gap-3 px-8 pt-4">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent}60)` }} />
        <span style={{ color: accent }} className="text-xs">&#10045;</span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent}60)` }} />
      </div>
    </div>
    </div>
  );
}
