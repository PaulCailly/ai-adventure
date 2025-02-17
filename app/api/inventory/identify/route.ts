import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { identifyItem as identifyInventoryItem } from "@/lib/db/queries";

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

    const result = await identifyInventoryItem({ itemId });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error identifying item:", error);
    return NextResponse.json(
      { error: "Failed to identify item", details: error.message },
      { status: 500 }
    );
  }
}
