import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { translations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface TranslationInput {
  [key: string]: string;
}

function getLanguageName(code: string): string {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code
  );
}

export async function translateContent(
  sourceLanguage: string,
  targetLanguage: string,
  input: TranslationInput
): Promise<TranslationInput> {
  const sourceName = getLanguageName(sourceLanguage);
  const targetName = getLanguageName(targetLanguage);

  const prompt = `Translate the following restaurant menu content from ${sourceName} to ${targetName}.

This is for a restaurant menu, so:
- Keep food item names that are commonly known in their original form (e.g., "Bruschetta" stays as "Bruschetta" in most languages)
- Translate descriptions naturally, not literally
- Maintain the same tone and style
- Keep it concise — this is for a mobile menu display

Input (JSON):
${JSON.stringify(input, null, 2)}

Return ONLY valid JSON in the same structure with translated values. Do not translate the JSON keys, only the values.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(jsonStr);
}

interface EntityTranslation {
  entityType: string;
  entityId: string;
  field: string;
  value: string;
}

export async function batchTranslate(
  tenantId: string,
  sourceLanguage: string,
  targetLanguage: string,
  entities: EntityTranslation[]
): Promise<void> {
  // Group entities into batches of ~20 to avoid overly large prompts
  const batchSize = 20;
  for (let i = 0; i < entities.length; i += batchSize) {
    const batch = entities.slice(i, i + batchSize);

    // Build input map: "entityType:entityId:field" -> value
    const input: TranslationInput = {};
    for (const e of batch) {
      input[`${e.entityType}:${e.entityId}:${e.field}`] = e.value;
    }

    const translated = await translateContent(
      sourceLanguage,
      targetLanguage,
      input
    );

    // Upsert translations
    for (const [key, value] of Object.entries(translated)) {
      const [entityType, entityId, field] = key.split(":");
      if (!entityType || !entityId || !field) continue;

      // Check if manual translation exists (don't overwrite)
      const existing = await db.query.translations.findFirst({
        where: and(
          eq(translations.tenantId, tenantId),
          eq(translations.language, targetLanguage),
          eq(translations.entityType, entityType),
          eq(translations.entityId, entityId),
          eq(translations.field, field)
        ),
      });

      if (existing && !existing.isAutoTranslated) {
        // Skip — manual edit should not be overwritten
        continue;
      }

      if (existing) {
        await db
          .update(translations)
          .set({ value, isAutoTranslated: true, updatedAt: new Date() })
          .where(eq(translations.id, existing.id));
      } else {
        await db.insert(translations).values({
          tenantId,
          language: targetLanguage,
          entityType,
          entityId,
          field,
          value,
          isAutoTranslated: true,
        });
      }
    }
  }
}
