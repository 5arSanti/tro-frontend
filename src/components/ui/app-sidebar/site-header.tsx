import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getNavigableRoutes } from "@/lib/get-navigable-routes";
import { isRouteActive } from "@/lib/navigation";
import { routeConfig } from "@/routes";

export function SiteHeader() {
  const location = useLocation();
  const visible = getNavigableRoutes(routeConfig);
  const current = visible.find((route) => isRouteActive(location.pathname, route, visible));
  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b border-line px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <nav className="text-sm text-mute">
        <span>TORNS</span>
        <span className="px-1.5">/</span>
        <span className="font-medium text-ink">{current?.title ?? ""}</span>
      </nav>
    </header>
  );
}
