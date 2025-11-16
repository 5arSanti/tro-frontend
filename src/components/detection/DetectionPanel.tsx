import { useEffect, useRef, useState } from "react";
import type {
  DetectionConnectionState,
  DetectionMetricsMessage,
  VideoInfo,
} from "../../types/video.types";
import { WS_BASE_URL } from "../../utils/constants";
import { DetectionStats } from "./DetectionStats";

interface DetectionPanelProps {
  video: VideoInfo | null;
  onMetricsUpdate?: (metrics: DetectionMetricsMessage) => void;
  onConnectionChange?: (state: DetectionConnectionState) => void;
}

const UPDATE_INTERVAL_MS = 1000; // Update every 1 second

export function DetectionPanel({
  video,
  onMetricsUpdate,
  onConnectionChange,
}: DetectionPanelProps) {
  const [latestMetrics, setLatestMetrics] =
    useState<DetectionMetricsMessage | null>(null);
  const [connectionState, setConnectionState] =
    useState<DetectionConnectionState>("idle");
  const websocketRef = useRef<WebSocket | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const pendingMetricsRef = useRef<DetectionMetricsMessage | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      websocketRef.current?.close();
      websocketRef.current = null;
    };
  }, []);

  useEffect(() => {
    websocketRef.current?.close();
    websocketRef.current = null;
    setLatestMetrics(null);
    lastUpdateTimeRef.current = 0;
    pendingMetricsRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!video) {
      updateConnectionState("idle");
      return;
    }

    const wsUrl = `${WS_BASE_URL}/videos/ws/${video.id}/detections`;

    updateConnectionState("connecting");

    const websocket = new WebSocket(wsUrl);
    websocketRef.current = websocket;

    websocket.onopen = () => {
      updateConnectionState("open");
    };

    websocket.onclose = () => {
      updateConnectionState("closed");
    };

    websocket.onerror = () => {
      updateConnectionState("error");
    };

    websocket.onmessage = (event: MessageEvent<string>) => {
      try {
        const rawPayload = JSON.parse(event.data);
        
        // Normalize payload: convert snake_case to camelCase and ensure all fields exist
        const payload: DetectionMetricsMessage = {
          videoId: rawPayload.video_id || rawPayload.videoId || "",
          timestamp: rawPayload.timestamp || new Date().toISOString(),
          totalObjects: rawPayload.total_objects ?? rawPayload.totalObjects ?? 0,
          personCount: rawPayload.person_count ?? rawPayload.personCount ?? 0,
          labelCounts: rawPayload.label_counts || rawPayload.labelCounts || {},
        };
        
        // Store the latest metrics but throttle updates to once per second
        pendingMetricsRef.current = payload;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
        
        if (timeSinceLastUpdate >= UPDATE_INTERVAL_MS) {
          // Update immediately if enough time has passed
          setLatestMetrics(payload);
          onMetricsUpdate?.(payload);
          lastUpdateTimeRef.current = now;
          pendingMetricsRef.current = null;
          updateConnectionState("open");
          // Clear any pending timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        } else {
          // Schedule update for the remaining time (only if no timeout is already scheduled)
          if (!timeoutRef.current) {
            const remainingTime = UPDATE_INTERVAL_MS - timeSinceLastUpdate;
            timeoutRef.current = setTimeout(() => {
              if (pendingMetricsRef.current) {
                setLatestMetrics(pendingMetricsRef.current);
                onMetricsUpdate?.(pendingMetricsRef.current);
                lastUpdateTimeRef.current = Date.now();
                pendingMetricsRef.current = null;
                updateConnectionState("open");
              }
              timeoutRef.current = null;
            }, remainingTime);
          }
        }
      } catch (error) {
        console.error("Unable to parse detection metrics", error);
        updateConnectionState("error");
      }
    };

    return () => {
      websocket.close();
      websocketRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  function updateConnectionState(state: DetectionConnectionState) {
    setConnectionState(state);
    onConnectionChange?.(state);
  }

  if (!video) {
    return (
      <div className="empty-detections">
        <p>No hay cámara seleccionada</p>
      </div>
    );
  }

  return (
    <div className="detections-container">
      <div className="detection-status-header">
        <h3>Detecciones en Tiempo Real</h3>
        <span className={`connection-indicator ${connectionState}`}>
          {connectionLabel(connectionState)}
        </span>
      </div>
      <DetectionStats
        personCount={
          latestMetrics?.personCount ?? latestMetrics?.person_count ?? 0
        }
        totalObjects={
          latestMetrics?.totalObjects ?? latestMetrics?.total_objects ?? 0
        }
        lastUpdate={latestMetrics?.timestamp ?? null}
      />
    </div>
  );
}

function connectionLabel(state: DetectionConnectionState): string {
  switch (state) {
    case "connecting":
      return "Conectando";
    case "open":
      return "En vivo";
    case "error":
      return "Error";
    case "closed":
      return "Finalizado";
    default:
      return "Sin conexión";
  }
}
