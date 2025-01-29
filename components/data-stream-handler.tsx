"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { useUserMessageId } from "@/hooks/use-user-message-id";
import { useRouter } from "next/navigation";

type DataStreamDelta = {
  type:
    | "text-delta"
    | "code-delta"
    | "title"
    | "id"
    | "suggestion"
    | "clear"
    | "finish"
    | "user-message-id"
    | "kind";
  content: string;
};

export function DataStreamHandler({ id }: { id: string }) {
  const { data: dataStream } = useChat({ id });
  const { setUserMessageIdFromServer } = useUserMessageId();
  const lastProcessedIndex = useRef(-1);
  const router = useRouter();

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      if (delta.type === "user-message-id") {
        setUserMessageIdFromServer(delta.content as string);
        return;
      }
    });
  }, [dataStream, setUserMessageIdFromServer]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/${id}/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "character-created") {
        const characterId = data.content;
        router.push(`/characters/${characterId}`);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [id, router]);

  return null;
}
