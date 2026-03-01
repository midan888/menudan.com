import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { extractMenuFromImage } from "@/lib/ai";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

type AllowedType = (typeof ALLOWED_TYPES)[number];

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();

    // Plan enforcement: free tier gets 1 AI upload
    if (tenant.plan === "free" && (tenant.aiUploadsUsed ?? 0) >= 1) {
      return NextResponse.json(
        { error: "Free plan allows 1 AI upload. Upgrade for unlimited." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum 10MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const result = await extractMenuFromImage(
      base64,
      file.type as AllowedType
    );

    // Increment AI upload count (fire-and-forget)
    const { db } = await import("@/lib/db");
    const { tenants } = await import("@/lib/db/schema");
    const { eq, sql } = await import("drizzle-orm");
    db.update(tenants)
      .set({ aiUploadsUsed: sql`COALESCE(${tenants.aiUploadsUsed}, 0) + 1` })
      .where(eq(tenants.id, tenant.id))
      .execute()
      .catch(() => {});

    return NextResponse.json(result);
  } catch (error) {
    console.error("Menu photo extraction error:", error);
    const message =
      error instanceof Error ? error.message : "Extraction failed";
    if (message === "NO_TENANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
