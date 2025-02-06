import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";

import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { getCharactersByUserId, getMostRecentChat } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InstallPrompt } from "@/app/components/Install-prompt";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const characters = await getCharactersByUserId({
    userId: session.user.id,
  });

  if (characters && characters.length > 0) {
    return redirect(`/character/${characters[0].id}`);
  }

  const id = generateUUID();

  return (
    <div className="max-w-[430px] h-screen max-h-[932px] m-auto overflow-hidden border">
      <ScrollArea>
        <Chat key={id} id={id} initialMessages={[]} />
        <DataStreamHandler id={id} />
      </ScrollArea>
      <InstallPrompt />
    </div>
  );
}
