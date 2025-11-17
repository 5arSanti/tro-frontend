import type { TrainModel } from "../../types/routing.types";

interface TrainModelCardProps {
  model: TrainModel;
}

export function TrainModelCard({ model }: TrainModelCardProps) {
  return (
    <div className="train-model-card">
      <div className="train-model-header">
        <div className="train-model-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="12" rx="2"/>
            <path d="M3 12h18"/>
            <path d="M7 8v-3"/>
            <path d="M17 8v-3"/>
          </svg>
        </div>
        <div className="train-model-badge">{model.wagon_count} Vagón{model.wagon_count > 1 ? 'es' : ''}</div>
      </div>
      
      <div className="train-model-body">
        <h3>{model.name}</h3>
        <div className="train-model-specs">
          <div className="spec-item">
            <span className="spec-label">ID</span>
            <span className="spec-value">{model.id}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Capacidad por Vagón</span>
            <span className="spec-value">{model.capacity_per_wagon}</span>
          </div>
          <div className="spec-item highlight">
            <span className="spec-label">Capacidad Total</span>
            <span className="spec-value">{model.total_capacity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

