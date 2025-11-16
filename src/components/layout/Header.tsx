import type { DetectionOverview } from "../../types/video.types";

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
    <div className="control-header">
      <div className="header-info">
        <div className={`status-badge ${overview.status}`}>
          <span className={`status-indicator ${overview.status}`}></span>
          <span>Sistema {STATUS_LABEL[overview.status]}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Última actualización</span>
          <span className="stat-value">{overview.lastUpdate ?? "--"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Personas detectadas</span>
          <span className="stat-value prominent">{overview.personCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Objetos totales</span>
          <span className="stat-value prominent">{overview.totalObjects}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Cámaras activas</span>
          <span className="stat-value">
            {activeCameras}/{totalCameras}
          </span>
        </div>
      </div>
    </div>
  );
}
