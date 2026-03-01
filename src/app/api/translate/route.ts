import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import {
  translations,
  categories,
  items,
  menus,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { batchTranslate } from "@/lib/translate";

// GET /api/translate?lang=xx — list translations for a language
export async function GET(request: Request) {
  try {
    const tenant = await requireTenant();
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang");

    if (!lang) {
      return NextResponse.json(
        { error: "lang parameter required" },
        { status: 400 }
      );
    }

    const list = await db.query.translations.findMany({
      where: and(
        eq(translations.tenantId, tenant.id),
        eq(translations.language, lang)
      ),
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/translate — trigger translation for a language
export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();
    const body = await request.json();
    const { language } = body as { language: string };

    if (!language) {
      return NextResponse.json(
        { error: "language is required" },
        { status: 400 }
      );
    }

    const enabledLanguages = (tenant.enabledLanguages as string[]) || ["en"];
    if (!enabledLanguages.includes(language)) {
      return NextResponse.json(
        { error: "Language not enabled for this restaurant" },
        { status: 400 }
      );
    }

    const sourceLanguage = tenant.defaultLanguage || "en";
    if (language === sourceLanguage) {
      return NextResponse.json(
        { error: "Cannot translate to the same language" },
        { status: 400 }
      );
    }

    // Gather all translatable content
    const [menuList, categoryList, itemList] = await Promise.all([
      db.query.menus.findMany({
        where: eq(menus.tenantId, tenant.id),
      }),
      db.query.categories.findMany({
        where: eq(categories.tenantId, tenant.id),
      }),
      db.query.items.findMany({
        where: eq(items.tenantId, tenant.id),
      }),
    ]);

    const entities: {
      entityType: string;
      entityId: string;
      field: string;
      value: string;
    }[] = [];

    for (const menu of menuList) {
      if (menu.name) entities.push({ entityType: "menu", entityId: menu.id, field: "name", value: menu.name });
    }

    for (const cat of categoryList) {
      if (cat.name) entities.push({ entityType: "category", entityId: cat.id, field: "name", value: cat.name });
      if (cat.description) entities.push({ entityType: "category", entityId: cat.id, field: "description", value: cat.description });
    }

    for (const item of itemList) {
      if (item.name) entities.push({ entityType: "item", entityId: item.id, field: "name", value: item.name });
      if (item.description) entities.push({ entityType: "item", entityId: item.id, field: "description", value: item.description });
    }

    if (entities.length === 0) {
      return NextResponse.json({ message: "No content to translate", count: 0 });
    }

    await batchTranslate(tenant.id, sourceLanguage, language, entities);

    return NextResponse.json({
      message: "Translation complete",
      count: entities.length,
    });
  } catch (error) {
    console.error("Translation error:", error);
    const message = error instanceof Error ? error.message : "Translation failed";
    if (message === "NO_TENANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
