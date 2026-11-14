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
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-8 py-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Demanda y despacho</h1>
        <p className="mt-3 text-base leading-relaxed text-mute">
          {error ? "No se pudieron cargar las fuentes de video." : `${cameraLabel}. ${statusLabel}.`}
        </p>
      </div>

      {error ? (
        <Button variant="outline" onClick={() => void refetch()}>
          Reintentar
        </Button>
      ) : (
        <div>
          <Button onClick={() => navigate("/monitoring")}>Abrir monitoreo</Button>
        </div>
      )}
    </div>
  );
}
