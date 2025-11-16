import type { DetectionMetricsMessage } from "../../types/video.types";

interface DetectionListProps {
  events: DetectionMetricsMessage[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function DetectionList({ events }: DetectionListProps) {
  if (events.length === 0) {
    return <p className="no-detections">Esperando detecciones...</p>;
  }

  return (
    <ul className="detection-events">
      {events.map((event, index) => (
        <li key={`${event.timestamp}-${index}`} className="detection-item">
          <div className="detection-time">{formatTime(event.timestamp)}</div>
          <div className="detection-meta">
            <span className="meta-highlight">{event.personCount} personas</span>
            <span>{event.totalObjects} objetos</span>
          </div>
          {Object.keys(event.labelCounts).length > 0 && (
            <div className="detection-labels">
              {Object.entries(event.labelCounts).map(([label, count]) => (
                <span key={label} className="label-chip">
                  {label}: {count}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
