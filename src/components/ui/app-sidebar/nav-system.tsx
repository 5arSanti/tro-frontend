import { useHealthCheck } from "@/hooks/useHealthCheck";
import { formatEnvironment } from "@/lib/environment";
import { cn } from "@/lib/utils";

export function NavSystem() {
  const health = useHealthCheck();
  return (
    <div className="flex items-start gap-2 bg-white/10 px-2.5 py-2 text-xs">
      <span
        className={cn(
          "mt-1 size-2 shrink-0 rounded-full",
          health.isOnline ? "bg-ok" : "bg-fail",
        )}
      />
      <div className="min-w-0">
        <p className="font-medium text-sidebar-foreground">
          {health.isOnline ? "Sistema operativo" : "Sistema desconectado"}
        </p>
        <p className="truncate text-sidebar-foreground/70">
          {health.version} · {formatEnvironment(health.environment)}
        </p>
      </div>
    </div>
  );
}
