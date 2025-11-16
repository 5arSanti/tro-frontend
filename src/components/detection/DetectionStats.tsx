interface DetectionStatsProps {
  personCount: number;
  totalObjects: number;
  lastUpdate: string | null;
}

export function DetectionStats({
  personCount,
  totalObjects,
  lastUpdate,
}: DetectionStatsProps) {
  return (
    <div className="detection-stats">
      <div className="stat-card highlight">
        <span className="stat-label">Personas detectadas</span>
        <span className="stat-number">{personCount}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Objetos totales</span>
        <span className="stat-number">{totalObjects}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Última lectura</span>
        <span className="stat-value">{lastUpdate ?? "--"}</span>
      </div>
    </div>
  );
}
