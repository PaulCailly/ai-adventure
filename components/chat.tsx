"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";

import { Messages } from "./messages";
import { VisibilityType } from "./visibility-selector";
import { ChatHeader } from "./chat-header";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
}) {
  const { mutate } = useSWRConfig();

  const { messages, setMessages, append, isLoading, reload } = useChat({
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    onFinish: () => {
      mutate("/api/history");
    },
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader />
        <Messages isLoading={isLoading} messages={messages} append={append} />
      </div>
    </>
  );
}
