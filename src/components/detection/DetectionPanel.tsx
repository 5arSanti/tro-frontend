import { useEffect, useRef, useState } from "react";
import type {
  DetectionConnectionState,
  DetectionMetricsMessage,
  VideoInfo,
} from "../../types/video.types";
import { WS_BASE_URL } from "../../utils/constants";
import { DetectionStats } from "./DetectionStats";
import { DetectionList } from "./DetectionList";

interface DetectionPanelProps {
  video: VideoInfo | null;
  onMetricsUpdate?: (metrics: DetectionMetricsMessage) => void;
  onConnectionChange?: (state: DetectionConnectionState) => void;
}

const MAX_HISTORY = 50;

export function DetectionPanel({
  video,
  onMetricsUpdate,
  onConnectionChange,
}: DetectionPanelProps) {
  const [events, setEvents] = useState<DetectionMetricsMessage[]>([]);
  const [latestMetrics, setLatestMetrics] =
    useState<DetectionMetricsMessage | null>(null);
  const [connectionState, setConnectionState] =
    useState<DetectionConnectionState>("idle");
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      websocketRef.current?.close();
      websocketRef.current = null;
    };
  }, []);

  useEffect(() => {
    websocketRef.current?.close();
    websocketRef.current = null;
    setEvents([]);
    setLatestMetrics(null);

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
        const payload: DetectionMetricsMessage = JSON.parse(event.data);
        console.log(payload);
        
        setLatestMetrics(payload);
        setEvents((prev) => [payload, ...prev].slice(0, MAX_HISTORY));
        onMetricsUpdate?.(payload);
        updateConnectionState("open");
      } catch (error) {
        console.error("Unable to parse detection metrics", error);
      }
    };

    return () => {
      websocket.close();
      websocketRef.current = null;
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
      <DetectionStats
        personCount={latestMetrics?.personCount ?? 0}
        totalObjects={latestMetrics?.totalObjects ?? 0}
        lastUpdate={latestMetrics?.timestamp ?? null}
      />
      <div className="detections-list">
        <div className="detection-list-header">
          <h4>Registro de Detecciones</h4>
          <span className={`connection-indicator ${connectionState}`}>
            {connectionLabel(connectionState)}
          </span>
        </div>
        <DetectionList events={events} />
      </div>
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
