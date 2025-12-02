"use client";

import { NotificationPanel } from "./NotificationPanel";

interface User {
  name: string;
  role: string;
}

interface DashboardNavbarProps {
  user: User;
  title?: string;
  onToggleSidebar: () => void;
}

export function DashboardNavbar({ user, title, onToggleSidebar }: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {title && <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">{title}</h1>}
        </div>

        <div className="flex items-center gap-3">
          <NotificationPanel />

          <div className="hidden md:block">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
