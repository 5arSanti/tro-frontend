import { Link } from "react-router-dom";
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
        <Link to="/" className="flex flex-col gap-0.5 px-2 py-1 text-sidebar-foreground">
          <span className="text-sm font-extrabold tracking-tight">TORNS</span>
          <span className="text-xs text-sidebar-foreground/70">Centro de control · LIRN</span>
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
