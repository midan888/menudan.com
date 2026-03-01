import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants, translations } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { LanguagesView } from "@/components/dashboard/LanguagesView";

export default async function LanguagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, session.user.id),
  });
  if (!tenant) redirect("/onboarding");

  const enabledLanguages = (tenant.enabledLanguages as string[]) || ["en"];

  // Get translation counts per language
  const counts = await db
    .select({
      language: translations.language,
      count: sql<number>`count(*)::int`,
    })
    .from(translations)
    .where(eq(translations.tenantId, tenant.id))
    .groupBy(translations.language);

  const translationCounts: Record<string, number> = {};
  for (const row of counts) {
    translationCounts[row.language] = row.count;
  }

  return (
    <LanguagesView
      defaultLanguage={tenant.defaultLanguage || "en"}
      enabledLanguages={enabledLanguages}
      translationCounts={translationCounts}
    />
  );
}
