"use client";

import type { Message } from "ai";
import { useChat } from "ai/react";
import { useSWRConfig } from "swr";
import { useEffect, useState } from "react";

import { Messages } from "./adventure-messages";
import { Button } from "@/components/ui/button"; // Import Button component

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

  // Check if the last message has no content
  const lastMessage = messages[messages.length - 1];
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    if (lastMessage && !lastMessage.content) {
      const timer = setTimeout(() => {
        setShowContinueButton(true);
      }, 3000); // Show button after 3 seconds

      return () => clearTimeout(timer);
    } else {
      setShowContinueButton(false);
    }
  }, [lastMessage]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <Messages
          id={id}
          isLoading={isLoading}
          messages={messages}
          append={append}
        />
        {showContinueButton && (
          <div className="flex flex-col justify-center items-center h-full">
            <Button
              variant="default"
              onClick={() => append({ role: "user", content: "continuer" })}
            >
              Continuer
            </Button>
            <div className="w-32 h-32 bg-gray-300 mt-4"></div>{" "}
            {/* Skeleton placeholder */}
          </div>
        )}
      </div>
    </>
  );
}
