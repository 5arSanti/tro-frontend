interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="metro-container">
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h2>Error del Sistema</h2>
        <p>{error}</p>
      </div>
    </div>
  );
}

