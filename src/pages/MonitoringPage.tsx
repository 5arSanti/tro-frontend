import { useEffect, useState } from "react";
import type {
  DetectionConnectionState,
  DetectionMetricsMessage,
  DetectionOverview,
  VideoInfo,
} from "../types/video.types";
import { Header } from "../components/layout/Header";
import { CameraPanel } from "../components/camera/CameraPanel";
import { VideoDisplay } from "../components/video/VideoDisplay";
import { DetectionPanel } from "../components/detection/DetectionPanel";
import { StationMonitoringPanel } from "../components/monitoring/StationMonitoringPanel";
import "../styles/monitoring.css";

interface MonitoringPageProps {
  videos: VideoInfo[];
}

const INITIAL_OVERVIEW: DetectionOverview = {
  status: "idle",
  lastUpdate: null,
  personCount: 0,
  totalObjects: 0,
};

export function MonitoringPage({ videos }: MonitoringPageProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [overview, setOverview] = useState<DetectionOverview>(INITIAL_OVERVIEW);
  const [latestMetrics, setLatestMetrics] = useState<DetectionMetricsMessage | null>(null);

  useEffect(() => {
    if (!selectedVideo) {
      setOverview(INITIAL_OVERVIEW);
    }
  }, [selectedVideo]);

  const handleMetricsUpdate = (metrics: DetectionMetricsMessage) => {
    setLatestMetrics(metrics);
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
            <h3>DETECCIONES EN TIEMPO REAL</h3>
          </div>
          {selectedVideo ? (
            <>
              <DetectionPanel
                video={selectedVideo}
                onMetricsUpdate={handleMetricsUpdate}
                onConnectionChange={handleConnectionChange}
              />
              <StationMonitoringPanel 
                cameraId={selectedVideo.id}
                latestMetrics={latestMetrics}
              />
            </>
          ) : (
            <div className="no-camera-selected">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                <polyline points="17 2 12 7 7 2"/>
              </svg>
              <p>Seleccione una cámara para ver las detecciones</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

