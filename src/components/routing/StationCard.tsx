import type { Station } from "../../types/routing.types";

interface StationCardProps {
  station: Station;
  onClick?: () => void;
  isSelected?: boolean;
}

export function StationCard({ station, onClick, isSelected = false }: StationCardProps) {
  return (
    <div 
      className={`station-card ${isSelected ? 'selected' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="station-card-header">
        <div className="station-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        <div className="station-line-badge">{station.line}</div>
      </div>
      
      <div className="station-card-body">
        <h3>{station.name}</h3>
        <div className="station-meta">
          <div className="meta-row">
            <span className="meta-label">ID Estación</span>
            <span className="meta-value">{station.id}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Cámara</span>
            <span className="meta-value">{station.camera_id}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Tiempo de Viaje</span>
            <span className="meta-value">{station.travel_time_seconds}s</span>
          </div>
        </div>
        
        <div className="station-trains">
          <span className="trains-label">Trenes Disponibles:</span>
          <div className="trains-badges">
            {station.supported_trains.map((train) => (
              <span key={train.id} className="train-badge">
                {train.wagon_count}V
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

