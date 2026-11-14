import type { VideoInfo } from "@/types/video.types";
import { VideoStream } from "./VideoStream";

export function VideoDisplay({
  selectedVideo,
  onPlayingChange,
}: {
  selectedVideo: VideoInfo;
  onPlayingChange?: (playing: boolean) => void;
}) {
  return (
    <div className="flex min-h-[240px] flex-1 items-center justify-center bg-video">
      <VideoStream video={selectedVideo} onPlayingChange={onPlayingChange} />
    </div>
  );
}
