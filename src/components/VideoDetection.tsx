import { useEffect, useState } from "react";
import type { VideoInfo, VideoListResponse, ViewMode } from "../types/video.types";
import { API_BASE_URL } from "../utils/constants";
import { Loading } from "./common/Loading";
import { ErrorDisplay } from "./common/ErrorDisplay";
import { EmptyState } from "./common/EmptyState";
import { Dashboard } from "./dashboard/Dashboard";
import { MonitoringView } from "./dashboard/MonitoringView";

export function VideoDetection() {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/videos/list`);
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data: VideoListResponse = await response.json();
        setVideos(data.videos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;
  if (videos.length === 0) {
    return (
      <EmptyState
        title="Sin Cámaras Disponibles"
        message="No hay cámaras configuradas en el sistema"
      />
    );
  }

  return (
    <div className="video-detection-container">
      {viewMode === "dashboard" && (
        <Dashboard
          videos={videos}
          onStartMonitoring={() => setViewMode("monitoring")}
        />
      )}
      {viewMode === "monitoring" && <MonitoringView videos={videos} />}
    </div>
  );
}
