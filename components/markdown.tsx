import Link from "next/link";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { Button } from "@/components/ui/button";

const components = ({
  append,
  isLoading,
}: {
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isLoading: boolean;
}) => {
  const handleClick = (content: string) => {
    if (!isLoading) {
      append({ content, role: "user" }, {});
    }
  };
  const componentMap: Partial<Components> = {
    pre: ({ children }) => <>{children}</>,
    ol: ({ node, children, ...props }) => {
      return (
        <ol className="list-decimal list-outside ml-4 space-y-2" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }) => {
      return (
        <Button
          variant="outline"
          // @ts-expect-error
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleClick(children as string)
          }
          disabled={isLoading}
          className="py-1 h-auto min-h-[40px] w-full justify-start whitespace-normal text-left break-words"
          {...props}
        >
          {children}
        </Button>
      );
    },
    ul: ({ node, children, ...props }) => {
      return (
        <ul
          className="list-disc list-outside ml-4 pointer-events-none"
          {...props}
        >
          {children}
        </ul>
      );
    },

    a: ({ node, children, ...props }) => {
      return (
        // @ts-expect-error
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    h1: ({ node, children, ...props }) => {
      return (
        <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      return (
        <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }) => {
      return (
        <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }) => {
      return (
        <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
          {children}
        </h6>
      );
    },
  };
  return componentMap;
};

const remarkPlugins = [remarkGfm];

export const Markdown = ({
  children,
  append,
  isLoading = false,
}: {
  children: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isLoading?: boolean;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={components({ append, isLoading })}
    >
      {children}
    </ReactMarkdown>
  );
};
