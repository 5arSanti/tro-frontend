interface DetectionStatsProps {
  personCount: number;
  totalObjects: number;
  lastUpdate: string | null;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function DetectionStats({
  personCount,
  totalObjects,
  lastUpdate,
}: DetectionStatsProps) {
  return (
    <div className="flex items-center gap-3 text-sm tabular-nums text-mute">
      <span>{personCount} personas</span>
      <span>{totalObjects} objetos</span>
      <span>{lastUpdate ? formatTime(lastUpdate) : "--:--:--"}</span>
    </div>
  );
}
