"use client";

import { Card } from "@/core/ui/Card";
import { TeamsList } from "./_components/TeamsList";
import { TeamsFilter } from "./_components/TeamsFilter";
import { DashboardShell } from "../_components/DashboardShell";
import { RoleGuard } from "@/shared/components/RoleGuard";

export default function TeamsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <DashboardShell title="Times">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">
              Gerenciamento de Times
            </h1>
            <p className="text-sm text-slate-500">
              Organize e gerencie os times da sua organização.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Times Ativos" description="Times em operação" />
            <Card title="Membros" description="Total de colaboradores" />
            <Card title="Projetos" description="Projetos em andamento" />
          </div>

          <TeamsFilter />

          <TeamsList />
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
