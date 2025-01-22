import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";

import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { getMostRecentChat, getCharactersByChatId } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

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
    <>
      <Chat key={id} id={id} initialMessages={[]} />
      <DataStreamHandler id={id} />
    </>
  );
}
