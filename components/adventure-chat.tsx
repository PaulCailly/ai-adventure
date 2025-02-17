"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";
import { useEffect, useRef, useState } from "react";

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
    body: { id, modelId: "gpt-4o", characterId },
    initialMessages,

    onFinish: () => {
      mutate("/api/history");
    },
  });

  /*   const [audio] = useState(
    typeof Audio !== "undefined" ? new Audio("/forest.mp3") : null
  );

  // Use a ref to persist the playing state across renders.
  const isPlayingRef = useRef(false);

  // Initial audio setup (loop and volume).
  useEffect(() => {
    if (audio) {
      audio.loop = true;
      audio.volume = 0.5; // Adjust volume as needed
      console.log("Audio is setup with loop and volume.");
    }
  }, [audio]);

  // Manage audio playback
  useEffect(() => {
    console.log(
      "Adventure audio effect triggered, messages length:",
      messages.length
    );
    if (audio && messages.length > 0 && !isPlayingRef.current) {
      console.log("Attempting to start audio playback for adventure chat.");
      audio
        .play()
        .then(() => {
          isPlayingRef.current = true;
          console.log("Adventure audio playback started successfully.");
        })
        .catch((e) => {
          console.error("Adventure audio playback failed:", e);
        });
    }
  }, [audio, messages.length]); */

  /*   // When the component unmounts, stop the audio.
  useEffect(() => {
    return () => {
      if (audio) {
        console.log("Adventure component unmounting, pausing audio.");
        audio.pause();
        audio.currentTime = 0;
        isPlayingRef.current = false;
      }
    };
  }, [audio]); */

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
