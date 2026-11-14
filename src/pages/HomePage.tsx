import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/context/VideosProvider";
import { useHealthCheck } from "@/hooks/useHealthCheck";

export function HomePage() {
  const navigate = useNavigate();
  const { videos, error, loading, refetch } = useVideos();
  const health = useHealthCheck();
  const cameraLabel = loading
    ? "Cargando cámaras…"
    : `${videos.length} ${videos.length === 1 ? "cámara lista" : "cámaras listas"}`;
  const statusLabel = health.isOnline ? "Sistema operativo" : "Sistema desconectado";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-canvas">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-8 py-16">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-ink">
            Demanda y despacho
          </h1>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-mute">
            {error ? "No se pudieron cargar las fuentes de video." : `${cameraLabel}. ${statusLabel}.`}
          </p>
        </div>

        {error ? (
          <div>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <div>
            <Button onClick={() => navigate("/monitoring")}>Abrir monitoreo</Button>
          </div>
        )}
      </div>
    </div>
  );
}
