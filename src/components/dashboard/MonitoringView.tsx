import { useEffect, useState } from "react";
import type {
  DetectionConnectionState,
  DetectionMetricsMessage,
  DetectionOverview,
  VideoInfo,
} from "../../types/video.types";
import { Header } from "../layout/Header";
import { CameraPanel } from "../camera/CameraPanel";
import { VideoDisplay } from "../video/VideoDisplay";
import { DetectionPanel } from "../detection/DetectionPanel";

interface MonitoringViewProps {
  videos: VideoInfo[];
}

const INITIAL_OVERVIEW: DetectionOverview = {
  status: "idle",
  lastUpdate: null,
  personCount: 0,
  totalObjects: 0,
};

export function MonitoringView({ videos }: MonitoringViewProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [overview, setOverview] = useState<DetectionOverview>(INITIAL_OVERVIEW);

  useEffect(() => {
    if (!selectedVideo) {
      setOverview(INITIAL_OVERVIEW);
    }
  }, [selectedVideo]);

  const handleMetricsUpdate = (metrics: DetectionMetricsMessage) => {
    setOverview({
      status: "active",
      lastUpdate: new Date(metrics.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      personCount: metrics.personCount ?? metrics.person_count ?? 0,
      totalObjects: metrics.totalObjects ?? metrics.total_objects ?? 0,
    });
  };

  const handleConnectionChange = (state: DetectionConnectionState) => {
    setOverview((previous) => {
      if (!selectedVideo) {
        return INITIAL_OVERVIEW;
      }

      switch (state) {
        case "connecting":
          return {
            status: "connecting",
            lastUpdate: null,
            personCount: 0,
            totalObjects: 0,
          };
        case "open":
          if (previous.status === "active") {
            return previous;
          }
          return {
            ...previous,
            status: "connecting",
          };
        case "error":
          return {
            ...previous,
            status: "error",
          };
        case "closed":
        case "idle":
        default:
          return INITIAL_OVERVIEW;
      }
    });
  };

  return (
    <div className="monitoring-view">
      <Header
        overview={overview}
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
          <VideoDisplay selectedVideo={selectedVideo} />
        </main>

        <aside className="results-panel">
          <div className="panel-header">
            <h3>Detecciones en Tiempo Real</h3>
          </div>
          <DetectionPanel
            video={selectedVideo}
            onMetricsUpdate={handleMetricsUpdate}
            onConnectionChange={handleConnectionChange}
          />
        </aside>
      </div>
    </div>
  );
}
