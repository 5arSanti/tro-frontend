import type { VideoInfo } from "../../types/video.types";

interface DashboardProps {
  videos: VideoInfo[];
  onStartMonitoring: () => void;
}

export function Dashboard({ videos, onStartMonitoring }: DashboardProps) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-hero">
          <div className="hero-icon">🚇</div>
          <h1>Sistema de Monitoreo Metro - TRO</h1>
          <p className="hero-subtitle">
            Control y Gestión de Rutas en Tiempo Real con Detección Inteligente
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-card">
            <div className="card-icon">📹</div>
            <div className="card-content">
              <h3>{videos.length}</h3>
              <p>Cámaras Disponibles</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h3>98%</h3>
              <p>Precisión del Sistema</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h3>24/7</h3>
              <p>Monitoreo Continuo</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔒</div>
            <div className="card-content">
              <h3>100%</h3>
              <p>Seguro y Confiable</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn-primary" onClick={onStartMonitoring}>
            <span className="btn-icon">🎥</span>
            Iniciar Monitoreo en Vivo
          </button>
          <button className="btn-secondary">
            <span className="btn-icon">📊</span>
            Ver Reportes Históricos
          </button>
        </div>

        <div className="dashboard-info">
          <div className="info-section">
            <h3>🛡️ Características del Sistema</h3>
            <ul>
              <li>Detección inteligente de objetos y personas con IA</li>
              <li>Monitoreo en tiempo real de múltiples cámaras</li>
              <li>Alertas automáticas de eventos importantes</li>
              <li>Análisis de flujo de pasajeros y aglomeraciones</li>
              <li>Reportes detallados y estadísticas en tiempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

