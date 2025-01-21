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
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
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

        <Messages
          chatId={id}
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          append={append}
        />
      </div>
    </>
  );
}
