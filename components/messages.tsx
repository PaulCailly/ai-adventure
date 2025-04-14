/* eslint-disable @next/next/no-img-element */
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { PreviewMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface MessagesProps {
  isLoading: boolean;
  messages: Array<Message>;
  id: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureMessages({ isLoading, messages, append, id }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [audio] = useState(
    typeof Audio !== "undefined" ? new Audio("/bg.mp3") : null
  );

  // Set up audio loop when component mounts
  useEffect(() => {
    if (audio) {
      audio.loop = true;
    }
  }, [audio]);

  // Play/pause audio based on messages existence
  useEffect(() => {
    if (messages.length > 0 && audio) {
      audio.play().catch((e) => console.log("Audio playback failed:", e));
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [messages.length, audio]);

  const lastMessage = messages[messages.length - 1];

  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <img src="/images/logo.png" alt="Logo" className="size-48 mb-4" />
        <Input
          type="text"
          placeholder="Entrez votre nom"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() =>
            append({
              role: "user",
              content: `name = ${playerName}`,
            })
          }
          disabled={!playerName.trim()}
        >
          Entrer dans la Taverne
        </Button>
      </div>
    );
  }

  const showCharacterButton = lastMessage?.content
    .toLowerCase()
    .includes("pour l'aventure");

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {lastMessage && (
        <PreviewMessage
          key={lastMessage.id}
          message={lastMessage}
          isLoading={isLoading}
          append={append}
        />
      )}

      {showCharacterButton && (
        <div className="flex justify-center mb-4">
          <Button variant="default" onClick={() => router.refresh()}>
            Sortir de la Taverne
          </Button>
        </div>
      )}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" &&
        null}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;

  return true;
});
