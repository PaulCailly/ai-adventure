import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

// Use a global in-memory store for cooldown timestamps.
// This ensures the same object is used across multiple endpoints.
globalThis.healTimestamps = globalThis.healTimestamps || {};
const healTimestamps: { [characterId: string]: number } =
  globalThis.healTimestamps;

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

  const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const lastHeal = healTimestamps[characterId] || 0;
  const now = Date.now();
  let remaining = 0;
  if (now - lastHeal < cooldownMs) {
    remaining = Math.ceil((cooldownMs - (now - lastHeal)) / 1000); // remaining seconds
  }

  return NextResponse.json({ cooldownRemaining: remaining });
}
