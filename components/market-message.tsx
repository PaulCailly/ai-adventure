/* eslint-disable @next/next/no-img-element */
import { memo, useState, useEffect } from "react";
import type { ChatRequestOptions, Message, CreateMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DiceDisplay } from "./dice-display";
import equal from "fast-deep-equal";
import { Markdown } from "./markdown";
import { Button } from "./ui/button";

type PreviewMessageProps = {
  message: Message;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isLoading: boolean;
  isLastMessage: boolean;
  hasNextTextContent: boolean;
};

const PurePreviewMessage = ({
  message,
  append,
  isLoading,
  isLastMessage,
  hasNextTextContent,
}: PreviewMessageProps) => {
  const [messageContent, setMessageContent] = useState<string>(message.content);

  useEffect(() => {
    if (message.role !== "assistant") return;

    let timer: NodeJS.Timeout | null = null;

    if (!message.content || !message.content.trim()) {
      timer = setTimeout(() => {
        setMessageContent("...");
      }, 1500);
    } else {
      setMessageContent(message.content);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message]);

  if (message.role === "user") return null;

  const showContinueButton =
    isLastMessage &&
    !hasNextTextContent &&
    !isLoading &&
    !messageContent.includes("se termine ici");

  // Handle tool invocations—including the negotiation tool using dice mechanics.
  if (message.toolInvocations && message.toolInvocations.length > 0) {
    const hasDiceRolls = message.toolInvocations.some(
      (invocation) =>
        (invocation.toolName === "negociate" ||
          invocation.toolName === "combatCalculation") &&
        invocation.state === "result"
    );

    if (hasDiceRolls) {
      return (
        <div className="flex flex-col items-center gap-4">
          <DiceDisplay message={message} />
          {showContinueButton && (
            <Button
              variant="default"
              onClick={() =>
                append({
                  role: "user",
                  content: "<continuer la narration>",
                })
              }
            >
              Continuer
            </Button>
          )}
        </div>
      );
    }

    // Handle additional tool-specific displays (e.g. updateHero, if applicable)
    const hasUpdateHero = message.toolInvocations.some(
      (invocation) =>
        invocation.toolName === "updateHero" && invocation.state === "result"
    );

    if (hasUpdateHero) {
      return (
        <div className="flex flex-col items-center gap-4">
          {showContinueButton && (
            <Button
              variant="default"
              onClick={() =>
                append({
                  role: "user",
                  content: "<continuer la narration>",
                })
              }
            >
              Continuer
            </Button>
          )}
        </div>
      );
    }

    if (showContinueButton) {
      return (
        <div className="flex justify-center">
          <Button
            variant="default"
            onClick={() =>
              append({
                role: "user",
                content: "<continuer la narration>",
              })
            }
          >
            Continuer
          </Button>
        </div>
      );
    }
    return null;
  }

  if (messageContent === "..." || messageContent === "") return null;

  const containsList = /(\n\s*[-*]|\d+\.)/.test(messageContent);

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div className="flex items-start gap-4 w-full">
          {message.role === "assistant" && (
            <div className="size-12 flex items-center rounded-full justify-center shrink-0 overflow-hidden">
              <Image
                src="/images/innkeeper.png"
                alt="Innkeeper"
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            {messageContent && (
              <div className="flex flex-row gap-2 items-start">
                <div className="flex flex-col gap-4 text-lg">
                  <Markdown append={append} isLoading={isLoading}>
                    {messageContent}
                  </Markdown>
                  {!containsList && showContinueButton && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        append(
                          { content: "<continuer la narration>", role: "user" },
                          {}
                        )
                      }
                      className="mt-2"
                    >
                      Continuer
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (prevProps.isLastMessage !== nextProps.isLastMessage) return false;
    if (prevProps.hasNextTextContent !== nextProps.hasNextTextContent)
      return false;
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations
      )
    )
      return false;

    return true;
  }
);
