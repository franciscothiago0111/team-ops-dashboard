"use client";

import { Card } from "@/core/ui/Card";
import { formatDate } from "@/core/utils/formatters";
import { AdminMetricsResponse } from "@/shared/types/metrics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";

interface AdminMetricsViewProps {
  data: AdminMetricsResponse;
}

const COLORS = {
  primary: "#0f172a",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.info, COLORS.warning];

export function AdminMetricsView({ data }: AdminMetricsViewProps) {
  // Task Status Data
  const taskStatusData = [
    { name: "Pendentes", value: data.tasks.pending, color: COLORS.warning },
    { name: "Em Progresso", value: data.tasks.inProgress, color: COLORS.info },
    { name: "Concluídas", value: data.tasks.done, color: COLORS.success },
  ];

  // Task Priority Data
  const taskPriorityData = [
    { name: "Baixa", value: data.tasks.byPriority.low },
    { name: "Média", value: data.tasks.byPriority.medium },
    { name: "Alta", value: data.tasks.byPriority.high },
    { name: "Urgente", value: data.tasks.byPriority.urgent },
  ];

  // User by Role Data
  const userRoleData = [
    { name: "Admin", value: data.users.byRole.admin },
    { name: "Gerente", value: data.users.byRole.manager },
    { name: "Colaborador", value: data.users.byRole.employee },
  ];

  // Teams with Most Tasks
  const teamsData = data.teams.teamsWithMostTasks.map(team => ({
    name: team.teamName,
    tasks: team.taskCount,
  }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-linear-to-br from-slate-900 to-slate-700 text-white">
          <p className="text-sm text-slate-300">Total de Usuários</p>
          <p className="text-4xl font-bold">{data.users.total}</p>
          <p className="text-xs text-emerald-300">{data.users.active} ativos</p>
        </Card>

        <Card className="bg-linear-to-br from-blue-600 to-blue-400 text-white">
          <p className="text-sm text-blue-100">Total de Times</p>
          <p className="text-4xl font-bold">{data.teams.total}</p>
          <p className="text-xs text-blue-100">Média {data.teams.averageTeamSize.toFixed(1)} membros</p>
        </Card>

        <Card className="bg-linear-to-br from-emerald-600 to-emerald-400 text-white">
          <p className="text-sm text-emerald-100">Total de Tarefas</p>
          <p className="text-4xl font-bold">{data.tasks.total}</p>
          <p className="text-xs text-emerald-100">{data.tasks.done} concluídas</p>
        </Card>

        <Card className="bg-linear-to-br from-amber-600 to-amber-400 text-white">
          <p className="text-sm text-amber-100">Notificações</p>
          <p className="text-4xl font-bold">{data.notifications.total}</p>
          <p className="text-xs text-amber-100">{data.notifications.unread} não lidas</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Status das Tarefas">
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

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Usuários por Função">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Times com Mais Tarefas">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="tasks" fill={COLORS.info} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Productivity Section */}
      <Card title="Produtividade" description={`Período: ${formatDate(new Date(data.period.startDate))} - ${formatDate(new Date(data.period.endDate))}`}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Tarefas Concluídas</p>
            <p className="text-2xl font-bold text-slate-900">{data.productivity.tasksCompletedInPeriod}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Tempo Médio de Conclusão</p>
            <p className="text-2xl font-bold text-slate-900">{data.productivity.averageCompletionTime.toFixed(1)}h</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Ações Totais</p>
            <p className="text-2xl font-bold text-slate-900">{data.recentActivity.totalActions}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Usuários Mais Produtivos</h4>
          <div className="space-y-2">
            {data.productivity.mostProductiveUsers.map((user, index) => (
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

      {/* Recent Activity */}
      {data.recentActivity.topActions.length > 0 && (
        <Card title="Atividades Recentes">
          <div className="space-y-2">
            {data.recentActivity.topActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
              >
                <span className="text-sm text-slate-700">{action.action}</span>
                <span className="font-semibold text-slate-900">{action.count}x</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
