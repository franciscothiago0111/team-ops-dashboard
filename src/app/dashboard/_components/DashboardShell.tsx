"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/core/hooks/useAuth";
import { useSidebarState } from "../_hooks/useSidebarState";
import { sidebarLinks, filterLinksByRole } from "./sidebar-config";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardLoadingState } from "./DashboardLoadingState";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
}

export function DashboardShell({ children, title }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar, closeSidebarOnMobile } = useSidebarState();

  useEffect(() => {
    if (!user) {
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
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <DashboardSidebar
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
            "lg:ml-20",
            isSidebarOpen && "lg:ml-80"
          )}
        >
          <DashboardNavbar user={user} title={title} onToggleSidebar={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 px-4 py-8 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
