import { useState } from "react";
import type { DispatchPlan, Station } from "@/types/routing.types";
import { routingService } from "@/services/routingService";
import { Button } from "@/components/ui/button";

interface DispatchPanelProps {
  stations: Station[];
  onDispatchCalculated?: (plan: DispatchPlan) => void;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <dt className="text-sm text-mute">{label}</dt>
      <dd className="text-sm tabular-nums">{value}</dd>
    </div>
  );
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
      setError("Seleccione una estación e ingrese el número de pasajeros.");
      return;
    }

    const count = parseInt(passengerCount, 10);
    if (isNaN(count) || count < 0) {
      setError("El número de pasajeros debe ser un valor válido.");
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
    <div className="max-w-xl">
      <h3 className="text-lg font-semibold">Calculadora de despacho</h3>
      <p className="mt-1 text-sm leading-relaxed text-mute">
        Elige el tren más pequeño que cubre N. Capacidades 5, 10 y 15. Regla ⌈N/C⌉.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Estación
          <select
            id="station-select"
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            disabled={loading}
            className="rounded-md border border-line bg-panel px-3 py-2"
          >
            <option value="">Seleccione una estación</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.line})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Número de pasajeros
          <input
            id="passenger-input"
            type="number"
            min="0"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            placeholder="Ej: 150"
            disabled={loading}
            className="rounded-md border border-line bg-panel px-3 py-2"
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
            {loading ? "Calculando…" : "Calcular plan"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            Limpiar
          </Button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-fail">{error}</p> : null}

      {result ? (
        <dl className="mt-6 divide-y divide-line">
          <h4 className="pb-3 font-medium">Plan calculado</h4>
          <Row label="Estación" value={result.station_name} />
          <Row label="Pasajeros" value={result.passenger_count} />
          <Row label="Modelo" value={result.train_model.name} />
          <Row label="Trenes requeridos" value={result.trains_required} />
          <Row label="Capacidad total" value={result.total_capacity} />
          <Row label="Capacidad sobrante" value={result.surplus_capacity} />
          <p className="pt-3 text-sm text-mute">
            Tiempo estimado de ciclo: {Math.floor(result.estimated_cycle_time_seconds / 60)}m{" "}
            {result.estimated_cycle_time_seconds % 60}s
          </p>
        </dl>
      ) : null}
    </div>
  );
}
