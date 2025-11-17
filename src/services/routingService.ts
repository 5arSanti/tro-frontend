import { API_BASE_URL } from "../utils/constants";
import type {
  TrainModelsResponse,
  StationsResponse,
  StationStatusesResponse,
  DispatchPlan,
  DispatchRequest,
} from "../types/routing.types";

class RoutingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/routing`;
  }

  async getTrainModels(): Promise<TrainModelsResponse> {
    const response = await fetch(`${this.baseUrl}/trains`);
    if (!response.ok) {
      throw new Error("Failed to fetch train models");
    }
    return response.json();
  }

  async getStations(): Promise<StationsResponse> {
    const response = await fetch(`${this.baseUrl}/stations`);
    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }
    return response.json();
  }

  async getStation(stationId: string): Promise<import("../types/routing.types").Station> {
    const response = await fetch(`${this.baseUrl}/stations/${stationId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch station ${stationId}`);
    }
    return response.json();
  }

  async getStationStatus(stationId: string): Promise<import("../types/routing.types").StationStatus> {
    const response = await fetch(`${this.baseUrl}/stations/${stationId}/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch station status for ${stationId}`);
    }
    return response.json();
  }

  async getStationByCameraId(cameraId: string): Promise<import("../types/routing.types").Station | null> {
    try {
      const stationsResponse = await this.getStations();
      const station = stationsResponse.stations.find(s => s.camera_id === cameraId);
      return station || null;
    } catch (error) {
      console.error(`Failed to find station by camera ${cameraId}:`, error);
      return null;
    }
  }

  async getStationStatusByCameraId(cameraId: string): Promise<import("../types/routing.types").StationStatus | null> {
    try {
      const station = await this.getStationByCameraId(cameraId);
      if (!station) return null;
      return await this.getStationStatus(station.id);
    } catch (error) {
      console.error(`Failed to find station status by camera ${cameraId}:`, error);
      return null;
    }
  }

  async getStationStatuses(): Promise<StationStatusesResponse> {
    const response = await fetch(`${this.baseUrl}/stations/status`);
    if (!response.ok) {
      throw new Error("Failed to fetch station statuses");
    }
    return response.json();
  }

  async computeDispatchPlan(request: DispatchRequest): Promise<DispatchPlan> {
    const response = await fetch(`${this.baseUrl}/dispatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error("Failed to compute dispatch plan");
    }
    
    return response.json();
  }
}

export const routingService = new RoutingService();

