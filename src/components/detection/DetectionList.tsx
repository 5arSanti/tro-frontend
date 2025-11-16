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
      {events.map((event, index) => {
        const personCount = event.personCount ?? event.person_count ?? 0;
        const totalObjects = event.totalObjects ?? event.total_objects ?? 0;
        const labelCounts = event.labelCounts ?? event.label_counts ?? {};

        // Safely check if labelCounts is valid and has keys
        const hasLabels =
          labelCounts &&
          typeof labelCounts === "object" &&
          !Array.isArray(labelCounts) &&
          Object.keys(labelCounts).length > 0;

        return (
          <li key={`${event.timestamp}-${index}`} className="detection-item">
            <div className="detection-time">{formatTime(event.timestamp)}</div>
            <div className="detection-meta">
              <span className="meta-highlight">{personCount} personas</span>
              <span>{totalObjects} objetos</span>
            </div>
            {hasLabels && (
              <div className="detection-labels">
                {Object.entries(labelCounts).map(([label, count]) => (
                  <span key={label} className="label-chip">
                    {label}: {count}
                  </span>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
