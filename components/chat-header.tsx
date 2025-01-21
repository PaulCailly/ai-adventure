"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { memo } from "react";

function PureChatHeader() {
  const router = useRouter();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <Button
        variant="outline"
        className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
        onClick={() => {
          router.push("/");
          router.refresh();
        }}
      >
        <PlusIcon />
      </Button>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
