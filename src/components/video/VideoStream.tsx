import { useEffect, useState } from "react";
import type { VideoInfo } from "@/types/video.types";
import { API_BASE_URL } from "@/utils/constants";

interface VideoStreamProps {
  video: VideoInfo;
  onPlayingChange?: (playing: boolean) => void;
}

export function VideoStream({ video, onPlayingChange }: VideoStreamProps) {
  const streamUrl = `${API_BASE_URL}/videos/${video.id}/stream?confidence_threshold=0.5`;
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    setStreamError(false);
    onPlayingChange?.(true);
  }, [video.id, onPlayingChange]);

  return (
    <div className="relative h-full w-full">
      {!streamError ? (
        <img
          src={streamUrl}
          alt={`Stream de ${video.name}`}
          className="max-h-full w-full object-contain"
          onError={() => {
            setStreamError(true);
            onPlayingChange?.(false);
          }}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
          <p>Error al cargar el stream de video</p>
          <button
            type="button"
            className="rounded-none border border-energy px-3 py-2 text-sm text-white"
            onClick={() => {
              setStreamError(false);
              onPlayingChange?.(true);
            }}
          >
            Reintentar conexión
          </button>
        </div>
      )}
      {!streamError ? (
        <div className="absolute top-4 right-4">
          <span className="rounded-none bg-fail px-2 py-0.5 text-[11px] font-semibold text-white">
            En vivo
          </span>
        </div>
      ) : null}
    </div>
  );
}
