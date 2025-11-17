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

