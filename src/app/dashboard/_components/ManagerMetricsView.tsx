"use client";

import { Card } from "@/core/ui/Card";
import { formatDate } from "@/core/utils/formatters";
import { ManagerMetricsResponse } from "@/shared/types/metrics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";


interface ManagerMetricsViewProps {
  data: ManagerMetricsResponse;
}

const COLORS = {
  primary: "#0f172a",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

export function ManagerMetricsView({ data }: ManagerMetricsViewProps) {
  // Task Status Data
  const taskStatusData = [
    { name: "Pendentes", value: data?.tasks?.pending, color: COLORS.warning },
    { name: "Em Progresso", value: data?.tasks?.inProgress, color: COLORS.info },
    { name: "Concluídas", value: data?.tasks?.done, color: COLORS.success },
  ];

  // Task Priority Data
  const taskPriorityData = [
    { name: "Baixa", value: data?.tasks?.byPriority.low },
    { name: "Média", value: data?.tasks?.byPriority.medium },
    { name: "Alta", value: data?.tasks?.byPriority.high },
    { name: "Urgente", value: data?.tasks?.byPriority.urgent },
  ];

  // Direct Reports Performance
  const directReportsData = data.directReports.users.map(user => ({
    name: user.userName,
    completionRate: user.completionRate,
    completed: user.tasksCompleted,
  }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-linear-to-br from-slate-900 to-slate-700 text-white">
          <p className="text-sm text-slate-300">Time</p>
          <p className="text-2xl font-bold">{data.team.name}</p>
          <p className="text-xs text-emerald-300">{data.team.memberCount} membros</p>
        </Card>

        <Card className="bg-linear-to-br from-blue-600 to-blue-400 text-white">
          <p className="text-sm text-blue-100">Subordinados Diretos</p>
          <p className="text-4xl font-bold">{data.directReports.total}</p>
        </Card>

        <Card className="bg-linear-to-br from-emerald-600 to-emerald-400 text-white">
          <p className="text-sm text-emerald-100">Total de Tarefas</p>
          <p className="text-4xl font-bold">{data?.tasks?.total}</p>
          <p className="text-xs text-emerald-100">{data?.tasks?.done} concluídas</p>
        </Card>

        <Card className="bg-linear-to-br from-amber-600 to-amber-400 text-white">
          <p className="text-sm text-amber-100">Notificações</p>
          <p className="text-4xl font-bold">{data.notifications.total}</p>
          <p className="text-xs text-amber-100">{data.notifications.unread} não lidas</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Status das Tarefas do Time">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Tarefas por Prioridade">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskPriorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Productivity */}
      <Card
        title="Produtividade do Time"
        description={`Período: ${formatDate(data.period.startDate)} - ${formatDate(data.period.endDate)}`}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Tarefas Concluídas no Período</p>
            <p className="text-2xl font-bold text-slate-900">{data.teamProductivity.tasksCompletedInPeriod}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Média por Membro</p>
            <p className="text-2xl font-bold text-slate-900">{data.teamProductivity.averageTasksPerMember.toFixed(1)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Tarefas Atrasadas</p>
            <p className="text-2xl font-bold text-slate-900">{data?.tasks?.overdue}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Top Performers</h4>
          <div className="space-y-2">
            {data.teamProductivity.topPerformers.map((user, index) => (
              <div
                key={user.userId}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-900">{user.userName}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {user.tasksCompleted} tarefas
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Direct Reports Performance */}
      <Card title="Performance dos Subordinados Diretos">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={directReportsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completionRate" fill={COLORS.success} name="Taxa de Conclusão (%)" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-2">
          {data.directReports.users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
            >
              <span className="font-medium text-slate-900">{user.userName}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-slate-600">
                  Atribuídas: <strong className="text-slate-900">{user.tasksAssigned}</strong>
                </span>
                <span className="text-slate-600">
                  Concluídas: <strong className="text-slate-900">{user.tasksCompleted}</strong>
                </span>
                <span className="text-slate-600">
                  Taxa: <strong className="text-emerald-600">{user.completionRate.toFixed(1)}%</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
