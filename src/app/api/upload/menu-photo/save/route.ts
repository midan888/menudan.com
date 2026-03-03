import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { menus, categories, items, tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface SaveItem {
  name: string;
  description: string;
  price: number;
}

interface SaveCategory {
  name: string;
  items: SaveItem[];
}

interface SaveBody {
  menuId?: string; // existing menu to merge into, or null for new menu
  menuName?: string;
  currency: string;
  categories: SaveCategory[];
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();
    const body: SaveBody = await request.json();

    if (!body.categories || body.categories.length === 0) {
      return NextResponse.json(
        { error: "No categories to save" },
        { status: 400 }
      );
    }

    let menuId = body.menuId;

    // Create new menu if no existing menu selected
    if (!menuId) {
      const existing = await db.query.menus.findMany({
        where: eq(menus.tenantId, tenant.id),
      });
      const [menu] = await db
        .insert(menus)
        .values({
          tenantId: tenant.id,
          name: body.menuName || "Uploaded Menu",
          sortOrder: existing.length,
        })
        .returning();
      menuId = menu.id;
    }

    // Get current max sort order for categories in this menu
    const existingCats = await db.query.categories.findMany({
      where: eq(categories.menuId, menuId),
    });
    let catSort = existingCats.reduce(
      (max, c) => Math.max(max, c.sortOrder),
      -1
    );

    // Insert categories and items
    let totalItems = 0;
    for (const cat of body.categories) {
      catSort++;
      const [newCat] = await db
        .insert(categories)
        .values({
          menuId,
          tenantId: tenant.id,
          name: cat.name,
          sortOrder: catSort,
        })
        .returning();

      for (let i = 0; i < cat.items.length; i++) {
        const item = cat.items[i];
        await db.insert(items).values({
          categoryId: newCat.id,
          tenantId: tenant.id,
          name: item.name,
          description: item.description || null,
          price: String(item.price || 0),
          currency: body.currency || "USD",
          sortOrder: i,
        });
        totalItems++;
      }
    }

    // Enable the detected currency on the tenant if not already enabled
    const currency = body.currency || "USD";
    const enabled = (tenant.enabledCurrencies as string[]) || ["USD"];
    if (!enabled.includes(currency)) {
      await db
        .update(tenants)
        .set({ enabledCurrencies: [...enabled, currency] })
        .where(eq(tenants.id, tenant.id));
    }

    return NextResponse.json({
      menuId,
      categoriesCreated: body.categories.length,
      itemsCreated: totalItems,
    });
  } catch (error) {
    console.error("Save extracted menu error:", error);
    const message =
      error instanceof Error ? error.message : "Save failed";
    if (message === "NO_TENANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
