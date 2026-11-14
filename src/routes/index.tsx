import { Camera, House, MonitorPlay, TrainFront } from "lucide-react";
import { CamerasPage } from "@/pages/CamerasPage";
import { HomePage } from "@/pages/HomePage";
import { MonitoringPage } from "@/pages/MonitoringPage";
import { RoutingPage } from "@/pages/RoutingPage";
import type { AppRoute } from "@/routes/types";

export type { AppRoute };

export const routeConfig: AppRoute[] = [
  { path: "/", title: "Inicio", icon: House, element: <HomePage /> },
  { path: "/monitoring", title: "Monitoreo", icon: MonitorPlay, element: <MonitoringPage /> },
  { path: "/cameras", title: "Cámaras", icon: Camera, element: <CamerasPage /> },
  { path: "/routing", title: "Optimización", icon: TrainFront, element: <RoutingPage /> },
];
