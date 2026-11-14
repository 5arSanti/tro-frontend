import type { Station } from "@/types/routing.types";
import { cn } from "@/lib/utils";

export function StationCard({
  station,
  onClick,
  isSelected = false,
}: {
  station: Station;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-deep p-5 text-paper",
        isSelected && "ring-1 ring-energy",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <h3 className="font-extrabold tracking-[-0.04em]">{station.name}</h3>
      <p className="mt-0.5 text-sm text-paper/70">{station.line}</p>
      <dl className="mt-4 divide-y divide-white/15 text-sm">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-paper/70">Cámara</dt>
          <dd className="tabular-nums">{station.camera_id}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-paper/70">Tiempo de viaje</dt>
          <dd className="tabular-nums">{station.travel_time_seconds}s</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-paper/70">
        {station.supported_trains.map((train) => train.name).join(", ")}
      </p>
    </div>
  );
}
