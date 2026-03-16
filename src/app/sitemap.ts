import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { articles } from "./blog/_data/articles";
import { VALID_THEMES } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static pages — update this date when landing/auth page content changes
  const SITE_UPDATED = new Date("2026-03-16");
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...VALID_THEMES.map((theme) => ({
      url: `${baseUrl}/demo/${theme}`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Dynamic restaurant menu pages
  const allTenants = await db.select({ slug: tenants.slug, updatedAt: tenants.updatedAt }).from(tenants);

  const menuPages: MetadataRoute.Sitemap = allTenants.map((t) => ({
    url: `${baseUrl}/r/${t.slug}`,
    lastModified: t.updatedAt || new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...menuPages];
}
