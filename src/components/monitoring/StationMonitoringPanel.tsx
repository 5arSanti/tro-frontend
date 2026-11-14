import { useEffect, useState } from "react";
import type { Station, StationStatus } from "@/types/routing.types";
import type { DetectionMetricsMessage } from "@/types/video.types";
import { routingService } from "@/services/routingService";

interface StationMonitoringPanelProps {
  cameraId: string;
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

export function StationMonitoringPanel({ cameraId, latestMetrics }: StationMonitoringPanelProps) {
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

  if (loading) {
    return <p className="text-sm text-mute">Cargando información de la estación...</p>;
  }

  if (error || !station) {
    return <p className="text-sm text-fail">{error || "Error al cargar la estación"}</p>;
  }

  const currentPassengerCount = latestMetrics?.personCount ?? latestMetrics?.person_count ?? 0;
  const lastDispatch = stationStatus?.last_dispatch;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
        <h3 className="text-base font-semibold">{station.name}</h3>
        <p className="mt-1 text-xs text-mute">
          {station.line} · {station.id}
        </p>
        <p className="mt-4 text-xs uppercase tracking-wide text-mute">Detección actual</p>
        <p className="mt-1 font-mono text-3xl tabular-nums text-energy">{currentPassengerCount}</p>
        {latestMetrics ? (
          <p className="text-xs text-mute">{formatTime(latestMetrics.timestamp)}</p>
        ) : null}
      </div>

      <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-mute">Plan de despacho</h4>
        {lastDispatch ? (
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <p className="col-span-2 font-medium">{lastDispatch.train_model.name}</p>
            <div>
              <p className="text-mute">Trenes</p>
              <p className="font-mono tabular-nums">{lastDispatch.trains_required}</p>
            </div>
            <div>
              <p className="text-mute">Capacidad</p>
              <p className="font-mono tabular-nums">{lastDispatch.total_capacity}</p>
            </div>
            <div>
              <p className="text-mute">Sobrante</p>
              <p className="font-mono tabular-nums">{lastDispatch.surplus_capacity}</p>
            </div>
            <div>
              <p className="text-mute">Ciclo</p>
              <p className="font-mono tabular-nums">
                {formatCycleTime(lastDispatch.estimated_cycle_time_seconds)}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-mute">Sin plan de despacho disponible</p>
        )}
      </div>

      <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-mute">Configuración</h4>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-mute">Cámara</dt>
            <dd className="font-mono">{station.camera_id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-mute">Tiempo de viaje</dt>
            <dd className="font-mono">{station.travel_time_seconds}s</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-mute">Trenes disponibles</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {station.supported_trains.map((train) => (
            <li key={train.id} className="flex justify-between gap-3">
              <span>{train.name}</span>
              <span className="font-mono tabular-nums text-mute">{train.total_capacity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
