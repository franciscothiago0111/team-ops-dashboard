"use client";

import { useState } from "react";
import { Input } from "@/core/ui/Input";
import { Select } from "@/core/ui/Select";
import { Button } from "@/core/ui/Button";
import { IMetricsFilters } from "../_services/metrics.service";
import { Role } from "@/shared/types/user";

interface DashboardFiltersProps {
  onFilterChange: (filters: IMetricsFilters) => void;
  userRole: Role;
}

export function DashboardFilters({ onFilterChange, userRole }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<IMetricsFilters>({});

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters: IMetricsFilters = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Filtros</h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Data Inicial
          </label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Data Final
          </label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status da Tarefa
          </label>
          <Select
            value={filters.taskStatus || ""}
            onChange={(e) => setFilters({ ...filters, taskStatus: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="DONE">Concluído</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Prioridade
          </label>
          <Select
            value={filters.priority || ""}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </Select>
        </div>

        {userRole === "ADMIN" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                ID do Time
              </label>
              <Input
                type="text"
                placeholder="ID do time"
                value={filters.teamId || ""}
                onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                ID do Usuário
              </label>
              <Input
                type="text"
                placeholder="ID do usuário"
                value={filters.userId || ""}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <Button onClick={handleApplyFilters}>
          Aplicar Filtros
        </Button>
        <Button variant="secondary" onClick={handleClearFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
