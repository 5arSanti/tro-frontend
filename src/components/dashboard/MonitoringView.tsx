import { useState } from "react";
import type { VideoInfo, DetectionStats } from "../../types/video.types";
import { Header } from "../layout/Header";
import { CameraPanel } from "../camera/CameraPanel";
import { VideoDisplay } from "../video/VideoDisplay";
import { DetectionPanel } from "../detection/DetectionPanel";

interface MonitoringViewProps {
  videos: VideoInfo[];
}

export function MonitoringView({ videos }: MonitoringViewProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [stats, setStats] = useState<DetectionStats>({
    totalDetections: 0,
    lastUpdate: new Date().toLocaleTimeString(),
    status: "idle",
  });

  return (
    <div className="monitoring-view">
      <Header
        stats={stats}
        totalCameras={videos.length}
        activeCameras={selectedVideo ? 1 : 0}
      />

      <div className="control-layout">
        <CameraPanel
          videos={videos}
          selectedVideo={selectedVideo}
          onSelectVideo={setSelectedVideo}
        />

        <main className="main-view">
          <VideoDisplay
            selectedVideo={selectedVideo}
            onStatsUpdate={setStats}
          />
        </main>

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

