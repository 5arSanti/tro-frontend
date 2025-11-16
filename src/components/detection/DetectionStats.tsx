interface DetectionStatsProps {
  eventCount: number;
  accuracy: number;
}

export function DetectionStats({ eventCount, accuracy }: DetectionStatsProps) {
  return (
    <div className="detection-stats">
      <div className="stat-card">
        <span className="stat-number">{eventCount}</span>
        <span className="stat-text">Eventos</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{accuracy}%</span>
        <span className="stat-text">Precisión</span>
      </div>
    </div>
  );
}

