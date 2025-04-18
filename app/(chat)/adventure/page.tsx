import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/adventure-chat";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCharactersByUserId } from "@/lib/db/queries";

// Define standard PageProps interface
// interface PageProps {
//   searchParams: { [key: string]: string | string[] | undefined };
// }

// Type searchParams as a Promise and await it (Next.js 15+)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const _searchParams = await searchParams; // Await the promise

  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const characters = await getCharactersByUserId({
    userId: session.user.id,
  });

  if (!characters || characters.length === 0) {
    return redirect("/");
  }

  const id = generateUUID();
  // Extract zoneId from the awaited searchParams
  const zoneId =
    typeof _searchParams?.zoneId === "string"
      ? _searchParams.zoneId
      : "tombe_dragon";

  return (
    <div className="max-w-[430px] h-screen max-h-[932px] m-auto overflow-hidden border overflow-y-scroll">
      <ScrollArea>
        <Chat
          key={id}
          id={id}
          characterId={characters[0].id}
          initialMessages={[]}
          zoneId={zoneId}
        />
        <DataStreamHandler id={id} />
      </ScrollArea>
    </div>
  );
}
