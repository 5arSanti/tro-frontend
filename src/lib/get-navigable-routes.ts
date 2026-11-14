import type { AppRoute } from "@/routes/types";

export function getNavigableRoutes(routes: AppRoute[]): AppRoute[] {
  return routes.filter((route) => Boolean(route.title) && Boolean(route.icon) && !route.hidden);
}
