import type { Station } from "@/types/routing.types";

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
      className={`rounded-[2px] border border-white/10 bg-canvas/40 p-4 ${isSelected ? "border-energy" : ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <h3 className="font-semibold">{station.name}</h3>
      <p className="mt-1 text-xs text-mute">{station.line}</p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-mute">ID</dt>
          <dd className="font-mono">{station.id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Cámara</dt>
          <dd className="font-mono">{station.camera_id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Tiempo de viaje</dt>
          <dd className="font-mono">{station.travel_time_seconds}s</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-mute">Trenes</p>
      <p className="text-sm">{station.supported_trains.map((train) => train.name).join(", ")}</p>
    </div>
  );
}
