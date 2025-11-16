import type { DetectionStats } from "../../types/video.types";

interface HeaderProps {
  stats: DetectionStats;
  totalCameras: number;
  activeCameras: number;
}

export function Header({ stats, totalCameras, activeCameras }: HeaderProps) {
  return (
    <div className="control-header">
      <div className="header-info">
        <div className="status-badge">
          <span className={`status-indicator ${stats.status}`}></span>
          <span>Sistema {stats.status === "active" ? "Activo" : "Inactivo"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Última actualización</span>
          <span className="stat-value">{stats.lastUpdate}</span>
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

