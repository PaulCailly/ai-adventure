import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/adventure-chat";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCharactersByUserId } from "@/lib/db/queries";

// Define PageProps interface
interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Use PageProps for the component
export default async function Page({ searchParams }: PageProps) {
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
  const zoneId =
    typeof searchParams?.zoneId === "string"
      ? searchParams.zoneId
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
