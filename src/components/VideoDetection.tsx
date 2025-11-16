import { useEffect, useState } from "react";

interface VideoInfo {
  id: string;
  filename: string;
  name: string;
}

interface VideoListResponse {
  videos: VideoInfo[];
}

interface DetectionStats {
  totalDetections: number;
  lastUpdate: string;
  status: "active" | "idle" | "error";
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function VideoDetection() {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DetectionStats>({
    totalDetections: 0,
    lastUpdate: new Date().toLocaleTimeString(),
    status: "idle",
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videos/list`);
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data: VideoListResponse = await response.json();
        setVideos(data.videos);
        if (data.videos.length > 0 && !selectedVideo) {
          setSelectedVideo(data.videos[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      setStats((prev) => ({
        ...prev,
        status: "active",
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }
  }, [selectedVideo]);

  if (loading) {
    return (
      <div className="metro-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Inicializando sistema de monitoreo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metro-container">
        <div className="error-screen">
          <div className="error-icon">⚠️</div>
          <h2>Error del Sistema</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="metro-container">
        <div className="empty-screen">
          <div className="empty-icon">📹</div>
          <h2>Sin Cámaras Disponibles</h2>
          <p>No hay cámaras configuradas en el sistema</p>
        </div>
      </div>
    );
  }

  return (
    <div className="metro-control-center">
      {/* Header con estadísticas */}
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
            <span className="stat-value">{videos.length}/{videos.length}</span>
          </div>
        </div>
      </div>

      <div className="control-layout">
        {/* Panel de cámaras (izquierda) */}
        <aside className="cameras-panel">
          <div className="panel-header">
            <h3>Cámaras del Sistema</h3>
            <span className="camera-count">{videos.length}</span>
          </div>
          <div className="cameras-grid">
            {videos.map((video) => (
              <CameraCard
                key={video.id}
                video={video}
                isSelected={selectedVideo?.id === video.id}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </aside>

        {/* Vista principal (centro) */}
        <main className="main-view">
          {selectedVideo ? (
            <>
              <div className="view-header">
                <h2>{selectedVideo.name}</h2>
                <div className="view-controls">
                  <button className="control-btn">
                    <span>📊</span> Reportes
                  </button>
                  <button className="control-btn">
                    <span>⚙️</span> Configurar
                  </button>
                </div>
              </div>
              <div className="video-display">
                <VideoStream video={selectedVideo} onStatsUpdate={setStats} />
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Seleccione una cámara para ver el stream</p>
            </div>
          )}
        </main>

        {/* Panel de resultados (derecha) */}
        <aside className="results-panel">
          <div className="panel-header">
            <h3>Detecciones en Tiempo Real</h3>
          </div>
          <DetectionPanel video={selectedVideo} />
        </aside>
      </div>
    </div>
  );
}

interface CameraCardProps {
  video: VideoInfo;
  isSelected: boolean;
  onClick: () => void;
}

function CameraCard({ video, isSelected, onClick }: CameraCardProps) {
  return (
    <div
      className={`camera-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="camera-preview">
        <div className="camera-icon">📹</div>
        <div className="camera-status">
          <span className="status-dot active"></span>
        </div>
      </div>
      <div className="camera-info">
        <h4>{video.name}</h4>
        <p className="camera-id">ID: {video.id}</p>
      </div>
    </div>
  );
}

interface VideoStreamProps {
  video: VideoInfo;
  onStatsUpdate: (stats: DetectionStats) => void;
}

function VideoStream({ video, onStatsUpdate }: VideoStreamProps) {
  const streamUrl = `${API_BASE_URL}/videos/${video.id}/stream?confidence_threshold=0.5`;
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    setStreamError(false);
    const interval = setInterval(() => {
      onStatsUpdate({
        totalDetections: Math.floor(Math.random() * 50),
        lastUpdate: new Date().toLocaleTimeString(),
        status: "active",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [video.id, onStatsUpdate]);

  return (
    <div className="stream-container">
      {!streamError ? (
        <img
          src={streamUrl}
          alt={`Stream de ${video.name}`}
          className="video-stream"
          onError={() => {
            console.error(`Error loading stream for ${video.name}`);
            setStreamError(true);
          }}
        />
      ) : (
        <div className="stream-error">
          <div className="error-icon">⚠️</div>
          <p>Error al cargar el stream</p>
          <button
            className="retry-btn"
            onClick={() => setStreamError(false)}
          >
            Reintentar
          </button>
        </div>
      )}
      <div className="stream-overlay">
        <div className="overlay-badge">🔴 EN VIVO</div>
      </div>
    </div>
  );
}

interface DetectionPanelProps {
  video: VideoInfo | null;
}

function DetectionPanel({ video }: DetectionPanelProps) {
  const [detections, setDetections] = useState<string[]>([]);

  useEffect(() => {
    if (!video) return;

    const mockDetections = [
      "Persona detectada - Zona A",
      "Vehículo en movimiento",
      "Grupo de personas - Andén 2",
      "Equipaje sin supervisión",
      "Flujo normal de pasajeros",
    ];

    const interval = setInterval(() => {
      const randomDetection =
        mockDetections[Math.floor(Math.random() * mockDetections.length)];
      const timestamp = new Date().toLocaleTimeString();
      setDetections((prev) => [
        `${timestamp} - ${randomDetection}`,
        ...prev.slice(0, 9),
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [video]);

  if (!video) {
    return (
      <div className="empty-detections">
        <p>No hay cámara seleccionada</p>
      </div>
    );
  }

  return (
    <div className="detections-container">
      <div className="detection-stats">
        <div className="stat-card">
          <span className="stat-number">{detections.length}</span>
          <span className="stat-text">Eventos</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">98%</span>
          <span className="stat-text">Precisión</span>
        </div>
      </div>

      <div className="detections-list">
        <h4>Registro de Detecciones</h4>
        {detections.length === 0 ? (
          <p className="no-detections">Esperando detecciones...</p>
        ) : (
          <ul>
            {detections.map((detection, index) => (
              <li key={index} className="detection-item">
                <span className="detection-icon">•</span>
                <span className="detection-text">{detection}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
