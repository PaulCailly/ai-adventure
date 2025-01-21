import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { PreviewMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { memo } from "react";
import { Vote } from "@/lib/db/schema";
import equal from "fast-deep-equal";
import { Button } from "@/components/ui/button";

interface MessagesProps {
  chatId: string;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  isBlockVisible: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureMessages({
  chatId,
  isLoading,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
  append,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const lastMessage = messages[messages.length - 1];

  if (!messages.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          variant="outline"
          onClick={() => append({ role: "user", content: "start" })}
        >
          Start
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {lastMessage && (
        <PreviewMessage
          key={lastMessage.id}
          chatId={chatId}
          message={lastMessage}
          isLoading={isLoading}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === lastMessage.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          append={append}
        />
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
  if (prevProps.isBlockVisible && nextProps.isBlockVisible) return true;

  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
