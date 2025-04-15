/* eslint-disable @next/next/no-img-element */
import { memo, useState, useEffect } from "react";
import type { ChatRequestOptions, Message, CreateMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

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
};

const PurePreviewMessage = ({
  message,
  append,
  isLoading,
}: PreviewMessageProps) => {
  // For handling potential "thinking" content after 2 seconds
  const [messageContent, setMessageContent] = useState<string>(message.content);
  useEffect(() => {
    // Only applies if the speaker is the assistant
    if (message.role !== "assistant") return;

    let timer: NodeJS.Timeout | null = null;

    // If no content is immediately available, wait 2 seconds, then show a placeholder
    if (!message.content || !message.content.trim()) {
      timer = setTimeout(() => {
        setMessageContent("...");
      }, 1500);
    } else {
      setMessageContent(message.content);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [message]);

  if (message.role === "user") return null;
  if (messageContent === "..." || messageContent === "") return null;

  const containsList = /(\n\s*[-*]|\d+\.)/.test(messageContent);
  const isNotEnd = messageContent.includes("se termine ici");
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
            <div className="size-16 flex items-center rounded-full justify-center shrink-0 overflow-hidden">
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
                <div className="flex flex-col gap-4 text-xl">
                  <Markdown append={append} isLoading={isLoading}>
                    {messageContent}
                  </Markdown>
                  {!containsList && !isLoading && !isNotEnd && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        append({ content: "Continuer", role: "user" }, {})
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
