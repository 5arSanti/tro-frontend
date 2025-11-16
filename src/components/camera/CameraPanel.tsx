import type { VideoInfo } from "../../types/video.types";
import { CameraCard } from "./CameraCard";

interface CameraPanelProps {
  videos: VideoInfo[];
  selectedVideo: VideoInfo | null;
  onSelectVideo: (video: VideoInfo) => void;
}

export function CameraPanel({
  videos,
  selectedVideo,
  onSelectVideo,
}: CameraPanelProps) {
  return (
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
            onClick={() => onSelectVideo(video)}
          />
        ))}
      </div>
    </aside>
  );
}

