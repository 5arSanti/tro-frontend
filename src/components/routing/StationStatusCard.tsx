import type { StationStatus } from "../../types/routing.types";

interface StationStatusCardProps {
  status: StationStatus;
  onClick?: () => void;
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

export function StationStatusCard({ status, onClick }: StationStatusCardProps) {
  const hasData = status.last_passenger_count !== null && status.last_dispatch !== null;
  
  return (
    <div className={`station-status-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className="status-card-header">
        <div className="status-station-info">
          <h3>{status.station.name}</h3>
          <span className="status-line">{status.station.line}</span>
        </div>
        <div className={`status-indicator ${hasData ? 'active' : 'idle'}`}>
          <span className="status-dot"></span>
          {hasData ? 'Activo' : 'Sin datos'}
        </div>
      </div>

      <div className="status-card-body">
        {hasData && status.last_dispatch ? (
          <>
            <div className="status-metrics">
              <div className="status-metric highlight">
                <span className="metric-label">PASAJEROS</span>
                <span className="metric-value">{status.last_passenger_count}</span>
              </div>
              <div className="status-metric">
                <span className="metric-label">TRENES REQUERIDOS</span>
                <span className="metric-value">{status.last_dispatch.trains_required}</span>
              </div>
            </div>

            <div className="status-dispatch-info">
              <div className="dispatch-train">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="8" width="18" height="12" rx="2"/>
                  <path d="M3 12h18"/>
                </svg>
                <span>{status.last_dispatch.train_model.name}</span>
              </div>
              
              <div className="dispatch-details">
                <div className="detail-item">
                  <span className="detail-label">Capacidad Total</span>
                  <span className="detail-value">{status.last_dispatch.total_capacity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Capacidad Sobrante</span>
                  <span className="detail-value">{status.last_dispatch.surplus_capacity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tiempo Estimado</span>
                  <span className="detail-value">{formatCycleTime(status.last_dispatch.estimated_cycle_time_seconds)}</span>
                </div>
              </div>
            </div>

            <div className="status-footer">
              <span className="status-message">{status.last_dispatch.status}</span>
              <span className="status-time">Actualizado: {formatTime(status.last_updated)}</span>
            </div>
          </>
        ) : (
          <div className="status-empty">
            <p>Sin datos de aforo disponibles</p>
            <span>La estación aún no ha reportado detecciones</span>
          </div>
        )}
      </div>
    </div>
  );
}

