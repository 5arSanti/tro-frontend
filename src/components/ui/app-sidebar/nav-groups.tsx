import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getNavigableRoutes } from "@/lib/get-navigable-routes";
import { groupNavigableRoutes, isRouteActive } from "@/lib/navigation";
import { routeConfig } from "@/routes";

export function NavGroups() {
  const location = useLocation();
  const visible = getNavigableRoutes(routeConfig);
  const groups = groupNavigableRoutes(visible);

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.routes.map((route) => {
                const Icon = route.icon;
                const active = isRouteActive(location.pathname, route, visible);
                return (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={route.path} end={route.path === "/"}>
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{route.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
