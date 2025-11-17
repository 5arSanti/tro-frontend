import { useNavigate } from "react-router-dom";
import type { VideoInfo } from "../types/video.types";
import { useHealthCheck } from "../hooks/useHealthCheck";

interface HomePageProps {
  videos: VideoInfo[];
}

const ENVIRONMENT_LABELS: Record<string, string> = {
  development: "Desarrollo",
  production: "Producción",
  staging: "Pruebas",
  testing: "Testing",
  local: "Local",
  "---": "---",
};

export function HomePage({ videos }: HomePageProps) {
  const navigate = useNavigate();
  const systemHealth = useHealthCheck();

  const handleStartMonitoring = () => {
    navigate("/monitoring");
  };

  const getEnvironmentLabel = (env: string): string => {
    return ENVIRONMENT_LABELS[env.toLowerCase()] || env;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-hero">
          <div className="hero-badge">TRO SYSTEM</div>
          <h1>Sistema de Monitoreo y Vigilancia</h1>
          <p className="hero-subtitle">
            Plataforma de Control de Rutas con Detección Inteligente en Tiempo Real
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-card">
            <div className="card-label">Cámaras Disponibles</div>
            <div className="card-value">{videos.length}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-label">Versión del Sistema</div>
            <div className="card-value">{systemHealth.version}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-label">Entorno</div>
            <div className="card-value">{getEnvironmentLabel(systemHealth.environment)}</div>
          </div>

          <div className="dashboard-card">
            <div className="card-label">Estado del Sistema</div>
            <div className="card-value card-status">
              <span className={`status-indicator-dot ${systemHealth.isOnline ? 'online' : 'offline'}`}></span>
              {systemHealth.isOnline ? "Operativo" : "Desconectado"}
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn-primary" onClick={handleStartMonitoring}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Iniciar Monitoreo en Vivo
          </button>
        </div>

        <div className="dashboard-info">
          <div className="info-section">
            <h3>Características del Sistema</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-header">
                  <div className="feature-icon">AI</div>
                  <h4>Detección Inteligente</h4>
                </div>
                <p>Identificación automática de objetos y personas mediante algoritmos avanzados de inteligencia artificial</p>
              </div>
              <div className="feature-item">
                <div className="feature-header">
                  <div className="feature-icon">RT</div>
                  <h4>Tiempo Real</h4>
                </div>
                <p>Monitoreo simultáneo de múltiples cámaras con latencia mínima y actualización continua</p>
              </div>
              <div className="feature-item">
                <div className="feature-header">
                  <div className="feature-icon">AN</div>
                  <h4>Análisis de Flujo</h4>
                </div>
                <p>Evaluación de patrones de desplazamiento y detección de aglomeraciones en zonas críticas</p>
              </div>
              <div className="feature-item">
                <div className="feature-header">
                  <div className="feature-icon">SE</div>
                  <h4>Sistema Seguro</h4>
                </div>
                <p>Infraestructura protegida con encriptación de datos y acceso controlado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

