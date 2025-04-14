import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";

import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return redirect("/");
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  return (
    <div className="max-w-[430px] h-screen max-h-[932px] m-auto overflow-hidden border">
      <ScrollArea>
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messagesFromDb)}
        />
        <DataStreamHandler id={id} />
      </ScrollArea>
    </div>
  );
}
