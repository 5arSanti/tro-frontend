import { useNavigate } from "react-router-dom";
import { TornsLockup } from "@/components/brand/TornsLockup";
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
    <div className="product-band flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-8 py-16">
        <TornsLockup size="hero" />
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Demanda y despacho</h1>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-paper/70">
            {error ? "No se pudieron cargar las fuentes de video." : `${cameraLabel}. ${statusLabel}.`}
          </p>
        </div>

        {error ? (
          <div>
            <Button variant="outline" className="border-paper/30 text-paper hover:bg-white/10" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <div>
            <Button variant="energy" onClick={() => navigate("/monitoring")}>
              Abrir monitoreo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
