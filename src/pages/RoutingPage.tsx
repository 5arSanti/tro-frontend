import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DispatchPanel } from "@/components/routing/DispatchPanel";
import { StationCard } from "@/components/routing/StationCard";
import { StationStatusCard } from "@/components/routing/StationStatusCard";
import { TrainModelCard } from "@/components/routing/TrainModelCard";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { Loading } from "@/components/common/Loading";
import { useRoutingData } from "@/hooks/useRoutingData";
import { cn } from "@/lib/utils";

type TabType = "overview" | "trains" | "stations" | "calculator";

export function RoutingPage() {
  const { trainModels, stations, stationStatuses, loading, error, refetch } = useRoutingData(10000);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} onRetry={() => void refetch()} />;

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "overview", label: "Vista general" },
    { id: "trains", label: "Modelos de tren" },
    { id: "stations", label: "Estaciones" },
    { id: "calculator", label: "Calculadora" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Optimización</h1>
          <p className="text-sm text-mute">Oferta según demanda medida en estación</p>
        </div>
        <Button variant="outline" onClick={() => void refetch()}>
          Actualizar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "rounded-[2px] px-3 py-2 text-sm transition-colors duration-200",
              activeTab === tab.id ? "bg-energy text-ink" : "text-mute hover:bg-white/10",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Estado de estaciones</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {stationStatuses.map((status) => (
                <StationStatusCard key={status.station.id} status={status} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Resumen</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
                <p className="text-xs uppercase tracking-wide text-mute">Modelos de tren</p>
                <p className="mt-2 font-mono text-3xl tabular-nums">{trainModels.length}</p>
              </div>
              <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
                <p className="text-xs uppercase tracking-wide text-mute">Estaciones configuradas</p>
                <p className="mt-2 font-mono text-3xl tabular-nums">{stations.length}</p>
              </div>
              <div className="rounded-[2px] border border-white/10 bg-canvas/40 p-4">
                <p className="text-xs uppercase tracking-wide text-mute">Estaciones con datos</p>
                <p className="mt-2 font-mono text-3xl tabular-nums">
                  {stationStatuses.filter((s) => s.last_passenger_count !== null).length}
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "trains" ? (
        <div>
          <h2 className="text-lg font-semibold">Modelos de tren disponibles</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {trainModels.map((model) => (
              <TrainModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "stations" ? (
        <div>
          <h2 className="text-lg font-semibold">Estaciones configuradas</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "calculator" ? (
        <DispatchPanel stations={stations} onDispatchCalculated={() => void refetch()} />
      ) : null}
    </div>
  );
}
