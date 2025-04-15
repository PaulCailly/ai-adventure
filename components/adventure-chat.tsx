"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";
import { useEffect, useState } from "react";

import { Messages } from "./adventure-messages";

type ChatProps = {
  id: string;
  characterId: string;
  initialMessages: Array<Message>;
};

export function Chat({ id, characterId, initialMessages }: ChatProps) {
  const { mutate } = useSWRConfig();

  const { messages, append, isLoading } = useChat({
    id,
    api: "/api/adventure",
    body: { id, modelId: "gpt-4o", characterId: characterId },
    initialMessages,

    onFinish: () => {
      mutate("/api/history");
    },
  });

  const [audio] = useState(
    typeof Audio !== "undefined" ? new Audio("/forest.mp3") : null
  );

  // Separate useEffect for initial audio setup
  useEffect(() => {
    if (audio) {
      audio.loop = true;
      audio.volume = 0.5; // Adjust volume as needed
    }
  }, [audio]);

  // Separate useEffect for audio playback
  useEffect(() => {
    let isPlaying = false;

    if (audio && messages.length === 1 && !isPlaying) {
      const playAttempt = async () => {
        try {
          await audio.play();
          isPlaying = true;
        } catch (e) {
          console.log("Audio playback failed:", e);
        }
      };
      playAttempt();
    }

    // Only stop audio when component unmounts, not on every message update
    return () => {
      if (audio && !messages.length) {
        // Only cleanup when there are no messages
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio, messages.length]);

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
