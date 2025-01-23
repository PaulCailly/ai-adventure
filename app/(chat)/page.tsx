import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";

import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { getMostRecentChat, getCharactersByChatId } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const mostRecentChat = await getMostRecentChat({ userId: session.user.id });

  if (mostRecentChat) {
    const characters = await getCharactersByChatId({
      chatId: mostRecentChat.id,
    });
    if (characters && characters.length > 0) {
      return redirect(`/character/${mostRecentChat.id}`);
    }
  }

  const id = generateUUID();

  return (
    <div className="max-w-[430px] h-screen max-h-[800px] mx-auto overflow-hidden border">
      <ScrollArea>
        <Chat key={id} id={id} initialMessages={[]} />
        <DataStreamHandler id={id} />
      </ScrollArea>
    </div>
  );
}
