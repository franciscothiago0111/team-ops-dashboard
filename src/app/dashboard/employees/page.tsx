"use client";

import { Card } from "@/core/ui/Card";
import { EmployeesList } from "./_components/EmployeesList";
import { EmployeesFilter } from "./_components/EmployeesFilter";
import { DashboardShell } from "../_components/DashboardShell";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function EmployeesPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Colaboradores">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">
              Estrutura e People Ops
            </h1>
            <p className="text-sm text-slate-500">
              Gere admissões, desligamentos e movimentações com módulos independentes.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Ativos" description="96 colaboradores" />
            <Card title="Onboarding" description="6 admissões em andamento" />
            <Card title="Pendências" description="3 aprovações aguardando" />
          </div>

          <EmployeesFilter />

          <EmployeesList />
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
