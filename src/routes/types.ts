import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface AppRoute {
  path: string;
  title: string;
  icon: LucideIcon;
  element: ReactNode;
  hidden?: boolean;
}
