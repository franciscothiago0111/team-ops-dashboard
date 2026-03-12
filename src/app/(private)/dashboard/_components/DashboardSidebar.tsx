"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import clsx from "clsx";
import type { ISidebarLink } from "./sidebar-config";
import type { IUser } from "@/shared/types";


interface IDashboardSidebarProps {
  user: IUser;
  filteredLinks: ISidebarLink[];
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLinkClick: () => void;
  onLogout: () => void;
}

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  EMPLOYEE: "Colaborador",
};

export function DashboardSidebar({
  user,
  filteredLinks,
  isSidebarOpen,
  onToggleSidebar,
  onLinkClick,
  onLogout,
}: IDashboardSidebarProps) {
  const pathname = usePathname();
  const initials = user.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "?";

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200/60 transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full lg:w-[72px] lg:translate-x-0"
        )}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div
          className={clsx(
            "flex shrink-0 items-center border-b border-slate-200/60",
            isSidebarOpen ? "h-16 gap-3 px-4" : "h-16 justify-center"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 text-xs font-black tracking-tight text-white shadow-lg shadow-indigo-500/25">
            TO
          </div>

          {isSidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold leading-tight text-slate-900">
                Team Ops
              </p>
              <p className="truncate text-[11px] leading-tight text-slate-500">
                Dashboard
              </p>
            </div>
          )}
        </div>

        {/* ── Navigation ─────────────────────────────────────── */}
        <nav
          className={clsx(
            "flex flex-1 flex-col overflow-x-hidden overflow-y-auto py-3",
            isSidebarOpen ? "gap-0.5 px-2.5" : "items-center gap-0.5 px-2"
          )}
        >
          {filteredLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                title={!isSidebarOpen ? item.label : undefined}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isSidebarOpen
                    ? "w-full px-3 py-2.5"
                    : "w-[46px] justify-center px-0 py-2.5",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-indigo-600" />
                )}

                <item.icon
                  className={clsx(
                    "shrink-0 transition-colors",
                    isSidebarOpen ? "h-[18px] w-[18px]" : "h-5 w-5",
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-700"
                  )}
                />

                {isSidebarOpen && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {isActive && isSidebarOpen && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className="mx-3 border-t border-slate-200/60" />

        {/* ── User + Logout footer ─────────────────────────────── */}
        <div
          className={clsx(
            "shrink-0 py-3",
            isSidebarOpen
              ? "space-y-0.5 px-2.5"
              : "flex flex-col items-center gap-1 px-2"
          )}
        >
          {/* User info */}
          <div
            className={clsx(
              "flex items-center rounded-lg",
              isSidebarOpen ? "gap-2.5 px-2 py-2" : "justify-center py-2"
            )}
          >
            <div className="relative shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-blue-600 text-[11px] font-bold text-white ring-2 ring-slate-200">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            {isSidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight text-slate-900">
                  {user.name ?? "—"}
                </p>
                <p className="truncate text-[11px] leading-tight text-slate-500">
                  {roleLabels[user.role] ?? user.role}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            title={!isSidebarOpen ? "Sair" : undefined}
            className={clsx(
              "group flex items-center gap-2.5 rounded-lg text-[13px] font-medium text-slate-500 transition-all duration-150",
              "hover:bg-red-500/10 hover:text-red-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
              isSidebarOpen
                ? "w-full px-3 py-2"
                : "w-[46px] justify-center px-0 py-2"
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>

        {/* ── Collapse toggle (desktop only) ───────────────────── */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
          className="absolute -right-3 top-[72px] hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:border-indigo-400 hover:text-indigo-600 lg:flex"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </>
  );
}
