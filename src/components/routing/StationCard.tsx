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
        "bg-canvas p-5",
        isSelected && "ring-1 ring-energy",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <h3 className="font-semibold">{station.name}</h3>
      <p className="mt-0.5 text-sm text-mute">{station.line}</p>
      <dl className="mt-4 divide-y divide-line text-sm">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-mute">Cámara</dt>
          <dd className="tabular-nums">{station.camera_id}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-mute">Tiempo de viaje</dt>
          <dd className="tabular-nums">{station.travel_time_seconds}s</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-mute">
        {station.supported_trains.map((train) => train.name).join(", ")}
      </p>
    </div>
  );
}
