import { ByLirn } from "@/components/brand/ByLirn";
import { cn } from "@/lib/utils";

export function TornsLockup({
  size = "nav",
  className,
}: {
  size?: "nav" | "hero";
  className?: string;
}) {
  return (
    <span className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-extrabold tracking-[-0.04em]",
          size === "hero" ? "text-4xl" : "text-lg",
        )}
      >
        TORNS
      </span>
      <ByLirn className={size === "hero" ? "text-sm" : undefined} />
    </span>
  );
}
