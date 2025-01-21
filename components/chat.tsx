"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import useSWR, { useSWRConfig } from "swr";

import type { Vote } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";

import { Messages } from "./messages";
import { VisibilityType } from "./visibility-selector";
import { ChatHeader } from "./chat-header";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
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

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher
  );

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
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
