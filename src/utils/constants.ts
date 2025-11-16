const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ||
  (() => {
    try {
      const url = new URL(API_BASE_URL);
      const protocol = url.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${url.host}${url.pathname}`;
    } catch {
      const startsWithHttps = API_BASE_URL.startsWith("https");
      return startsWithHttps
        ? API_BASE_URL.replace(/^https/, "wss")
        : API_BASE_URL.replace(/^http/, "ws");
    }
  })();

export const REFRESH_INTERVAL = 3000; // 3 seconds
export const STATS_UPDATE_INTERVAL = 2000; // 2 seconds

export const MOCK_DETECTIONS = [
  "Persona detectada - Zona A",
  "Vehículo en movimiento",
  "Grupo de personas - Andén 2",
  "Equipaje sin supervisión",
  "Flujo normal de pasajeros",
  "Tren aproximándose - Vía 1",
  "Aglomeración detectada - Zona C",
  "Persona corriendo - Área restringida",
];
