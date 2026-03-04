import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, tenants, items } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { deleteFromS3 } from "@/lib/s3";

function extractS3Key(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Remove leading slash from pathname
    return parsed.pathname.replace(/^\/[^/]+\//, "").replace(/^\//, "");
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find the user's tenant
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.ownerId, userId),
    });

    if (tenant) {
      // Collect all S3 image keys for cleanup
      const s3Keys: string[] = [];

      // Tenant images
      const logoKey = extractS3Key(tenant.logoUrl);
      const coverKey = extractS3Key(tenant.coverImageUrl);
      if (logoKey) s3Keys.push(logoKey);
      if (coverKey) s3Keys.push(coverKey);

      // Item images
      const tenantItems = await db
        .select({ imageUrl: items.imageUrl })
        .from(items)
        .where(eq(items.tenantId, tenant.id));

      for (const item of tenantItems) {
        const key = extractS3Key(item.imageUrl);
        if (key) s3Keys.push(key);
      }

      // Delete S3 objects (best-effort, don't block on failures)
      await Promise.allSettled(s3Keys.map((key) => deleteFromS3(key)));

      // Delete tenant (cascades to menus, categories, items, translations, menuViews)
      await db.delete(tenants).where(eq(tenants.id, tenant.id));
    }

    // Delete user (cascades to accounts, sessions, verificationTokens)
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
