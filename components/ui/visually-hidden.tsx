import { VisuallyHidden as VisuallyHiddenPrimitive } from "@radix-ui/react-visually-hidden";

export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <VisuallyHiddenPrimitive>{children}</VisuallyHiddenPrimitive>
);
