import { useState } from "react";
import { TornsLockup } from "@/components/brand/TornsLockup";
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
  const stationsWithData = stationStatuses.filter((s) => s.last_passenger_count !== null).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="product-band px-8 py-8">
        <TornsLockup />
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-[-0.04em]">Optimización</h1>
            <p className="mt-2 text-sm text-paper/70">Oferta según demanda medida en estación.</p>
          </div>
          <Button variant="energy" onClick={() => void refetch()}>
            Actualizar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "px-3 py-2 text-sm transition-colors duration-200",
                activeTab === tab.id
                  ? "bg-energy font-semibold text-deep"
                  : "text-mute hover:bg-canvas hover:text-activity-ink",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <div className="flex flex-col gap-8">
            <p className="text-sm leading-relaxed text-mute">
              {trainModels.length} modelos de tren · {stations.length} estaciones configuradas ·{" "}
              {stationsWithData} con datos.
            </p>
            <section>
              <h2 className="mb-4 text-lg font-semibold">Estado de estaciones</h2>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {stationStatuses.map((status) => (
                  <StationStatusCard key={status.station.id} status={status} />
                ))}
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
    </div>
  );
}
