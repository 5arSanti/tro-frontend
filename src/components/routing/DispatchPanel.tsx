import { useState } from "react";
import type { DispatchPlan, Station } from "@/types/routing.types";
import { routingService } from "@/services/routingService";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-xl rounded-[2px] border border-white/10 bg-canvas/40 p-4">
      <h3 className="text-lg font-semibold">Calculadora de despacho</h3>
      <p className="mt-1 text-sm text-mute">
        Elige el tren más pequeño que cubre N. Capacidades 5, 10 y 15. Regla ⌈N/C⌉.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Estación
          <select
            id="station-select"
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            disabled={loading}
            className="rounded-[2px] border border-white/15 bg-canvas px-2 py-2"
          >
            <option value="">Seleccione una estación</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.line})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Número de pasajeros
          <input
            id="passenger-input"
            type="number"
            min="0"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            placeholder="Ej: 150"
            disabled={loading}
            className="rounded-[2px] border border-white/15 bg-canvas px-2 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={persist}
            onChange={(e) => setPersist(e.target.checked)}
            disabled={loading}
          />
          Actualizar estado en tiempo real
        </label>

        <div className="flex gap-2">
          <Button
            onClick={() => void handleCalculate()}
            disabled={loading || !selectedStationId || !passengerCount}
          >
            {loading ? "Calculando..." : "Calcular plan"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            Limpiar
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-fail">{error}</p>
      ) : null}

      {result ? (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
          <h4 className="col-span-2 font-medium">Plan calculado</h4>
          <div>
            <p className="text-mute">Estación</p>
            <p>{result.station_name}</p>
          </div>
          <div>
            <p className="text-mute">Pasajeros</p>
            <p className="font-mono tabular-nums text-energy">{result.passenger_count}</p>
          </div>
          <div>
            <p className="text-mute">Modelo</p>
            <p>{result.train_model.name}</p>
          </div>
          <div>
            <p className="text-mute">Trenes requeridos</p>
            <p className="font-mono tabular-nums">{result.trains_required}</p>
          </div>
          <div>
            <p className="text-mute">Capacidad total</p>
            <p className="font-mono tabular-nums">{result.total_capacity}</p>
          </div>
          <div>
            <p className="text-mute">Capacidad sobrante</p>
            <p className="font-mono tabular-nums">{result.surplus_capacity}</p>
          </div>
          <p className="col-span-2 text-xs text-mute">
            Tiempo estimado de ciclo: {Math.floor(result.estimated_cycle_time_seconds / 60)}m{" "}
            {result.estimated_cycle_time_seconds % 60}s
          </p>
        </div>
      ) : null}
    </div>
  );
}
