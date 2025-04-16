import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  getCharacterById,
  updateHero,
  getHealTimestamp,
  upsertHealTimestamp,
} from "@/lib/db/queries";

export async function POST(request: Request) {
  try {
    const { characterId } = await request.json();
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const character = await getCharacterById({ id: characterId });
    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }

    // Ensure health does not exceed 100
    if (character.health >= 100) {
      return NextResponse.json(
        { success: false, message: "Votre santé est déjà à 100." },
        { status: 400 }
      );
    }

    // Calculate heal amount (maximum of 50) but cap so that health does not exceed 100.
    const desiredHeal = 50;
    const healAmount = Math.min(desiredHeal, 100 - character.health);

    // Compute cooldown (2 hours in milliseconds)
    const cooldown = 2 * 60 * 60 * 1000;
    const now = Date.now();

    // Get stored heal timestamp from the database
    const healRecord = await getHealTimestamp({ characterId });
    const lastHeal = healRecord ? new Date(healRecord.lastHeal).getTime() : 0;

    if (now - lastHeal < cooldown) {
      const remainingMinutes = Math.ceil(
        (cooldown - (now - lastHeal)) / (60 * 1000)
      );
      return NextResponse.json(
        {
          success: false,
          message: `Vous devez attendre encore ${remainingMinutes} minutes avant de pouvoir vous soigner.`,
        },
        { status: 429 }
      );
    }

    // Update heal timestamp in the database
    await upsertHealTimestamp({ characterId, lastHeal: new Date() });

    // Heal the character using updateHero
    const resultMessage = await updateHero({
      heroId: characterId,
      health: healAmount,
    });
    // Calculate new health (ensuring it does not exceed 100)
    const newHealth = Math.min(character.health + healAmount, 100);

    return NextResponse.json({
      success: true,
      message: "Vous avez été soigné.",
      newHealth,
      healAmount,
    });
  } catch (error) {
    console.error("Error in healing API:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors du processus de soins." },
      { status: 500 }
    );
  }
}
