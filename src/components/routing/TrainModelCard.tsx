import type { TrainModel } from "@/types/routing.types";

export function TrainModelCard({ model }: { model: TrainModel }) {
  return (
    <div className="bg-canvas p-5">
      <h3 className="font-semibold">{model.name}</h3>
      <p className="mt-1 text-sm text-mute">
        {model.wagon_count} vagones · {model.total_capacity} de capacidad
      </p>
      <dl className="mt-4 divide-y divide-line text-sm">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-mute">Por vagón</dt>
          <dd className="tabular-nums">{model.capacity_per_wagon}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-mute">Capacidad total</dt>
          <dd className="tabular-nums">{model.total_capacity}</dd>
        </div>
      </dl>
    </div>
  );
}
