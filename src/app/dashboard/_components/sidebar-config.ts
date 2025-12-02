export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export const allowedRoles: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

export interface SidebarLink {
  label: string;
  href: string;
  roles: Role[];
}

export const sidebarLinks: SidebarLink[] = [
  { label: "Visão Geral", href: "/dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { label: "Colaboradores", href: "/dashboard/employees", roles: ["ADMIN", "MANAGER"] },
  { label: "Tarefas", href: "/dashboard/tasks", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { label: "Times", href: "/dashboard/teams", roles: ["ADMIN", "MANAGER"] },
];

export function filterLinksByRole(links: SidebarLink[], userRole: string): SidebarLink[] {
  const role = allowedRoles.includes(userRole as Role) ? (userRole as Role) : "EMPLOYEE";
  return links.filter((link) => link.roles.includes(role));
}
