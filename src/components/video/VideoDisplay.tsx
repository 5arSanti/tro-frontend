import type { VideoInfo, DetectionStats } from "../../types/video.types";
import { VideoStream } from "./VideoStream";

interface VideoDisplayProps {
  selectedVideo: VideoInfo | null;
  onStatsUpdate: (stats: DetectionStats) => void;
}

export function VideoDisplay({
  selectedVideo,
  onStatsUpdate,
}: VideoDisplayProps) {
  if (!selectedVideo) {
    return (
      <div className="no-selection">
        <div className="no-selection-content">
          <div className="no-selection-icon">🎥</div>
          <h3>Sin Cámara Seleccionada</h3>
          <p>Seleccione una cámara del panel izquierdo para ver el stream en tiempo real</p>
        </div>
      </div>
    );
  }

  return (
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
        <VideoStream video={selectedVideo} onStatsUpdate={onStatsUpdate} />
      </div>
    </>
  );
}

