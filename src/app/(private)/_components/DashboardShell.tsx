"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/core/hooks/useAuth";
import { isTokenExpired } from "@/core/services/storage.service";
import { useSidebarState } from "../_hooks/useSidebarState";
import { sidebarLinks, filterLinksByRole } from "./sidebar-config";

import { DashboardLoadingState } from "./DashboardLoadingState";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface IDashboardShellProps {
  children: ReactNode;
}

function DashboardShellInner({ children }: IDashboardShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar, closeSidebarOnMobile } = useSidebarState();

  useEffect(() => {
    if (!user || isTokenExpired()) {
      logout();
      router.replace("/login");
    }
  }, [user, router]);

  const filteredLinks = useMemo(() => {
    if (!user) return [];
    return filterLinksByRole(sidebarLinks, user.role);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="min-h-screen bg-slate-50" suppressHydrationWarning>
      <div className="flex min-h-screen">
        <Sidebar
          user={user}
          filteredLinks={filteredLinks}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onLinkClick={closeSidebarOnMobile}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div
          className={clsx(
            "flex min-h-screen w-full flex-1 flex-col transition-all duration-300",
            isSidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"
          )}
        >
          <Navbar user={user} onToggleSidebar={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 px-4 py-8 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: IDashboardShellProps) {
  return (
    <DashboardShellInner>{children}</DashboardShellInner>
  );
}
