import { useEffect, useState } from "react";
import type { Station, StationStatus } from "../../types/routing.types";
import type { DetectionMetricsMessage } from "../../types/video.types";
import { routingService } from "../../services/routingService";

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
        
        // Find station by camera ID
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

    fetchStationData();

    // Refresh status every 1 seconds
    const interval = setInterval(async () => {
      try {
        const statusData = await routingService.getStationStatusByCameraId(cameraId);
        if (statusData) {
          setStationStatus(statusData);
        }
      } catch (err) {
        console.error("Error refreshing station status:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cameraId]);

  if (loading) {
    return (
      <div className="station-monitoring-panel">
        <div className="monitoring-loading">
          <div className="loading-spinner"></div>
          <span>Cargando información de la estación...</span>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="station-monitoring-panel">
        <div className="monitoring-error">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error || "Error al cargar la estación"}</span>
        </div>
      </div>
    );
  }

  const currentPassengerCount = latestMetrics?.personCount ?? latestMetrics?.person_count ?? 0;
  const lastDispatch = stationStatus?.last_dispatch;

  return (
    <div className="station-monitoring-panel">
      {/* Station Info Header */}
      <div className="monitoring-station-header">
        <div className="station-header-content">
          <div className="station-icon-large">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <div className="station-header-info">
            <h3>{station.name}</h3>
            <div className="station-header-meta">
              <span className="station-line-tag">{station.line}</span>
              <span className="station-id-tag">ID: {station.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Detection Metrics */}
      <div className="monitoring-section">
        <h4 className="section-title">DETECCIÓN ACTUAL</h4>
        <div className="detection-metrics-grid">
          <div className="metric-card highlight">
            <span className="metric-label">PASAJEROS DETECTADOS</span>
            <span className="metric-value large">{currentPassengerCount}</span>
            {latestMetrics && (
              <span className="metric-time">
                {formatTime(latestMetrics.timestamp)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dispatch Plan */}
      {lastDispatch ? (
        <div className="monitoring-section">
          <h4 className="section-title">PLAN DE DESPACHO ÓPTIMO</h4>
          <div className="dispatch-summary">
            <div className="dispatch-train-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="8" width="18" height="12" rx="2"/>
                <path d="M3 12h18"/>
              </svg>
              <div className="train-info-text">
                <span className="train-name">{lastDispatch.train_model.name}</span>
                <span className="train-specs">
                  {lastDispatch.train_model.wagon_count} vagón{lastDispatch.train_model.wagon_count > 1 ? 'es' : ''} 
                  • {lastDispatch.train_model.capacity_per_wagon} pasajeros/vagón
                </span>
              </div>
            </div>

            <div className="dispatch-metrics-grid">
              <div className="dispatch-metric">
                <span className="dispatch-metric-label">Trenes Requeridos</span>
                <span className="dispatch-metric-value">{lastDispatch.trains_required}</span>
              </div>
              <div className="dispatch-metric">
                <span className="dispatch-metric-label">Capacidad Total</span>
                <span className="dispatch-metric-value">{lastDispatch.total_capacity}</span>
              </div>
              <div className="dispatch-metric">
                <span className="dispatch-metric-label">Capacidad Sobrante</span>
                <span className="dispatch-metric-value">{lastDispatch.surplus_capacity}</span>
              </div>
              <div className="dispatch-metric">
                <span className="dispatch-metric-label">Tiempo Estimado</span>
                <span className="dispatch-metric-value">
                  {formatCycleTime(lastDispatch.estimated_cycle_time_seconds)}
                </span>
              </div>
            </div>

            <div className="dispatch-status">
              <span className="status-badge success">{lastDispatch.status}</span>
              <span className="status-timestamp">
                Generado: {formatTime(lastDispatch.generated_at)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="monitoring-section">
          <h4 className="section-title">PLAN DE DESPACHO</h4>
          <div className="no-dispatch-data">
            <p>Sin plan de despacho disponible</p>
            <span>La estación aún no ha generado un plan basado en detecciones</span>
          </div>
        </div>
      )}

      {/* Station Configuration */}
      <div className="monitoring-section">
        <h4 className="section-title">CONFIGURACIÓN DE ESTACIÓN</h4>
        <div className="station-config">
          <div className="config-row">
            <span className="config-label">Cámara Asignada</span>
            <span className="config-value">{station.camera_id}</span>
          </div>
          <div className="config-row">
            <span className="config-label">Tiempo de Viaje</span>
            <span className="config-value">{station.travel_time_seconds}s</span>
          </div>
        </div>
      </div>

      {/* Available Trains */}
      <div className="monitoring-section">
        <h4 className="section-title">TRENES DISPONIBLES</h4>
        <div className="available-trains-list">
          {station.supported_trains.map((train) => (
            <div key={train.id} className="train-item">
              <div className="train-item-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="8" width="18" height="12" rx="2"/>
                  <path d="M3 12h18"/>
                </svg>
                <span className="train-item-name">{train.name}</span>
              </div>
              <div className="train-item-specs">
                <span className="train-spec">
                  <span className="spec-icon">{train.wagon_count}</span>
                  Vagón{train.wagon_count > 1 ? 'es' : ''}
                </span>
                <span className="train-spec">
                  <span className="spec-icon">{train.capacity_per_wagon}</span>
                  Cap/Vagón
                </span>
                <span className="train-spec highlight">
                  <span className="spec-icon">{train.total_capacity}</span>
                  Total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

