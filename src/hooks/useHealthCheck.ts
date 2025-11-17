import { useEffect, useState } from "react";
import { healthService } from "../services/healthService";
import type { HealthCheckResponse, SystemStatus } from "../types/video.types";

export function useHealthCheck(): SystemStatus {
  const [status, setStatus] = useState<SystemStatus>({
    isOnline: false,
    version: "---",
    environment: "---",
    lastChecked: null,
  });

  useEffect(() => {
    // Start polling every 30 seconds
    healthService.startPolling(30000);

    // Subscribe to health updates
    const unsubscribe = healthService.subscribe((healthData: HealthCheckResponse | null) => {
      if (healthData && healthData.status === "healthy") {
        setStatus({
          isOnline: true,
          version: healthData.version,
          environment: healthData.environment,
          lastChecked: new Date(),
        });
      } else {
        setStatus({
          isOnline: false,
          version: "---",
          environment: "---",
          lastChecked: new Date(),
        });
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      healthService.stopPolling();
    };
  }, []);

  return status;
}

