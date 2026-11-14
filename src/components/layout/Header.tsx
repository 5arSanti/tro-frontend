import { cn } from "@/lib/utils";
import type { DetectionOverview } from "@/types/video.types";

interface HeaderProps {
  overview: DetectionOverview;
  totalCameras: number;
  activeCameras: number;
}

const STATUS_LABEL: Record<DetectionOverview["status"], string> = {
  idle: "En espera",
  connecting: "Conectando",
  active: "Activo",
  error: "Error",
};

export function Header({ overview, totalCameras, activeCameras }: HeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <span
          className={cn(
            "size-2 rounded-full",
            overview.status === "active" && "bg-ok",
            overview.status === "connecting" && "bg-energy",
            overview.status === "idle" && "bg-warn",
            overview.status === "error" && "bg-fail",
          )}
        />
        <span>Estado {STATUS_LABEL[overview.status]}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wide text-mute">Última actualización</span>
        <span className="font-mono text-sm tabular-nums">{overview.lastUpdate ?? "--"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wide text-mute">Personas</span>
        <span className="font-mono text-2xl tabular-nums text-energy">{overview.personCount}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wide text-mute">Objetos</span>
        <span className="font-mono text-2xl tabular-nums">{overview.totalObjects}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wide text-mute">Fuentes</span>
        <span className="font-mono text-sm tabular-nums">
          {activeCameras}/{totalCameras}
        </span>
      </div>
    </div>
  );
}
