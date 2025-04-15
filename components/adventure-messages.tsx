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

  // If there are no messages, display the start button
  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Button
          variant="outline"
          onClick={() =>
            append({
              role: "user",
              content: `start`,
            })
          }
        >
          Commencer l&apos;aventure
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Retour à la Taverne
        </Button>
      </div>
    );
  }

  // Locate the index of the last user message
  let lastUserIndex = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      lastUserIndex = i;
      break;
    }
  }

  // Filter for all assistant messages that have been added after the last user message
  const assistantMessages = messages
    .slice(lastUserIndex + 1)
    .filter((message) => message.role === "assistant");

  // Check if the last assistant message includes a keyword to show a navigation button
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  const showCharacterButton = lastAssistantMessage?.content
    ?.toLowerCase()
    .includes("se termine ici");

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {assistantMessages.map((message) => (
        <PreviewMessage
          key={message.id}
          message={message}
          isLoading={isLoading}
          append={append}
        />
      ))}

      {showCharacterButton && (
        <div className="flex justify-center mb-4">
          <Button variant="default" onClick={() => router.push("/")}>
            Revenir à la Taverne
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
