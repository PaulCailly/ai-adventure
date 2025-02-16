/* eslint-disable @next/next/no-img-element */
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { PreviewMessage } from "./adventure-message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { memo } from "react";
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

  if (!messages.length) {
    return (
      <div className="py-8 h-screen flex flex-col items-center justify-between gap-4">
        <div />
        <Button
          variant="default"
          onClick={() =>
            append({
              role: "user",
              content: `start`,
            })
          }
        >
          Commencer l&apos;aventure
        </Button>
        <Button variant="ghost" onClick={() => router.push("/")}>
          Retour à la Taverne
        </Button>
      </div>
    );
  }

  const lastUserIndex = messages.findLastIndex(
    (message) => message.role === "user"
  );
  const assistantMessages = messages
    .slice(lastUserIndex + 1)
    .filter((message) => message.role === "assistant");

  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  const showCharacterButton = lastAssistantMessage?.content
    ?.toLowerCase()
    .includes("se termine ici");

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {assistantMessages.map((message, index) => {
        const hasNextTextContent = assistantMessages
          .slice(index + 1)
          .some((msg) => msg.content && msg.content.trim() !== "");

        return (
          <PreviewMessage
            key={message.id}
            message={message}
            isLoading={isLoading}
            append={append}
            isLastMessage={index === assistantMessages.length - 1}
            hasNextTextContent={hasNextTextContent}
          />
        );
      })}

      {showCharacterButton && (
        <div className="flex justify-center mb-4">
          <Button variant="default" onClick={() => router.push("/")}>
            Revenir à la Taverne
          </Button>
        </div>
      )}

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
