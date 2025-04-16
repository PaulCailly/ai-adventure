import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { inventoryItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateHero } from "@/lib/db/queries";

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
    const [item] = await db
      .select()
      .from(inventoryItem)
      .where(eq(inventoryItem.id, itemId));
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const sellValues: Record<string, number> = {
      common: 10,
      uncommon: 25,
      rare: 50,
      epic: 100,
      legendary: 200,
    };
    const sellValue = sellValues[item.rarity.toLowerCase()] || 0;
    await db.delete(inventoryItem).where(eq(inventoryItem.id, itemId));
    await updateHero({
      heroId: item.characterId,
      health: 0,
      mana: 0,
      gold: sellValue,
    });
    return NextResponse.json({
      message: `Item sold successfully. You received ${sellValue} gold.`,
    });
  } catch (error) {
    console.error("Error selling inventory item", error);
    return NextResponse.json(
      { error: "Failed to sell inventory item" },
      { status: 500 }
    );
  }
}
