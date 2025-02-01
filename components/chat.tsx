"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";
import { useEffect, useState } from "react";

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

  const [audio] = useState(
    typeof Audio !== "undefined" ? new Audio("/bg.mp3") : null
  );

  // Set up audio loop when component mounts
  useEffect(() => {
    if (audio) {
      audio.loop = true;
    }
  }, [audio]);

  // Play/pause audio based on first message arrival
  useEffect(() => {
    if (audio && messages.length === 1) {
      audio.play().catch((e) => console.log("Audio playback failed:", e));
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio, messages]);

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
