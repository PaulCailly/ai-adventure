import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { inventoryItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateHero, getCharacterById } from "@/lib/db/queries";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { zones } from "@/lib/ai/zones";
import { z } from "zod";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    // Retrieve the item from the database
    const [item] = await db
      .select()
      .from(inventoryItem)
      .where(eq(inventoryItem.id, itemId));
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    if (item.identified) {
      return NextResponse.json(
        { error: "Item is already identified" },
        { status: 400 }
      );
    }

    // Load the character linked to the item
    const character = await getCharacterById({ id: item.characterId });
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Determine the identification cost based on rarity
    const identificationCosts: Record<string, number> = {
      common: 10,
      uncommon: 25,
      rare: 50,
      epic: 100,
      legendary: 200,
    };
    const cost = identificationCosts[item.rarity.toLowerCase()] || 50;

    if (character.gold < cost) {
      return NextResponse.json(
        { error: "Not enough gold to identify the item" },
        { status: 400 }
      );
    }

    // Deduct the gold cost from the character (assumes updateHero can handle negative adjustments)
    await updateHero({
      heroId: character.id,
      gold: -cost,
      health: 0,
      mana: 0,
    });

    // Build a prompt for item identification using all characteristics of the item
    const prompt = `
You are an expert in identifying mystical items.
The player presents you with an unidentified item of rarity "${item.rarity}".
Item characteristics: ${item.name}, Buffs - ${JSON.stringify(
      item.buffs
    )}, Quality - ${item.rarity}
Item types and their base names:
- Weapon: ["Épée", "Hache", "Dague", "Lance", "Arc", "Masse", "Faux", "Bâton", "Fléau", "Glaive", "Sabre", "Katana", "Trident", "Couteau", "Marteau", "Pique", "Rapière", "Épieu", "Gourdin", "Fronde", "Arbalète", "Cimeterre", "Claymore", "Estoc", "Javelot"]
- Armor: ["Plastron", "Heaume", "Grèves", "Cuirasse", "Casque", "Jambières", "Gantelets", "Bouclier", "Brassards", "Cotte", "Targe", "Pansière", "Spallières", "Gorgerin", "Cuissardes", "Brassière", "Vambraces", "Haubert", "Gambison", "Brigandine", "Camisole", "Cagoule", "Cervelière", "Cuirasse", "Garde"]
- Accessory: ["Bague", "Amulette", "Bracelet", "Collier", "Talisman", "Médaillon", "Broche", "Pendentif", "Charme", "Gemme", "Sceau", "Diadème", "Anneau", "Bijou", "Ornement", "Chapelet"]

Item qualities and their distributions:
- Common: { attack: 0.3, defense: 0.3, health: 0.25, mana: 0.075, speed: 0.075 }
- Uncommon: { attack: 0.28, defense: 0.28, health: 0.27, mana: 0.085, speed: 0.085 }
- Rare: { attack: 0.26, defense: 0.26, health: 0.3, mana: 0.09, speed: 0.09 }
- Epic: { attack: 0.24, defense: 0.24, health: 0.32, mana: 0.1, speed: 0.1 }
- Legendary: { attack: 0.22, defense: 0.22, health: 0.34, mana: 0.11, speed: 0.11 }

Based on the lore of the Forest of Ancient Whispers (below), assign it an evocative name that reflects its rarity and a detailed description of less than 140 characters incorporating fantastical and mysterious elements.
Forest lore:
${zones.forest.lore}
`;

    // Call AI SDK to generate the item details using generateObject
    const result = await generateObject({
      model: openai("gpt-4"),
      system: "You are an expert in identifying mystical items.",
      prompt,
      schema: z.object({
        name: z
          .string()
          .describe(
            "The name of the item. It should match the rarity of the item."
          ),
        description: z
          .string()
          .describe(
            "A very short sentence about the item, it can be a formal description, a quote from a famous character of the lore, an anecdote, a funny sentence etc..."
          ),
      }),
    });

    const { name: newName, description: newDescription } = result.object;

    // Update the item record to mark it as identified and update its details
    await db
      .update(inventoryItem)
      .set({
        identified: true,
        name: newName,
        description: newDescription,
      })
      .where(eq(inventoryItem.id, itemId));

    // Respond with the new item details
    return NextResponse.json({ name: newName, description: newDescription });
  } catch (error: any) {
    console.error("Error identifying item:", error);
    return NextResponse.json(
      { error: "Failed to identify item", details: error.message },
      { status: 500 }
    );
  }
}
