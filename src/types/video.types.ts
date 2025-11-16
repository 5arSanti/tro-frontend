export interface VideoInfo {
  id: string;
  filename: string;
  name: string;
}

export interface VideoListResponse {
  videos: VideoInfo[];
}

export interface DetectionMetricsMessage {
  videoId: string;
  timestamp: string;
  totalObjects: number;
  personCount: number;
  labelCounts: Record<string, number>;
}

export interface DetectionOverview {
  status: "idle" | "connecting" | "active" | "error";
  lastUpdate: string | null;
  personCount: number;
  totalObjects: number;
}

export type DetectionConnectionState =
  | "idle"
  | "connecting"
  | "open"
  | "closed"
  | "error";

export type ViewMode = "dashboard" | "monitoring" | "camera";
