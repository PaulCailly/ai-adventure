import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { discardItem } from "@/lib/db/queries";

export async function DELETE(request: Request) {
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

    const result = await discardItem({ itemId });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error discarding inventory item", error);
    return NextResponse.json(
      { error: "Failed to discard inventory item" },
      { status: 500 }
    );
  }
}
