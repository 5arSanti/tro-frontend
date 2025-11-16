export interface VideoInfo {
  id: string;
  filename: string;
  name: string;
}

export interface VideoListResponse {
  videos: VideoInfo[];
}

export interface DetectionStats {
  totalDetections: number;
  lastUpdate: string;
  status: "active" | "idle" | "error";
}

export type ViewMode = "dashboard" | "monitoring" | "camera";

