"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";
import { useEffect, useRef, useState } from "react";

import { Messages } from "./market-messages";

type ChatProps = {
  id: string;
  characterId: string;
  initialMessages: Array<Message>;
};

export function Chat({ id, characterId, initialMessages }: ChatProps) {
  const { mutate } = useSWRConfig();

  const { messages, append, isLoading } = useChat({
    id,
    api: "/api/market",
    body: { id, modelId: "gpt-4o", characterId },
    initialMessages,

    onFinish: () => {
      mutate("/api/history");
    },
  });

  const [audio] = useState(
    typeof Audio !== "undefined" ? new Audio("/market.mp3") : null
  );

  // Use a ref to persist the playing state across renders.
  const isPlayingRef = useRef(false);

  // Initial audio setup
  useEffect(() => {
    if (audio) {
      audio.loop = true;
      audio.volume = 0.5; // Adjust volume as needed
    }
  }, [audio]);

  // Manage audio playback
  useEffect(() => {
    if (audio && messages.length > 0 && !isPlayingRef.current) {
      audio
        .play()
        .then(() => {
          isPlayingRef.current = true;
        })
        .catch((e) => {});
    }
  }, [audio, messages.length]);

  // Cleanup on unmount: pause audio.
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        isPlayingRef.current = false;
      }
    };
  }, [audio]);

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages
        id={id}
        isLoading={isLoading}
        messages={messages}
        append={append}
      />
    </div>
  );
}
