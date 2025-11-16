export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

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

