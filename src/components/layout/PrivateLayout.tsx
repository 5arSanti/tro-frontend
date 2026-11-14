import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/ui/app-sidebar/app-sidebar";
import { SiteHeader } from "@/components/ui/app-sidebar/site-header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideosProvider } from "@/context/VideosProvider";

function CloseMobileOnNavigate() {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [location.pathname, isMobile, setOpenMobile]);
  return null;
}

export function PrivateLayout() {
  return (
    <VideosProvider>
      <SidebarProvider>
        <CloseMobileOnNavigate />
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </VideosProvider>
  );
}
