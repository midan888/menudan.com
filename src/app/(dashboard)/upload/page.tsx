import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants, menus } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { AIUploadView } from "@/components/dashboard/AIUploadView";

export default async function UploadPage() {
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

  return (
    <AIUploadView
      menus={menuList}
      plan={tenant.plan}
      aiUploadsUsed={tenant.aiUploadsUsed}
    />
  );
}
