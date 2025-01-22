import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { PreviewMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { memo } from "react";
import equal from "fast-deep-equal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

  const lastMessage = messages[messages.length - 1];

  if (!messages.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          variant="outline"
          onClick={() => append({ role: "user", content: "start" })}
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
          <Button
            variant="default"
            onClick={() => router.push(`/character/${id}`)}
          >
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
