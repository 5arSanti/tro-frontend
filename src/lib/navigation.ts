import type { AppRoute } from "@/routes/types";

export const ROUTE_GROUP_DEFINITIONS = [
  {
    label: "Visión general",
    matcher: (route: AppRoute) => route.path === "/",
  },
  {
    label: "Operación",
    matcher: (route: AppRoute) =>
      route.path === "/monitoring" || route.path === "/routing",
  },
  {
    label: "Administración",
    matcher: (route: AppRoute) => route.path === "/cameras",
  },
] as const;

export function isRouteActive(
  pathname: string,
  route: Pick<AppRoute, "path">,
  visibleRoutes: Array<Pick<AppRoute, "path">>,
): boolean {
  if (route.path === "/") return pathname === "/";
  const matches = pathname === route.path || pathname.startsWith(`${route.path}/`);
  if (!matches) return false;
  return !visibleRoutes.some(
    (other) =>
      other.path !== route.path &&
      other.path.startsWith(`${route.path}/`) &&
      pathname.startsWith(other.path),
  );
}

export function groupNavigableRoutes(routes: AppRoute[]) {
  const used = new Set<string>();
  const groups: Array<{ label: string; routes: AppRoute[] }> = [];
  for (const definition of ROUTE_GROUP_DEFINITIONS) {
    const items = routes.filter((route) => definition.matcher(route));
    if (items.length === 0) continue;
    items.forEach((route) => used.add(route.path));
    groups.push({ label: definition.label, routes: items });
  }
  const leftover = routes.filter((route) => !used.has(route.path));
  if (leftover.length > 0) groups.push({ label: "Otros", routes: leftover });
  return groups;
}
