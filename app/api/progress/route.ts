import { NextResponse } from "next/server";
import {
  getGlobalProgress,
  createGlobalProgress,
  updateGlobalProgress,
} from "@/lib/db/queries";

// Returns the current global XP, updating passive XP (1 XP per second)
export async function GET() {
  try {
    const now = new Date();
    let progress = await getGlobalProgress();

    // If no record exists yet (first call) insert one…
    if (!progress) {
      const [inserted] = await createGlobalProgress();
      progress = inserted;
    }

    const lastUpdated = new Date(progress.lastUpdated);
    const passiveIncrement = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / 1000
    );
    let newXp = progress.xp;

    // Add passive XP if any seconds elapsed.
    if (passiveIncrement > 0) {
      newXp += passiveIncrement;
      await updateGlobalProgress({
        xp: newXp,
        lastUpdated: now,
      });
    }
    return NextResponse.json({ xp: newXp });
  } catch (error) {
    console.error("Error fetching global progress:", error);
    return NextResponse.error();
  }
}

// Increments the global XP by a given amount (active progress)
// The request body should be a JSON object like: { "increment": 1 }
export async function POST(request: Request) {
  try {
    const { increment } = await request.json();
    const now = new Date();
    let progress = await getGlobalProgress();
    if (!progress) {
      const [inserted] = await createGlobalProgress();
      progress = inserted;
    }
    const lastUpdated = new Date(progress.lastUpdated);
    const passiveIncrement = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / 1000
    );
    let newXp = progress.xp + passiveIncrement + Number(increment);

    // Update both xp and lastUpdated timestamp.
    await updateGlobalProgress({
      xp: newXp,
      lastUpdated: now,
    });

    return NextResponse.json({ xp: newXp });
  } catch (error) {
    console.error("Error updating global progress:", error);
    return NextResponse.error();
  }
}
