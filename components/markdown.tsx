import Link from "next/link";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { Button } from "@/components/ui/button";

const components = ({
  append,
}: {
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}) => {
  const handleClick = (content: string) => {
    append({ content, role: "user" }, {});
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
          className="py-1 w-full justify-start"
          {...props}
        >
          {children}
        </Button>
      );
    },
    ul: ({ node, children, ...props }) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
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
}: {
  children: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={components({ append })}
    >
      {children}
    </ReactMarkdown>
  );
};
