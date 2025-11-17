import type { VideoInfo } from "../../types/video.types";

interface CameraCardProps {
  video: VideoInfo;
  isSelected: boolean;
  onClick: () => void;
}

export function CameraCard({ video, isSelected, onClick }: CameraCardProps) {
  return (
    <div
      className={`camera-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="camera-preview">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 7l-7 5 7 5V7z"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
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

