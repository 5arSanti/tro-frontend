import { Link } from "react-router-dom";
import { TornsLockup } from "@/components/brand/TornsLockup";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavGroups } from "@/components/ui/app-sidebar/nav-groups";
import { NavSystem } from "@/components/ui/app-sidebar/nav-system";

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <Link to="/" className="flex flex-col gap-1 px-2 py-1 text-sidebar-foreground">
          <TornsLockup />
          <span className="text-xs text-sidebar-foreground/70">Centro de control</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavGroups />
      </SidebarContent>
      <SidebarFooter>
        <NavSystem />
      </SidebarFooter>
    </Sidebar>
  );
}
