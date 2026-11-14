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

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <dt className="shrink-0 text-sm text-mute">{label}</dt>
      <dd className="text-right text-sm tabular-nums">{value}</dd>
    </div>
  );
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
    return <p className="text-sm text-mute">Cargando información de la estación…</p>;
  }

  if (error || !station) {
    return <p className="text-sm text-fail">{error || "Error al cargar la estación"}</p>;
  }

  const currentPassengerCount = latestMetrics?.personCount ?? latestMetrics?.person_count ?? 0;
  const lastDispatch = stationStatus?.last_dispatch;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="text-lg font-semibold">{station.name}</h3>
        <p className="mt-1 text-sm text-mute">
          {station.line} · {currentPassengerCount} personas
          {latestMetrics ? ` · ${formatTime(latestMetrics.timestamp)}` : ""}
        </p>
        <dl className="mt-4 divide-y divide-line">
          <Row label="Cámara" value={station.camera_id} />
          <Row label="Tiempo de viaje" value={`${station.travel_time_seconds}s`} />
          <Row
            label="Trenes"
            value={station.supported_trains.map((train) => train.name).join(", ")}
          />
        </dl>
      </div>

      <div>
        <h4 className="text-lg font-semibold">Plan de despacho</h4>
        {lastDispatch ? (
          <dl className="mt-4 divide-y divide-line">
            <Row label="Modelo" value={lastDispatch.train_model.name} />
            <Row label="Trenes" value={lastDispatch.trains_required} />
            <Row label="Capacidad" value={lastDispatch.total_capacity} />
            <Row label="Sobrante" value={lastDispatch.surplus_capacity} />
            <Row label="Ciclo" value={formatCycleTime(lastDispatch.estimated_cycle_time_seconds)} />
          </dl>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-mute">Sin plan de despacho disponible.</p>
        )}
      </div>
    </div>
  );
}
