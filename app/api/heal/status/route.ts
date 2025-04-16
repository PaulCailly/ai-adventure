import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getHealTimestamp } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const characterId = searchParams.get("characterId");
  if (!characterId) {
    return NextResponse.json(
      { error: "Missing characterId parameter" },
      { status: 400 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cooldownMs = 2 * 60 * 60 * 1000;
  const healRecord = await getHealTimestamp({ characterId });
  const lastHeal = healRecord ? new Date(healRecord.lastHeal).getTime() : 0;
  const now = Date.now();

  let remaining = 0;
  if (now - lastHeal < cooldownMs) {
    remaining = Math.ceil((cooldownMs - (now - lastHeal)) / 1000);
  }

  return NextResponse.json({ cooldownRemaining: remaining });
}
