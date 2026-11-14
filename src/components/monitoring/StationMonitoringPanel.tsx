import { useEffect, useState } from "react";
import type { Station, StationStatus } from "@/types/routing.types";
import type { DetectionMetricsMessage, DetectionOverview } from "@/types/video.types";
import { routingService } from "@/services/routingService";
import { cn } from "@/lib/utils";

interface StationMonitoringPanelProps {
  cameraId: string;
  overview: DetectionOverview;
  latestMetrics: DetectionMetricsMessage | null;
}

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

const STATUS_LABEL: Record<DetectionOverview["status"], string> = {
  idle: "En espera",
  connecting: "Conectando",
  active: "En vivo",
  error: "Error",
};

export function StationMonitoringPanel({
  cameraId,
  overview,
  latestMetrics,
}: StationMonitoringPanelProps) {
  const [station, setStation] = useState<Station | null>(null);
  const [stationStatus, setStationStatus] = useState<StationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setLoading(true);
        setError(null);
        const stationData = await routingService.getStationByCameraId(cameraId);
        if (!stationData) {
          setError(`No hay estación configurada para la cámara ${cameraId}`);
          setLoading(false);
          return;
        }
        const statusData = await routingService.getStationStatus(stationData.id);
        setStation(stationData);
        setStationStatus(statusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos de la estación");
      } finally {
        setLoading(false);
      }
    };

    void fetchStationData();

    const interval = setInterval(async () => {
      try {
        const statusData = await routingService.getStationStatusByCameraId(cameraId);
        if (statusData) setStationStatus(statusData);
      } catch (err) {
        console.error("Error refreshing station status:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cameraId]);

  const personCount = latestMetrics?.personCount ?? latestMetrics?.person_count ?? overview.personCount;
  const lastDispatch = stationStatus?.last_dispatch;
  const observedAt = latestMetrics?.timestamp
    ? formatTime(latestMetrics.timestamp)
    : overview.lastUpdate;

  return (
    <aside className="grid shrink-0 grid-cols-1 border-t border-line md:grid-cols-3">
      <div className="bg-panel px-5 py-5">
        <p
          className={cn(
            "flex items-center gap-2 text-sm",
            overview.status === "error" ? "text-fail" : "text-mute",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              overview.status === "active" && "bg-energy",
              overview.status === "connecting" && "bg-energy",
              overview.status === "idle" && "bg-warn",
              overview.status === "error" && "bg-fail",
            )}
          />
          {STATUS_LABEL[overview.status]}
        </p>
        <p className="mt-2 font-extrabold text-5xl leading-none tracking-[-0.04em] text-deep tabular-nums">
          {personCount}
        </p>
        <p className="mt-2 text-sm text-mute">
          {personCount === 1 ? "persona observada" : "personas observadas"}
          {observedAt ? ` · ${observedAt}` : ""}
        </p>
      </div>

      <div className="border-t border-line bg-canvas px-5 py-5 md:border-t-0 md:border-x">
        {loading ? (
          <p className="text-sm text-mute">Cargando estación…</p>
        ) : error || !station ? (
          <p className="text-sm text-fail">{error || "Error al cargar la estación"}</p>
        ) : (
          <>
            <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{station.name}</h3>
            <p className="mt-2 text-sm text-mute">{station.line}</p>
            <p className="mt-3 text-sm text-mute">Viaje {station.travel_time_seconds}s</p>
          </>
        )}
      </div>

      <div className="bg-deep px-5 py-5 text-paper">
        <h4 className="text-sm font-semibold text-energy">Plan de despacho</h4>
        {lastDispatch ? (
          <>
            <p className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.04em]">
              {lastDispatch.train_model.name}
            </p>
            <p className="mt-2 text-sm text-paper/70">
              {lastDispatch.trains_required}{" "}
              {lastDispatch.trains_required === 1 ? "tren" : "trenes"} · ciclo{" "}
              {formatCycleTime(lastDispatch.estimated_cycle_time_seconds)} · capacidad{" "}
              {lastDispatch.total_capacity}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-paper/70">
            Sin plan de despacho disponible.
          </p>
        )}
      </div>
    </aside>
  );
}
