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
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-white/10 bg-canvas/40">
      <div className="flex items-center justify-between px-3 py-3 text-xs font-medium text-mute">
        <span>Cámaras</span>
        <span className="font-mono tabular-nums">{videos.length}</span>
      </div>
      <div className="flex flex-col gap-1 overflow-auto p-2">
        {videos.map((video) => {
          const selected = selectedId === video.id;
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => onSelect(video)}
              className={cn(
                "rounded-[2px] px-2 py-2 text-left transition-colors duration-200",
                selected ? "bg-energy text-ink" : "text-paper hover:bg-white/10",
              )}
            >
              <p className="truncate text-sm font-medium">{video.name}</p>
              <p className={cn("truncate font-mono text-[11px]", selected ? "text-ink/70" : "text-mute")}>
                {video.id}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
