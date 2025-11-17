import { useEffect, useState } from "react";
import type { VideoInfo } from "../../types/video.types";
import { API_BASE_URL } from "../../utils/constants";

interface VideoStreamProps {
  video: VideoInfo;
}

export function VideoStream({ video }: VideoStreamProps) {
  const streamUrl = `${API_BASE_URL}/videos/${video.id}/stream?confidence_threshold=0.5`;
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    setStreamError(false);
  }, [video.id]);

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
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Error al cargar el stream de video</p>
          <button className="retry-btn" onClick={() => setStreamError(false)}>
            Reintentar Conexión
          </button>
        </div>
      )}
      <div className="stream-overlay">
        <div className="overlay-badge">
          <span className="live-indicator"></span>
          EN VIVO
        </div>
      </div>
    </div>
  );
}
