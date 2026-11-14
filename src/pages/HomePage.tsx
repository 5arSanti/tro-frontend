import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/context/VideosProvider";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { formatEnvironment } from "@/lib/environment";

export function HomePage() {
  const navigate = useNavigate();
  const { videos, error, loading, refetch } = useVideos();
  const health = useHealthCheck();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Demanda y despacho</h1>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-[2px] border border-fail/40 bg-fail/10 px-3 py-2 text-sm">
          <p>No se pudieron cargar las fuentes de video.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Cámaras listadas</p>
          <p className="mt-2 font-mono text-3xl tabular-nums">{loading ? "—" : videos.length}</p>
        </div>
        <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Versión</p>
          <p className="mt-2 font-mono text-3xl tabular-nums">{health.version}</p>
        </div>
        <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Entorno</p>
          <p className="mt-2 text-2xl font-semibold">{formatEnvironment(health.environment)}</p>
        </div>
        <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
          <p className="text-xs uppercase tracking-wide text-mute">Estado</p>
          <p className="mt-2 text-2xl font-semibold">
            {health.isOnline ? "Operativo" : "Desconectado"}
          </p>
        </div>
      </div>

      <div>
        <Button onClick={() => navigate("/monitoring")}>Ir a monitoreo</Button>
      </div>
    </div>
  );
}
