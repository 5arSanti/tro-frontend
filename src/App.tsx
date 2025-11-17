import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/dashboard.css";
import "./styles/navbar.css";
import "./styles/cameras.css";
import "./styles/routing.css";
import type { VideoInfo, VideoListResponse } from "./types/video.types";
import { API_BASE_URL } from "./utils/constants";
import { Navbar } from "./components/layout/Navbar";
import { HomePage } from "./pages/HomePage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { CamerasPage } from "./pages/CamerasPage";
import { RoutingPage } from "./pages/RoutingPage";
import { Loading } from "./components/common/Loading";
import { ErrorDisplay } from "./components/common/ErrorDisplay";

function App() {
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

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage videos={videos} />} />
            <Route path="/monitoring" element={<MonitoringPage videos={videos} />} />
            <Route path="/cameras" element={<CamerasPage videos={videos} />} />
            <Route path="/routing" element={<RoutingPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
