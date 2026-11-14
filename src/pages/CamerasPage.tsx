import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useVideos } from "@/context/VideosProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { resolveStationLabel, stationResolutionText } from "@/lib/station-join";
import { cn } from "@/lib/utils";
import { routingService } from "@/services/routingService";
import type { Station } from "@/types/routing.types";
import type { VideoInfo } from "@/types/video.types";

function CameraDetail({
  video,
  stationLabel,
}: {
  video: VideoInfo;
  stationLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold">{video.name}</h2>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4 border-b border-white/10 py-2">
          <dt className="text-mute">ID</dt>
          <dd className="font-mono">{video.id}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-white/10 py-2">
          <dt className="text-mute">Fuente</dt>
          <dd className="font-mono">{video.filename}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-mute">Estación</dt>
          <dd>{stationLabel}</dd>
        </div>
      </dl>
      <Button asChild>
        <Link to={`/monitoring?camera=${video.id}`}>Ver en monitoreo</Link>
      </Button>
    </div>
  );
}

export function CamerasPage() {
  const { videos, error, loading, refetch } = useVideos();
  const isMobile = useIsMobile();
  const [stations, setStations] = useState<Station[] | null>([]);
  const [selected, setSelected] = useState<VideoInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    routingService
      .getStations()
      .then((response) => {
        if (!cancelled) setStations(response.stations);
      })
      .catch(() => {
        if (!cancelled) setStations(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const labelFor = (id: string) => stationResolutionText(resolveStationLabel(id, stations));

  return (
    <div className="flex min-h-0 flex-1">
      <div className="min-w-0 flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Cámaras</h1>
        <p className="mt-1 text-sm text-mute">Fuentes listadas por el prototipo.</p>

        {error ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[2px] border border-fail/40 bg-fail/10 px-3 py-2 text-sm">
            <p>No se pudieron cargar las fuentes de video.</p>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        ) : null}

        {!loading && videos.length === 0 && !error ? (
          <p className="mt-8 text-mute">No hay fuentes listadas.</p>
        ) : (
          <table className="mt-6 w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-2 py-2 font-medium">Nombre</th>
                <th className="px-2 py-2 font-medium">ID</th>
                <th className="px-2 py-2 font-medium">Fuente</th>
                <th className="px-2 py-2 font-medium">Estación</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr
                  key={video.id}
                  onClick={() => setSelected(video)}
                  className={cn(
                    "cursor-pointer border-t border-white/10 hover:bg-white/5",
                    selected?.id === video.id && "bg-energy/10",
                  )}
                >
                  <td className="px-2 py-3">{video.name}</td>
                  <td className="px-2 py-3 font-mono">{video.id}</td>
                  <td className="px-2 py-3 font-mono">{video.filename}</td>
                  <td className="px-2 py-3">{labelFor(video.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isMobile ? (
        <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent side="right" className="bg-panel text-paper">
            {selected ? (
              <CameraDetail video={selected} stationLabel={labelFor(selected.id)} />
            ) : null}
          </SheetContent>
        </Sheet>
      ) : selected ? (
        <aside className="w-[320px] shrink-0 border-l border-white/10">
          <CameraDetail video={selected} stationLabel={labelFor(selected.id)} />
        </aside>
      ) : (
        <aside className="hidden w-[320px] shrink-0 border-l border-white/10 lg:block">
          <p className="p-4 text-sm text-mute">Seleccione una fila.</p>
        </aside>
      )}
    </div>
  );
}
