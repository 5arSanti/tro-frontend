import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { VideoInfo, VideoListResponse } from "@/types/video.types";
import { API_BASE_URL } from "@/utils/constants";

export type VideosContextValue = {
  videos: VideoInfo[];
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const VideosContext = createContext<VideosContextValue | null>(null);

export function VideosProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/videos/list`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data: VideoListResponse = await response.json();
      setVideos(data.videos);
    } catch (err) {
      setVideos([]);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({ videos, error, loading, refetch }),
    [videos, error, loading, refetch],
  );

  return <VideosContext.Provider value={value}>{children}</VideosContext.Provider>;
}

export function useVideos(): VideosContextValue {
  const ctx = useContext(VideosContext);
  if (!ctx) throw new Error("useVideos must be used within VideosProvider");
  return ctx;
}
