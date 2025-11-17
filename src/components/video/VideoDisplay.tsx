import type { VideoInfo } from "../../types/video.types";
import { VideoStream } from "./VideoStream";

interface VideoDisplayProps {
  selectedVideo: VideoInfo | null;
}

export function VideoDisplay({ selectedVideo }: VideoDisplayProps) {
  if (!selectedVideo) {
    return (
      <div className="no-selection">
        <div className="no-selection-content">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <h3>Sin Cámara Seleccionada</h3>
          <p>
            Seleccione una cámara del panel izquierdo para iniciar la visualización en tiempo real
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="view-header">
        <h2>{selectedVideo.name}</h2>
        <div className="view-info">
          <span className="camera-id-badge">ID: {selectedVideo.id}</span>
        </div>
      </div>
      <div className="video-display">
        <VideoStream video={selectedVideo} />
      </div>
    </>
  );
}
