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

