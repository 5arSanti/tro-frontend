interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export function EmptyState({ icon = "📹", title, message }: EmptyStateProps) {
  return (
    <div className="metro-container">
      <div className="empty-screen">
        <div className="empty-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

