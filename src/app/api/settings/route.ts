import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const tenant = await requireTenant();
    return NextResponse.json(tenant);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant();
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields: Record<string, unknown> = {};
    const editableKeys = [
      "name",
      "description",
      "logoUrl",
      "coverImageUrl",
      "address",
      "phone",
      "website",
      "openingHours",
      "themeId",
      "accentColor",
      "defaultLanguage",
      "enabledLanguages",
      "defaultCurrency",
      "enabledCurrencies",
    ];

    for (const key of editableKeys) {
      if (key in body) {
        allowedFields[key] = body[key];
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    allowedFields.updatedAt = new Date();

    const [updated] = await db
      .update(tenants)
      .set(allowedFields)
      .where(eq(tenants.id, tenant.id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
