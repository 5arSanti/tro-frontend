import type { StationStatus } from "@/types/routing.types";

function formatTime(timestamp: string | null): string {
  if (!timestamp) return "--:--:--";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatCycleTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

export function StationStatusCard({
  status,
  onClick,
}: {
  status: StationStatus;
  onClick?: () => void;
}) {
  const hasData = status.last_passenger_count !== null && status.last_dispatch !== null;

  return (
    <div className={`bg-canvas p-5 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-semibold">{status.station.name}</h3>
          <p className="text-sm text-mute">{status.station.line}</p>
        </div>
        <span className="text-xs text-mute">{hasData ? "Con datos" : "Sin datos"}</span>
      </div>

      {hasData && status.last_dispatch ? (
        <div className="mt-4">
          <p className="text-4xl font-extrabold tabular-nums tracking-[-0.04em]">
            {status.last_passenger_count}
            <span className="ml-2 text-sm font-medium tracking-normal text-mute">
              {status.last_passenger_count === 1 ? "persona" : "personas"}
            </span>
          </p>
          <p className="mt-2 text-sm">
            {status.last_dispatch.train_model.name} · {status.last_dispatch.trains_required}{" "}
            {status.last_dispatch.trains_required === 1 ? "tren" : "trenes"} · ciclo{" "}
            {formatCycleTime(status.last_dispatch.estimated_cycle_time_seconds)}
          </p>
          <p className="mt-1 text-xs text-mute">Actualizado {formatTime(status.last_updated)}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-mute">Sin datos de aforo disponibles.</p>
      )}
    </div>
  );
}
