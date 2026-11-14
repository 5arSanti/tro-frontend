import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { CameraRail } from "@/components/camera/CameraRail";
import { DetectionPanel } from "@/components/detection/DetectionPanel";
import { StationMonitoringPanel } from "@/components/monitoring/StationMonitoringPanel";
import { VideoDisplay } from "@/components/video/VideoDisplay";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/context/VideosProvider";
import type {
  DetectionConnectionState,
  DetectionMetricsMessage,
  DetectionOverview,
  VideoInfo,
} from "@/types/video.types";

const INITIAL_OVERVIEW: DetectionOverview = {
  status: "idle",
  lastUpdate: null,
  personCount: 0,
  totalObjects: 0,
};

export function MonitoringPage() {
  const { videos, error, loading, refetch } = useVideos();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [overview, setOverview] = useState<DetectionOverview>(INITIAL_OVERVIEW);
  const [latestMetrics, setLatestMetrics] = useState<DetectionMetricsMessage | null>(null);

  useEffect(() => {
    const cameraId = searchParams.get("camera");
    if (!cameraId) {
      setSelectedVideo(null);
      return;
    }
    setSelectedVideo(videos.find((video) => video.id === cameraId) ?? null);
  }, [searchParams, videos]);

  useEffect(() => {
    if (!selectedVideo) {
      setOverview(INITIAL_OVERVIEW);
      setLatestMetrics(null);
    }
  }, [selectedVideo]);

  function selectVideo(video: VideoInfo) {
    setSearchParams({ camera: video.id }, { replace: true });
  }

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
      if (!selectedVideo) return INITIAL_OVERVIEW;
      switch (state) {
        case "connecting":
          return { status: "connecting", lastUpdate: null, personCount: 0, totalObjects: 0 };
        case "open":
          if (previous.status === "active") return previous;
          return { ...previous, status: "connecting" };
        case "error":
          return { ...previous, status: "error" };
        case "closed":
        case "idle":
        default:
          return INITIAL_OVERVIEW;
      }
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {error ? (
        <div className="flex items-center justify-between gap-3 border-b border-fail/20 bg-fail/5 px-5 py-3 text-sm">
          <p>No se pudieron cargar las cámaras.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1">
        <CameraRail
          videos={videos}
          selectedId={selectedVideo?.id ?? null}
          onSelect={selectVideo}
        />
        {selectedVideo ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-line px-5 py-3">
              <h2 className="text-base font-extrabold tracking-tight">{selectedVideo.name}</h2>
              <DetectionPanel
                video={selectedVideo}
                onMetricsUpdate={handleMetricsUpdate}
                onConnectionChange={handleConnectionChange}
              />
            </div>
            <VideoDisplay selectedVideo={selectedVideo} />
            <StationMonitoringPanel
              cameraId={selectedVideo.id}
              overview={overview}
              latestMetrics={latestMetrics}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-canvas px-8 text-center">
            <Camera className="size-8 text-activity-ink" strokeWidth={1.5} />
            <p className="text-lg font-extrabold tracking-tight">Elija una cámara</p>
            <p className="max-w-sm text-sm leading-relaxed text-mute">
              {loading
                ? "Cargando fuentes…"
                : "La lista de la izquierda abre el video, el conteo y el plan de despacho."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
