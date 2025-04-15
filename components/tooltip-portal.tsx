"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface TooltipPortalProps {
  children: React.ReactNode;
  targetRect: DOMRect;
}

export default function TooltipPortal({
  children,
  targetRect,
}: TooltipPortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    setContainer(div);
    return () => {
      document.body.removeChild(div);
    };
  }, []);

  if (!container) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    left: targetRect.left + targetRect.width / 2,
    top: targetRect.top,
    transform: "translate(-50%, -100%)",
    zIndex: 9999,
  };

  return ReactDOM.createPortal(<div style={style}>{children}</div>, container);
}
