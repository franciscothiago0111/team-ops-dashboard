"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { SidebarLink } from "./sidebar-config";

interface User {
  name: string;
  email: string;
  role: string;
}

interface DashboardSidebarProps {
  user: User;
  filteredLinks: SidebarLink[];
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLinkClick: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  user,
  filteredLinks,
  isSidebarOpen,
  onToggleSidebar,
  onLinkClick,
  onLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex flex-col gap-8 border-r border-slate-200/60 bg-white py-8 shadow-xl transition-all duration-300",
          "lg:translate-x-0",
          isSidebarOpen
            ? "w-80 px-6 translate-x-0"
            : "w-80 px-6 -translate-x-full lg:w-20 lg:px-3 lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="space-y-1">
          {isSidebarOpen ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Team Ops
              </p>
              <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {user.role}
                </span>
              </div>
            </>
          ) : (
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 text-xl font-bold text-white shadow-lg">
                T
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {filteredLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={clsx(
                  "group relative flex items-center rounded-xl text-sm font-semibold transition-all duration-200",
                  isSidebarOpen ? "gap-3 px-4 py-3" : "gap-3 px-4 py-3 lg:justify-center lg:px-0",
                  isActive
                    ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-50 text-slate-900 hover:bg-indigo-50 hover:text-indigo-700"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                {isActive && isSidebarOpen && (
                  <span className="absolute left-0 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-r-full bg-white shadow-sm" />
                )}
                <span
                  className={clsx(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold transition-colors",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-white text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                {isSidebarOpen && (
                  <>
                    <span className={clsx("flex-1", isActive ? "text-white" : "text-slate-900")}>
                      {item.label}
                    </span>
                    {isActive && (
                      <svg className="h-5 w-5 shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </>
                )}
                {!isSidebarOpen && (
                  <span className={clsx("hidden lg:inline flex-1", isActive ? "text-white" : "text-slate-900")} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="mt-auto space-y-3">
          {isSidebarOpen ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Logado como</p>
                <p className="mt-1 text-base font-bold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-red-300 hover:text-red-600 hover:shadow-sm"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair
              </button>
            </>
          ) : (
            <>
              <div className="hidden lg:flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="hidden lg:flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 transition-all hover:bg-slate-50 hover:border-red-300 hover:text-red-600 hover:shadow-sm"
                title="Sair"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onToggleSidebar} />
      )}

      {/* Sidebar Toggle Button - Desktop only */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className={clsx(
          "fixed top-4 z-50 hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-all duration-300 hover:bg-slate-50 hover:shadow-xl",
          isSidebarOpen ? "left-[304px]" : "left-16"
        )}
        aria-label={isSidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
    </>
  );
}
