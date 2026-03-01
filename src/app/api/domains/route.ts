import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PLAN_LIMITS } from "@/lib/constants";
import type { PlanType } from "@/lib/constants";

// POST /api/domains — set custom domain
export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();

    const limits = PLAN_LIMITS[tenant.plan as PlanType] || PLAN_LIMITS.free;
    if (!limits.customDomain) {
      return NextResponse.json(
        { error: "Custom domains require a Pro or Business plan." },
        { status: 403 }
      );
    }

    const { domain } = await request.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "domain is required" },
        { status: 400 }
      );
    }

    // Basic domain validation
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check if domain is already in use by another tenant
    const existing = await db.query.tenants.findFirst({
      where: eq(tenants.customDomain, domain),
    });

    if (existing && existing.id !== tenant.id) {
      return NextResponse.json(
        { error: "This domain is already in use by another restaurant." },
        { status: 409 }
      );
    }

    const [updated] = await db
      .update(tenants)
      .set({
        customDomain: domain,
        domainVerified: false,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenant.id))
      .returning();

    return NextResponse.json({
      domain: updated.customDomain,
      verified: updated.domainVerified,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NO_TENANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/domains — remove custom domain
export async function DELETE() {
  try {
    const tenant = await requireTenant();

    await db
      .update(tenants)
      .set({
        customDomain: null,
        domainVerified: false,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenant.id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
