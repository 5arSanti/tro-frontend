import type { VideoInfo } from "@/types/video.types";
import { cn } from "@/lib/utils";

export function CameraRail({
  videos,
  selectedId,
  onSelect,
}: {
  videos: VideoInfo[];
  selectedId: string | null;
  onSelect: (video: VideoInfo) => void;
}) {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col border-r border-line bg-canvas">
      <div className="px-4 py-4">
        <p className="text-sm font-semibold">Cámaras</p>
        <p className="mt-0.5 text-xs text-mute">{videos.length} fuentes</p>
      </div>
      <div className="flex flex-col gap-0.5 overflow-auto px-2 pb-3">
        {videos.map((video) => {
          const selected = selectedId === video.id;
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => onSelect(video)}
              className={cn(
                "px-3 py-2.5 text-left transition-colors duration-200",
                selected
                  ? "bg-energy text-ink"
                  : "text-ink hover:bg-canvas hover:text-activity-ink",
              )}
            >
              <p className="truncate text-sm font-semibold">{video.name}</p>
              <p className={cn("truncate text-xs", selected ? "text-ink/70" : "text-mute")}>
                {video.id}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
