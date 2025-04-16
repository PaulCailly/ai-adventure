import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { inventoryItem } from "@/lib/db/schema";
import { getCharacterById, updateHero } from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Expecting the request to include both the characterId and the details of the item to buy.
    const { characterId, item } = await request.json();

    if (!characterId || !item) {
      return NextResponse.json(
        { error: "Missing characterId or item details" },
        { status: 400 }
      );
    }

    // Validate necessary item fields
    const { name, rarity, description, itemType, buffs } = item;
    if (!name || !rarity || !description || !itemType) {
      return NextResponse.json(
        { error: "Missing item properties" },
        { status: 400 }
      );
    }

    // Retrieve the character to verify gold
    const character = await getCharacterById({ id: characterId });
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Determine the purchase cost based on item rarity. (Values can be adjusted)
    const buyValues: Record<string, number> = {
      common: 15,
      uncommon: 40,
      rare: 80,
      epic: 160,
      legendary: 300,
    };
    const cost = buyValues[rarity.toLowerCase()] || 50;

    if (character.gold < cost) {
      return NextResponse.json(
        { error: "Not enough gold to purchase the item" },
        { status: 400 }
      );
    }

    // Deduct the gold cost from the character.
    await updateHero({
      heroId: character.id,
      gold: -cost,
      health: 0,
      mana: 0,
    });

    // Create a new inventory item record.
    const newItem = {
      id: generateUUID(),
      characterId: character.id,
      name,
      identified: true, // Purchased items are identified immediately
      rarity,
      description,
      itemType: itemType as "consumable" | "equipable" | "passive",
      buffs: buffs || {},
      // You might need to include additional fields like createdAt depending on your schema.
    };

    await db.insert(inventoryItem).values(newItem);

    return NextResponse.json({
      message: `Item purchased successfully. You spent ${cost} gold.`,
      item: newItem,
    });
  } catch (error: any) {
    console.error("Error purchasing inventory item", error);
    return NextResponse.json(
      { error: "Failed to purchase inventory item", details: error.message },
      { status: 500 }
    );
  }
}
