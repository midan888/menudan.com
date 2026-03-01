import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface ExtractedItem {
  name: string;
  description: string;
  price: number;
}

export interface ExtractedCategory {
  name: string;
  items: ExtractedItem[];
}

export interface ExtractionResult {
  categories: ExtractedCategory[];
  currency: string;
  notes: string;
}

const EXTRACTION_PROMPT = `You are a menu extraction assistant. Analyze this restaurant menu image and extract ALL menu items.

Return ONLY valid JSON in this exact format:
{
  "categories": [
    {
      "name": "Category Name",
      "items": [
        {
          "name": "Item Name",
          "description": "Brief description if visible, otherwise empty string",
          "price": 12.50
        }
      ]
    }
  ],
  "currency": "USD",
  "notes": "Any relevant notes about the extraction, e.g. items that were unclear"
}

Rules:
- Extract every item visible on the menu
- Preserve the original language of item names
- Convert all prices to numbers (no currency symbols)
- Detect the currency from symbols or context (USD, EUR, GBP, AMD, RUB, etc.)
- If a price is unclear or missing, set it to 0 and note it
- Group items into their original categories as shown on the menu
- If no clear categories exist, group logically (Starters, Mains, Desserts, Drinks)
- Return ONLY the JSON, no other text`;

export async function extractMenuFromImage(
  imageBase64: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<ExtractionResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  // Parse JSON from response, handling possible markdown code blocks
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const result: ExtractionResult = JSON.parse(jsonStr);

  // Validate structure
  if (!Array.isArray(result.categories)) {
    throw new Error("Invalid extraction result: missing categories array");
  }

  return result;
}
