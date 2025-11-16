import { useEffect, useState } from "react";
import type { VideoInfo } from "../../types/video.types";
import { MOCK_DETECTIONS, REFRESH_INTERVAL } from "../../utils/constants";
import { DetectionStats } from "./DetectionStats";
import { DetectionList } from "./DetectionList";

interface DetectionPanelProps {
  video: VideoInfo | null;
}

export function DetectionPanel({ video }: DetectionPanelProps) {
  const [detections, setDetections] = useState<string[]>([]);

  useEffect(() => {
    if (!video) {
      setDetections([]);
      return;
    }

    const interval = setInterval(() => {
      const randomDetection =
        MOCK_DETECTIONS[Math.floor(Math.random() * MOCK_DETECTIONS.length)];
      const timestamp = new Date().toLocaleTimeString();
      setDetections((prev) => [
        `${timestamp} - ${randomDetection}`,
        ...prev.slice(0, 9),
      ]);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [video]);

  if (!video) {
    return (
      <div className="empty-detections">
        <p>No hay cámara seleccionada</p>
      </div>
    );
  }

  return (
    <div className="detections-container">
      <DetectionStats eventCount={detections.length} accuracy={98} />
      <div className="detections-list">
        <h4>Registro de Detecciones</h4>
        <DetectionList detections={detections} />
      </div>
    </div>
  );
}

