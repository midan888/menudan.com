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
import { LanguageSwitcher } from "@/components/menu/LanguageSwitcher";
import { MenuFooter } from "@/components/menu/MenuFooter";
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
  if (!tenant) return {};

  const title = tenant.name;
  const description =
    tenant.description || `View the menu for ${tenant.name}`;
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "MenuForYou",
      type: "website",
      ...(tenant.logoUrl ? { images: [{ url: tenant.logoUrl }] } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
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
  }[tenant.themeId] || ModernTheme;

  return (
    <>
      <LanguageSwitcher
        enabledLanguages={enabledLanguages}
        currentLanguage={currentLanguage}
        currentMenuId={currentMenuId}
      />
      <ThemeComponent {...themeProps} />
      <MenuFooter plan={tenant.plan} />
    </>
  );
}
