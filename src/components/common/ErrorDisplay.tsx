import { Button } from "@/components/ui/button";

export function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="m-8 bg-fail/10 p-4 text-sm">
      <p className="font-medium">No se pudo cargar el despacho.</p>
      <p className="mt-1 text-mute">{error}</p>
      <Button className="mt-3" variant="outline" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
