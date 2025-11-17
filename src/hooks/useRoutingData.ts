import { useEffect, useState } from "react";
import { routingService } from "../services/routingService";
import type {
  TrainModel,
  Station,
  StationStatus,
} from "../types/routing.types";

interface RoutingData {
  trainModels: TrainModel[];
  stations: Station[];
  stationStatuses: StationStatus[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRoutingData(autoRefreshMs?: number): RoutingData {
  const [trainModels, setTrainModels] = useState<TrainModel[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [stationStatuses, setStationStatuses] = useState<StationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [trainsData, stationsData, statusesData] = await Promise.all([
        routingService.getTrainModels(),
        routingService.getStations(),
        routingService.getStationStatuses(),
      ]);

      setTrainModels(trainsData.trains);
      setStations(stationsData.stations);
      setStationStatuses(statusesData.stations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefreshMs && autoRefreshMs > 0) {
      const interval = setInterval(fetchData, autoRefreshMs);
      return () => clearInterval(interval);
    }
  }, [autoRefreshMs]);

  return {
    trainModels,
    stations,
    stationStatuses,
    loading,
    error,
    refetch: fetchData,
  };
}

