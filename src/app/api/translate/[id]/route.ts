import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { translations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/translate/:id — edit a specific translation
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const body = await request.json();
    const { value } = body as { value: string };

    if (typeof value !== "string") {
      return NextResponse.json(
        { error: "value is required" },
        { status: 400 }
      );
    }

    const existing = await db.query.translations.findFirst({
      where: and(
        eq(translations.id, id),
        eq(translations.tenantId, tenant.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Translation not found" },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(translations)
      .set({
        value,
        isAutoTranslated: false, // Manual edit
        updatedAt: new Date(),
      })
      .where(eq(translations.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
