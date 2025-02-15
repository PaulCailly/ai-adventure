import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { inventoryItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  // Ensure the user is authenticated.
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    // Delete the inventory item (for "use" action).
    await db.delete(inventoryItem).where(eq(inventoryItem.id, itemId));

    return NextResponse.json({ message: "Item used successfully" });
  } catch (error) {
    console.error("Error using inventory item", error);
    return NextResponse.json(
      { error: "Failed to use inventory item" },
      { status: 500 }
    );
  }
}
