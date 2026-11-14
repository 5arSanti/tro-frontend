import type { TrainModel } from "@/types/routing.types";

export function TrainModelCard({ model }: { model: TrainModel }) {
  return (
    <div className="bg-deep p-5 text-paper">
      <h3 className="font-extrabold tracking-[-0.04em]">{model.name}</h3>
      <p className="mt-1 text-sm text-paper/70">
        {model.wagon_count} vagones · {model.total_capacity} de capacidad
      </p>
      <dl className="mt-4 divide-y divide-white/15 text-sm">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-paper/70">Por vagón</dt>
          <dd className="tabular-nums">{model.capacity_per_wagon}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-paper/70">Capacidad total</dt>
          <dd className="tabular-nums text-energy">{model.total_capacity}</dd>
        </div>
      </dl>
    </div>
  );
}
