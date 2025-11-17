import { useState } from "react";
import type { Station, DispatchPlan } from "../../types/routing.types";
import { routingService } from "../../services/routingService";

interface DispatchPanelProps {
  stations: Station[];
  onDispatchCalculated?: (plan: DispatchPlan) => void;
}

export function DispatchPanel({ stations, onDispatchCalculated }: DispatchPanelProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [passengerCount, setPassengerCount] = useState<string>("");
  const [persist, setPersist] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DispatchPlan | null>(null);

  const handleCalculate = async () => {
    if (!selectedStationId || !passengerCount) {
      setError("Por favor seleccione una estación e ingrese el número de pasajeros");
      return;
    }

    const count = parseInt(passengerCount, 10);
    if (isNaN(count) || count < 0) {
      setError("El número de pasajeros debe ser un valor válido");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const plan = await routingService.computeDispatchPlan({
        station_id: selectedStationId,
        passenger_count: count,
        persist,
      });

      setResult(plan);
      onDispatchCalculated?.(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular el plan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedStationId("");
    setPassengerCount("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="dispatch-panel">
      <div className="dispatch-panel-header">
        <h3>Calculadora de Despacho</h3>
        <p>Simule el plan de despacho óptimo para una estación</p>
      </div>

      <div className="dispatch-form">
        <div className="form-group">
          <label htmlFor="station-select">Estación</label>
          <select
            id="station-select"
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccione una estación</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.line})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="passenger-input">Número de Pasajeros</label>
          <input
            id="passenger-input"
            type="number"
            min="0"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            placeholder="Ej: 150"
            disabled={loading}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={persist}
              onChange={(e) => setPersist(e.target.checked)}
              disabled={loading}
            />
            <span>Actualizar estado en tiempo real</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            className="btn-calculate"
            onClick={handleCalculate}
            disabled={loading || !selectedStationId || !passengerCount}
          >
            {loading ? "Calculando..." : "Calcular Plan"}
          </button>
          <button
            className="btn-reset"
            onClick={handleReset}
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div className="dispatch-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="dispatch-result">
          <div className="result-header">
            <h4>Plan de Despacho Calculado</h4>
            <span className="result-status">{result.status}</span>
          </div>

          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Estación</span>
              <span className="result-value">{result.station_name}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Pasajeros</span>
              <span className="result-value highlight">{result.passenger_count}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Modelo de Tren</span>
              <span className="result-value">{result.train_model.name}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Trenes Requeridos</span>
              <span className="result-value highlight">{result.trains_required}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Capacidad Total</span>
              <span className="result-value">{result.total_capacity}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Capacidad Sobrante</span>
              <span className="result-value">{result.surplus_capacity}</span>
            </div>
          </div>

          <div className="result-footer">
            <span>Tiempo estimado de ciclo: {Math.floor(result.estimated_cycle_time_seconds / 60)}m {result.estimated_cycle_time_seconds % 60}s</span>
          </div>
        </div>
      )}
    </div>
  );
}

