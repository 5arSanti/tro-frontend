import { API_BASE_URL } from "../utils/constants";
import type { HealthCheckResponse } from "../types/video.types";

export class HealthService {
  private static instance: HealthService;
  private healthCheckInterval: number | null = null;
  private listeners: Array<(status: HealthCheckResponse | null) => void> = [];
  private currentStatus: HealthCheckResponse | null = null;

  private constructor() {}

  static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  async checkHealth(): Promise<HealthCheckResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Health check failed");
      }

      const data: HealthCheckResponse = await response.json();
      this.currentStatus = data;
      this.notifyListeners(data);
      return data;
    } catch (error) {
      console.error("Health check error:", error);
      this.currentStatus = null;
      this.notifyListeners(null);
      return null;
    }
  }

  startPolling(intervalMs: number = 30000): void {
    if (this.healthCheckInterval) {
      this.stopPolling();
    }

    // Check immediately
    this.checkHealth();

    // Then poll at interval
    this.healthCheckInterval = window.setInterval(() => {
      this.checkHealth();
    }, intervalMs);
  }

  stopPolling(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  subscribe(listener: (status: HealthCheckResponse | null) => void): () => void {
    this.listeners.push(listener);
    
    // Immediately notify with current status if available
    if (this.currentStatus !== null) {
      listener(this.currentStatus);
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(status: HealthCheckResponse | null): void {
    this.listeners.forEach((listener) => listener(status));
  }

  getCurrentStatus(): HealthCheckResponse | null {
    return this.currentStatus;
  }
}

export const healthService = HealthService.getInstance();

