import { NextResponse } from "next/server";
import { getInventoryItemsByCharacterId } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const characterId = searchParams.get("characterId");
  if (!characterId) {
    return NextResponse.json({ error: "Missing characterId" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getInventoryItemsByCharacterId({ characterId });
    return NextResponse.json({ items });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch inventory items" },
      { status: 500 }
    );
  }
}
