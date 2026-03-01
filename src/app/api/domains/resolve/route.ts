import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/domains/resolve?domain=x — resolve custom domain to tenant slug (public, used by middleware)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "domain required" }, { status: 400 });
  }

  const tenant = await db.query.tenants.findFirst({
    where: and(
      eq(tenants.customDomain, domain),
      eq(tenants.domainVerified, true)
    ),
  });

  if (!tenant) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  return NextResponse.json({ slug: tenant.slug });
}
