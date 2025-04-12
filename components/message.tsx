import type { ChatRequestOptions, Message, CreateMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import Image from "next/image";
import type { Vote } from "@/lib/db/schema";

import { Markdown } from "./markdown";

import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";

const PurePreviewMessage = ({
  message,
  append,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}) => {
  if (message.role === "user") return null;

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
            {message.content && (
              <div className="flex flex-row gap-2 items-start">
                <div className="flex flex-col gap-4 text-xl">
                  <Markdown append={append}>
                    {message.content as string}
                  </Markdown>
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
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  }
);
