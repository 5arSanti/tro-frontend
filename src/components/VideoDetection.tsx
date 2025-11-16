import { useEffect, useState } from "react";

interface VideoInfo {
  id: string;
  filename: string;
  name: string;
}

interface VideoListResponse {
  videos: VideoInfo[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function VideoDetection() {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="video-container">
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-container">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="video-container">
        <p>No videos available</p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
}

interface VideoPlayerProps {
  video: VideoInfo;
}

function VideoPlayer({ video }: VideoPlayerProps) {
  const streamUrl = `${API_BASE_URL}/videos/${video.id}/stream?confidence_threshold=0.5`;

  return (
    <div className="video-card">
      <h3>{video.name}</h3>
      <div className="video-wrapper">
        <img
          src={streamUrl}
          alt={`${video.name} with detection`}
          className="video-stream"
          onError={(e) => {
            console.error(`Error loading video stream for ${video.name}`);
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>
    </div>
  );
}
