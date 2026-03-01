import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { QRCodeView } from "@/components/dashboard/QRCodeView";

export default async function QRPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, session.user.id),
  });
  if (!tenant) redirect("/onboarding");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const menuUrl =
    tenant.customDomain && tenant.domainVerified
      ? `https://${tenant.customDomain}`
      : `${baseUrl}/r/${tenant.slug}`;

  return <QRCodeView menuUrl={menuUrl} slug={tenant.slug} />;
}
