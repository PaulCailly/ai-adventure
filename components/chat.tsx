"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";

import { Messages } from "./messages";

type ChatProps = {
  id: string;
  initialMessages: Array<Message>;
};

export function Chat({ id, initialMessages }: ChatProps) {
  const { mutate } = useSWRConfig();

  const { messages, append, isLoading } = useChat({
    id,
    body: { id, modelId: "gpt-4o" },
    initialMessages,
    onFinish: () => {
      mutate("/api/history");
    },
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <Messages
          id={id}
          isLoading={isLoading}
          messages={messages}
          append={append}
        />
      </div>
    </>
  );
}
