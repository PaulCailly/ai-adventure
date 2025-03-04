/* eslint-disable @next/next/no-img-element */
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { PreviewMessage } from "./market-message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { zones } from "@/lib/ai/zones";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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

  // Get market zone data
  const marketZone = zones["market"];

  if (!messages.length) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="relative w-full h-[60vh]">
          <img
            src="/images/market.jpg"
            alt="Marché de Luneterne"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
        </div>

        <Card className="mx-4 -mt-6 relative z-10 border-none shadow-lg">
          <CardHeader className="pb-2">
            <h2 className="text-xl font-bold">{marketZone.name}</h2>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">
              {marketZone.description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() =>
                append({
                  role: "user",
                  content: `start`,
                })
              }
            >
              Entrer dans le marché
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => router.push("/")}
            >
              Retour à la Taverne
            </Button>
          </CardFooter>
        </Card>
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
            Quitter le marché
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
