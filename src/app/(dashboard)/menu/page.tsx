import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants, menus, categories, items } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { MenuBuilder } from "@/components/dashboard/MenuBuilder";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, session.user.id),
  });
  if (!tenant) redirect("/onboarding");

  const menuList = await db.query.menus.findMany({
    where: eq(menus.tenantId, tenant.id),
    orderBy: [asc(menus.sortOrder)],
  });

  const categoryList = await db.query.categories.findMany({
    where: eq(categories.tenantId, tenant.id),
    orderBy: [asc(categories.sortOrder)],
  });

  const itemList = await db.query.items.findMany({
    where: eq(items.tenantId, tenant.id),
    orderBy: [asc(items.sortOrder)],
  });

  return (
    <MenuBuilder
      initialMenus={menuList}
      initialCategories={categoryList}
      initialItems={itemList}
      enabledCurrencies={(tenant.enabledCurrencies as string[]) || ["USD"]}
      defaultCurrency={tenant.defaultCurrency || "USD"}
    />
  );
}
