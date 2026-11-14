import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

function readSidebarCookie() {
  if (typeof document === "undefined") return true;
  const match = document.cookie.match(/(?:^|; )sidebar_state=(true|false)/);
  return match ? match[1] === "true" : true;
}

function SidebarProvider({
  defaultOpen,
  children,
  style,
  className,
}: ComponentProps<"div"> & { defaultOpen?: boolean; children: ReactNode }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [open, setOpenState] = useState(defaultOpen ?? readSidebarCookie);

  const setOpen = useCallback((value: boolean) => {
    setOpenState(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile((current) => !current);
    else setOpen(!open);
  }, [isMobile, open, setOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSidebar]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": "18rem",
            "--header-height": "3rem",
            ...style,
          } as CSSProperties
        }
        className={cn("flex min-h-svh w-full bg-canvas", className)}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  className,
  children,
}: ComponentProps<"div"> & {
  variant?: "inset";
  collapsible?: "offcanvas";
}) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[18rem] p-0">
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-state={state}
      data-collapsible="offcanvas"
      className={cn(
        "group hidden text-sidebar-foreground md:block",
        state === "collapsed" ? "w-0" : "w-[var(--sidebar-width)]",
        "shrink-0 transition-[width] duration-200",
        className,
      )}
    >
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-svh w-[var(--sidebar-width)] flex-col border-r border-line bg-sidebar",
          state === "collapsed" && "-translate-x-full",
          "transition-transform duration-200",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function SidebarInset({ className, children, ...props }: ComponentProps<"main">) {
  return (
    <main
      className={cn("flex min-h-svh min-w-0 flex-1 flex-col bg-canvas p-2", className)}
      {...props}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-panel text-ink shadow-[0_1px_2px_rgb(11_31_58/0.04),0_12px_32px_rgb(11_31_58/0.06)]">
        {children}
      </div>
    </main>
  );
}

function SidebarTrigger({ className, ...props }: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-3", className)} {...props} />;
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-auto", className)} {...props} />
  );
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-3", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-2", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70", className)}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn(className)} {...props} />;
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  {
    variants: {
      isActive: {
        true: "bg-sidebar-primary font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
        false: "text-sidebar-foreground",
      },
    },
    defaultVariants: { isActive: false },
  },
);

function SidebarMenuButton({
  className,
  isActive = false,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(sidebarMenuButtonVariants({ isActive }), className)} {...props} />
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};
