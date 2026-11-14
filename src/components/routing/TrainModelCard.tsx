import type { TrainModel } from "@/types/routing.types";

export function TrainModelCard({ model }: { model: TrainModel }) {
  return (
    <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
      <h3 className="font-semibold">{model.name}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-mute">ID</dt>
          <dd className="font-mono">{model.id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Vagones</dt>
          <dd className="font-mono tabular-nums">{model.wagon_count}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Capacidad por vagón</dt>
          <dd className="font-mono tabular-nums">{model.capacity_per_wagon}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Capacidad total</dt>
          <dd className="font-mono tabular-nums">{model.total_capacity}</dd>
        </div>
      </dl>
    </div>
  );
}
