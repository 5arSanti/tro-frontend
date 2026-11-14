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
    <div
      className={`rounded-[2px] border border-white/10 bg-canvas/40 p-4 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{status.station.name}</h3>
          <p className="text-xs text-mute">{status.station.line}</p>
        </div>
        <span className="text-xs text-mute">{hasData ? "Con datos" : "Sin datos"}</span>
      </div>

      {hasData && status.last_dispatch ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-mute">Pasajeros</p>
            <p className="font-mono text-xl tabular-nums text-energy">{status.last_passenger_count}</p>
          </div>
          <div>
            <p className="text-mute">Trenes requeridos</p>
            <p className="font-mono text-xl tabular-nums">{status.last_dispatch.trains_required}</p>
          </div>
          <p className="col-span-2">{status.last_dispatch.train_model.name}</p>
          <div>
            <p className="text-mute">Capacidad</p>
            <p className="font-mono tabular-nums">{status.last_dispatch.total_capacity}</p>
          </div>
          <div>
            <p className="text-mute">Ciclo</p>
            <p className="font-mono tabular-nums">
              {formatCycleTime(status.last_dispatch.estimated_cycle_time_seconds)}
            </p>
          </div>
          <p className="col-span-2 text-xs text-mute">Actualizado: {formatTime(status.last_updated)}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-mute">Sin datos de aforo disponibles</p>
      )}
    </div>
  );
}
