import { useState } from "react";
import { useRoutingData } from "../hooks/useRoutingData";
import { TrainModelCard } from "../components/routing/TrainModelCard";
import { StationCard } from "../components/routing/StationCard";
import { StationStatusCard } from "../components/routing/StationStatusCard";
import { DispatchPanel } from "../components/routing/DispatchPanel";
import { Loading } from "../components/common/Loading";
import { ErrorDisplay } from "../components/common/ErrorDisplay";

type TabType = "overview" | "trains" | "stations" | "calculator";

export function RoutingPage() {
  const { trainModels, stations, stationStatuses, loading, error, refetch } = useRoutingData(10000); // Auto-refresh every 10s
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="routing-page">
      <div className="routing-header">
        <div className="routing-title">
          <h1>Optimización de Rutas</h1>
          <p className="routing-subtitle">
            Sistema Inteligente de Gestión y Despacho de Trenes
          </p>
        </div>
        <button className="btn-refresh" onClick={refetch}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualizar
        </button>
      </div>

      <div className="routing-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Vista General
        </button>
        <button
          className={`tab-button ${activeTab === "trains" ? "active" : ""}`}
          onClick={() => setActiveTab("trains")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="12" rx="2"/>
            <path d="M3 12h18"/>
          </svg>
          Modelos de Tren
        </button>
        <button
          className={`tab-button ${activeTab === "stations" ? "active" : ""}`}
          onClick={() => setActiveTab("stations")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          Estaciones
        </button>
        <button
          className={`tab-button ${activeTab === "calculator" ? "active" : ""}`}
          onClick={() => setActiveTab("calculator")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="16" y2="14"/>
            <line x1="8" y1="18" x2="16" y2="18"/>
          </svg>
          Calculadora
        </button>
      </div>

      <div className="routing-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <section className="overview-section">
              <h2>Estado de Estaciones en Tiempo Real</h2>
              <div className="station-statuses-grid">
                {stationStatuses.map((status) => (
                  <StationStatusCard key={status.station.id} status={status} />
                ))}
              </div>
            </section>

            <section className="overview-section">
              <h2>Resumen del Sistema</h2>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="8" width="18" height="12" rx="2"/>
                    </svg>
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">{trainModels.length}</span>
                    <span className="summary-label">Modelos de Tren</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">{stations.length}</span>
                    <span className="summary-label">Estaciones Configuradas</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">
                      {stationStatuses.filter(s => s.last_passenger_count !== null).length}
                    </span>
                    <span className="summary-label">Estaciones Activas</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "trains" && (
          <div className="trains-tab">
            <h2>Modelos de Tren Disponibles</h2>
            <p className="tab-description">
              Configuración de los diferentes tipos de tren disponibles para el sistema
            </p>
            <div className="train-models-grid">
              {trainModels.map((model) => (
                <TrainModelCard key={model.id} model={model} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "stations" && (
          <div className="stations-tab">
            <h2>Estaciones Configuradas</h2>
            <p className="tab-description">
              Información detallada de cada estación y sus características operativas
            </p>
            <div className="stations-grid">
              {stations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "calculator" && (
          <div className="calculator-tab">
            <DispatchPanel 
              stations={stations}
              onDispatchCalculated={(plan) => {
                console.log("Plan calculated:", plan);
                // Optionally refetch to see updated status
                refetch();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

