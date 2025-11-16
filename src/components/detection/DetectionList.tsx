interface DetectionListProps {
  detections: string[];
}

export function DetectionList({ detections }: DetectionListProps) {
  if (detections.length === 0) {
    return <p className="no-detections">Esperando detecciones...</p>;
  }

  return (
    <ul>
      {detections.map((detection, index) => (
        <li key={index} className="detection-item">
          <span className="detection-icon">•</span>
          <span className="detection-text">{detection}</span>
        </li>
      ))}
    </ul>
  );
}

