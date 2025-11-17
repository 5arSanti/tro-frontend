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
    <div className="detection-stats">
      <div className="stat-card highlight">
        <span className="stat-label">PERSONAS</span>
        <span className="stat-number">{personCount}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">OBJETOS</span>
        <span className="stat-number">{totalObjects}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">ÚLTIMA ACTUALIZACIÓN</span>
        <span className="stat-value">{lastUpdate ? formatTime(lastUpdate) : "--:--:--"}</span>
      </div>
    </div>
  );
}
