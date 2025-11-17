import type { VideoInfo } from "../types/video.types";

interface CamerasPageProps {
  videos: VideoInfo[];
}

export function CamerasPage({ videos }: CamerasPageProps) {
  return (
    <div className="cameras-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Cámaras</h1>
          <p className="page-subtitle">
            Administración y configuración de dispositivos de vigilancia
          </p>
        </div>
      </div>

      <div className="cameras-grid-view">
        {videos.map((video) => (
          <div key={video.id} className="camera-grid-card">
            <div className="camera-grid-header">
              <div className="camera-grid-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 7l-7 5 7 5V7z"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="camera-status-badge active">
                <span className="status-dot-inline"></span>
                Activa
              </div>
            </div>
            
            <div className="camera-grid-body">
              <h3>{video.name}</h3>
              <div className="camera-grid-meta">
                <div className="meta-item">
                  <span className="meta-label">ID</span>
                  <span className="meta-value">{video.id}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Resolución</span>
                  <span className="meta-value">1920x1080</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">FPS</span>
                  <span className="meta-value">30</span>
                </div>
              </div>
            </div>

            <div className="camera-grid-footer">
              <div className="camera-stats-inline">
                <div className="stat-inline">
                  <span className="stat-inline-label">Tiempo activo</span>
                  <span className="stat-inline-value">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

