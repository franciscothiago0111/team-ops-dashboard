"use client";

import { LogsList } from "./_components/LogsList";
import { LogsFilter } from "./_components/LogsFilter";
import { DashboardShell } from "../_components/DashboardShell";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function LogsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <DashboardShell title="Logs">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">
              Registro de Atividades
            </h1>
            <p className="text-sm text-slate-500">
              Visualize todas as ações realizadas no sistema.
            </p>
          </header>

          <LogsFilter />

          <LogsList />
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
