"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "./_components/DashboardShell";
import { DashboardFilters } from "./_components/DashboardFilters";
import { AdminMetricsView } from "./_components/AdminMetricsView";
import { ManagerMetricsView } from "./_components/ManagerMetricsView";
import { EmployeeMetricsView } from "./_components/EmployeeMetricsView";
import { useMetrics } from "./_hooks/useMetrics";
import { IMetricsFilters } from "./_services/metrics.service";
import { useAuth } from "@/core/hooks/useAuth";
import { LoadingSpinner } from "@/core/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Role } from "@/shared/types/user";
import {
  AdminMetricsResponse,
  ManagerMetricsResponse,
  EmployeeMetricsResponse
} from "@/shared/types/metrics";

export default function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<IMetricsFilters>({});
  const { data, isLoading, error } = useMetrics(filters);

  const handleFilterChange = (newFilters: IMetricsFilters) => {
    setFilters(newFilters);
  };

  const renderMetricsView = () => {
    if (!data) return null;

    switch (user?.role) {
      case "ADMIN":
        return <AdminMetricsView data={data as AdminMetricsResponse} />;
      case "MANAGER":
        return <ManagerMetricsView data={data as ManagerMetricsResponse} />;
      case "EMPLOYEE":
        return <EmployeeMetricsView data={data as EmployeeMetricsResponse} />;
      default:
        return <ErrorState message="Tipo de usuário não reconhecido" showBackButton={false} />;
    }
  };

  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Dashboard de Métricas
            </h1>
            <p className="text-sm text-slate-500">
              {user?.role === "ADMIN" && "Visão completa da empresa"}
              {user?.role === "MANAGER" && "Visão do seu time e subordinados"}
              {user?.role === "EMPLOYEE" && "Suas métricas e performance"}
            </p>
          </div>

          <div className="flex gap-3">
            {user?.role === "ADMIN" && (
              <>
                <Link
                  href="/dashboard/employees"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-black transition hover:bg-slate-50"
                >
                  Ver colaboradores
                </Link>
                <Link
                  href="/dashboard/teams"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-black transition hover:bg-slate-50"
                >
                  Ver times
                </Link>
              </>
            )}
            <Link
              href="/dashboard/tasks"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ver tarefas
            </Link>
          </div>
        </header>

        {user && <DashboardFilters onFilterChange={handleFilterChange} userRole={user.role as Role} />}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="space-y-3 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-slate-500">Carregando métricas...</p>
            </div>
          </div>
        )}

        {error && (
          <ErrorState
            message="Erro ao carregar métricas. Tente novamente."
            showBackButton={false}
          />
        )}

        {!isLoading && !error && renderMetricsView()}
      </div>
    </DashboardShell>
  );
}
