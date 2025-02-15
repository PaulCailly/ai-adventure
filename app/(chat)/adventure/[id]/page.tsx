import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/adventure-chat";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function AdventurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const { id } = await params;
  const chat = await getChatById({ id });
  if (!chat) return notFound();
  const messagesFromDb = await getMessagesByChatId({ id });

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
