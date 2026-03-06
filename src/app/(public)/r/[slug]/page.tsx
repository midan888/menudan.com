import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  tenants,
  menus,
  categories,
  items,
  translations,
  menuViews,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { ClassicTheme } from "@/components/menu/themes/ClassicTheme";
import { ModernTheme } from "@/components/menu/themes/ModernTheme";
import { DarkTheme } from "@/components/menu/themes/DarkTheme";
import { BistroTheme } from "@/components/menu/themes/BistroTheme";
import { NordicTheme } from "@/components/menu/themes/NordicTheme";
import { NeonTheme } from "@/components/menu/themes/NeonTheme";
import { RusticTheme } from "@/components/menu/themes/RusticTheme";
import { ZenTheme } from "@/components/menu/themes/ZenTheme";
import { LuxeTheme } from "@/components/menu/themes/LuxeTheme";
import { VibraTheme } from "@/components/menu/themes/VibraTheme";
import { LanguageSwitcher } from "@/components/menu/LanguageSwitcher";
import { MenuFooter } from "@/components/menu/MenuFooter";
import { LightboxPortal } from "@/components/menu/ImageLightbox";
import type { Metadata } from "next";
import "@/components/menu/themes/fonts.css";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; menu?: string }>;
}

async function getTenantBySlug(slug: string) {
  return db.query.tenants.findFirst({
    where: eq(tenants.slug, slug),
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    return {
      title: "Menu not found",
      robots: { index: false },
    };
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.app";

  const title = tenant.name;
  const description =
    tenant.description || `View the menu for ${tenant.name}`;

  // Use custom domain if set, else app URL
  const canonicalBase = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : APP_URL;
  const canonicalUrl = `${canonicalBase}/r/${slug}`;

  const ogImage = tenant.logoUrl
    ? { url: tenant.logoUrl, width: 400, height: 400, alt: tenant.name }
    : tenant.coverImageUrl
    ? { url: tenant.coverImageUrl, width: 1200, height: 630, alt: tenant.name }
    : { url: `${APP_URL}/og-image.png`, width: 1200, height: 630, alt: `${tenant.name} — ${APP_NAME}` };

  // Build hreflang alternates for enabled languages
  const enabledLanguages = (tenant.enabledLanguages as string[]) || ["en"];
  const languageAlternates =
    enabledLanguages.length > 1
      ? enabledLanguages.reduce<Record<string, string>>((acc, lang) => {
          acc[lang] =
            lang === "en"
              ? canonicalUrl
              : `${APP_URL}/r/${slug}?lang=${lang}`;
          return acc;
        }, {})
      : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export const revalidate = 60; // ISR: regenerate every 60 seconds

export default async function PublicMenuPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { lang, menu: menuId } = await searchParams;

  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const enabledLanguages = (tenant.enabledLanguages as string[]) || ["en"];
  const currentLanguage =
    lang && enabledLanguages.includes(lang)
      ? lang
      : tenant.defaultLanguage || "en";

  // Fetch menu data
  const [menuList, categoryList, itemList] = await Promise.all([
    db.query.menus.findMany({
      where: and(eq(menus.tenantId, tenant.id), eq(menus.isActive, true)),
      orderBy: [asc(menus.sortOrder)],
    }),
    db.query.categories.findMany({
      where: eq(categories.tenantId, tenant.id),
      orderBy: [asc(categories.sortOrder)],
    }),
    db.query.items.findMany({
      where: eq(items.tenantId, tenant.id),
      orderBy: [asc(items.sortOrder)],
    }),
  ]);

  // Fetch translations for current language
  let translationList: Awaited<ReturnType<typeof db.query.translations.findMany>> = [];
  if (currentLanguage !== "en") {
    translationList = await db.query.translations.findMany({
      where: and(
        eq(translations.tenantId, tenant.id),
        eq(translations.language, currentLanguage)
      ),
    });
  }

  // Log view (fire-and-forget)
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || null;
  const referer = headersList.get("referer") || null;
  db.insert(menuViews)
    .values({
      tenantId: tenant.id,
      menuId: menuList[0]?.id || null,
      userAgent,
      language: currentLanguage,
      referrer: referer,
    })
    .execute()
    .catch(() => {}); // Silently ignore errors

  const currentMenuId = menuId || menuList[0]?.id || null;

  const themeProps = {
    tenant,
    menus: menuList,
    categories: categoryList,
    items: itemList,
    translations: translationList,
    currentLanguage,
    currentMenuId,
  };

  const ThemeComponent = {
    classic: ClassicTheme,
    modern: ModernTheme,
    dark: DarkTheme,
    bistro: BistroTheme,
    nordic: NordicTheme,
    neon: NeonTheme,
    rustic: RusticTheme,
    zen: ZenTheme,
    luxe: LuxeTheme,
    vibra: VibraTheme,
  }[tenant.themeId] || ModernTheme;

  // Structured data (JSON-LD) for Restaurant schema
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonicalBase = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : APP_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: tenant.name,
    ...(tenant.description ? { description: tenant.description } : {}),
    ...(tenant.address ? { address: { "@type": "PostalAddress", streetAddress: tenant.address } } : {}),
    ...(tenant.phone ? { telephone: tenant.phone } : {}),
    ...(tenant.logoUrl ? { image: tenant.logoUrl, logo: tenant.logoUrl } : {}),
    url: `${canonicalBase}/r/${slug}`,
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: categoryList
        .filter((c) => c.menuId === currentMenuId)
        .map((cat) => ({
          "@type": "MenuSection",
          name: cat.name,
          hasMenuItem: itemList
            .filter((i) => i.categoryId === cat.id && i.isAvailable)
            .map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              ...(item.description ? { description: item.description } : {}),
              ...(item.price
                ? {
                    offers: {
                      "@type": "Offer",
                      price: item.price,
                      priceCurrency: item.currency || "USD",
                    },
                  }
                : {}),
            })),
        })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LanguageSwitcher
        enabledLanguages={enabledLanguages}
        currentLanguage={currentLanguage}
        currentMenuId={currentMenuId}
      />
      <ThemeComponent {...themeProps} />
      <MenuFooter plan={tenant.plan} />
      <LightboxPortal />
    </>
  );
}
