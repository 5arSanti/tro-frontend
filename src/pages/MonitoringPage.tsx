import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CameraRail } from "@/components/camera/CameraRail";
import { DetectionPanel } from "@/components/detection/DetectionPanel";
import { Header } from "@/components/layout/Header";
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
  const [streamPlaying, setStreamPlaying] = useState(false);

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
      setStreamPlaying(false);
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
        <div className="flex items-center justify-between gap-3 border-b border-fail/40 bg-fail/10 px-3 py-2 text-sm">
          <p>No se pudieron cargar las fuentes de video.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      <Header
        overview={overview}
        totalCameras={videos.length}
        activeCameras={selectedVideo ? 1 : 0}
      />

      <div className="flex min-h-0 flex-1">
        <CameraRail
          videos={videos}
          selectedId={selectedVideo?.id ?? null}
          onSelect={selectVideo}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          {selectedVideo ? (
            <>
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
                <h2 className="text-sm font-medium">{selectedVideo.name}</h2>
                {streamPlaying ? (
                  <span className="rounded-[2px] bg-fail px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                    EN VIVO
                  </span>
                ) : null}
                <div className="ml-auto">
                  <DetectionPanel
                    video={selectedVideo}
                    onMetricsUpdate={handleMetricsUpdate}
                    onConnectionChange={handleConnectionChange}
                  />
                </div>
              </div>
              <VideoDisplay selectedVideo={selectedVideo} onPlayingChange={setStreamPlaying} />
              <div className="border-t border-white/10 p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-mute">
                  Estación y despacho
                </h3>
                <StationMonitoringPanel
                  cameraId={selectedVideo.id}
                  latestMetrics={latestMetrics}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-mute">
              <p className="text-lg text-paper">Elija una cámara del listado</p>
              {loading ? <p className="text-sm">Cargando fuentes…</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
