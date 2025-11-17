export interface VideoInfo {
  id: string;
  filename: string;
  name: string;
}

export interface VideoListResponse {
  videos: VideoInfo[];
}

export interface DetectionMetricsMessage {
  video_id?: string;
  videoId?: string; // Support both formats
  timestamp: string;
  total_objects?: number;
  totalObjects?: number; // Support both formats
  person_count?: number;
  personCount?: number; // Support both formats
  label_counts?: Record<string, number> | null;
  labelCounts?: Record<string, number> | null; // Support both formats
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

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  version: string;
  environment: string;
}

export interface SystemStatus {
  isOnline: boolean;
  version: string;
  environment: string;
  lastChecked: Date | null;
}