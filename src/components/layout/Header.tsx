import { cn } from "@/lib/utils";
import type { DetectionOverview } from "@/types/video.types";

interface HeaderProps {
  overview: DetectionOverview;
}

const STATUS_LABEL: Record<DetectionOverview["status"], string> = {
  idle: "En espera",
  connecting: "Conectando",
  active: "En vivo",
  error: "Error",
};

export function Header({ overview }: HeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-line px-5 py-4">
      <p className="flex items-center gap-2 text-sm text-mute">
        <span
          className={cn(
            "size-2 rounded-full",
            overview.status === "active" && "bg-ok",
            overview.status === "connecting" && "bg-energy",
            overview.status === "idle" && "bg-warn",
            overview.status === "error" && "bg-fail",
          )}
        />
        {STATUS_LABEL[overview.status]}
      </p>
      <p className="text-2xl font-semibold tabular-nums tracking-tight">
        {overview.personCount}
        <span className="ml-1.5 text-sm font-medium text-mute">
          {overview.personCount === 1 ? "persona" : "personas"}
        </span>
      </p>
      {overview.lastUpdate ? (
        <p className="text-sm text-mute">Actualizado {overview.lastUpdate}</p>
      ) : null}
    </div>
  );
}
