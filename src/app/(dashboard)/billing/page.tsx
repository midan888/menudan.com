import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BillingView } from "@/components/dashboard/BillingView";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, session.user.id),
  });
  if (!tenant) redirect("/onboarding");

  return (
    <BillingView currentPlan={tenant.plan} />
  );
}
