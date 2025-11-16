import { useEffect, useState } from "react";
import type { VideoInfo, DetectionStats } from "../../types/video.types";
import { API_BASE_URL, STATS_UPDATE_INTERVAL } from "../../utils/constants";

interface VideoStreamProps {
  video: VideoInfo;
  onStatsUpdate: (stats: DetectionStats) => void;
}

export function VideoStream({ video, onStatsUpdate }: VideoStreamProps) {
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
    }, STATS_UPDATE_INTERVAL);

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
          <button className="retry-btn" onClick={() => setStreamError(false)}>
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

