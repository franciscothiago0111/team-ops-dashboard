import type { LucideIcon } from "lucide-react";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export const allowedRoles: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

export interface SidebarLink {
  label: string;
  href: string;
  roles: Role[];
  icon: LucideIcon;
}

import { LayoutDashboard, Users, CheckSquare, UsersRound } from "lucide-react";

export const sidebarLinks: SidebarLink[] = [
  { label: "Visão Geral", href: "/dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"], icon: LayoutDashboard },
  { label: "Colaboradores", href: "/dashboard/employees", roles: ["ADMIN", "MANAGER"], icon: Users },
  { label: "Tarefas", href: "/dashboard/tasks", roles: ["ADMIN", "MANAGER", "EMPLOYEE"], icon: CheckSquare },
  { label: "Times", href: "/dashboard/teams", roles: ["ADMIN", "MANAGER"], icon: UsersRound },
];

export function filterLinksByRole(links: SidebarLink[], userRole: string): SidebarLink[] {
  const role = allowedRoles.includes(userRole as Role) ? (userRole as Role) : "EMPLOYEE";
  return links.filter((link) => link.roles.includes(role));
}
