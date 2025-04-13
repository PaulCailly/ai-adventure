import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";

import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { getMostRecentChat } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const mostRecentChat = await getMostRecentChat({ userId: session.user.id });

  if (mostRecentChat) {
    return redirect(`/chat/${mostRecentChat.id}`);
  }

  const id = generateUUID();

  return (
    <>
      <Chat key={id} id={id} initialMessages={[]} />
      <DataStreamHandler id={id} />
    </>
  );
}
