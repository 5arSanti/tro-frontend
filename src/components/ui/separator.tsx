import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "vertical",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-line",
        orientation === "vertical" ? "h-4 w-px" : "h-px w-full",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
