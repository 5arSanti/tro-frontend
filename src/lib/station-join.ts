import type { Station } from "@/types/routing.types";

export type StationResolution =
  | { kind: "linked"; name: string }
  | { kind: "unlinked" }
  | { kind: "unresolved" };

export function resolveStationLabel(
  cameraId: string,
  stations: Station[] | null,
): StationResolution {
  if (stations === null) return { kind: "unresolved" };
  const station = stations.find((item) => item.camera_id === cameraId);
  if (!station) return { kind: "unlinked" };
  return { kind: "linked", name: station.name };
}

export function stationResolutionText(resolution: StationResolution): string {
  if (resolution.kind === "linked") return resolution.name;
  if (resolution.kind === "unlinked") return "Sin estación";
  return "No se pudo resolver";
}
