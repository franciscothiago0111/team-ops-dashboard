"use client";

import { Card } from "@/core/ui/Card";
import { EmployeeMetricsResponse } from "@/shared/types/metrics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import Link from "next/link";
import { formatDate } from "@/core/utils/formatters";

interface EmployeeMetricsViewProps {
  data: EmployeeMetricsResponse;
}

const COLORS = {
  primary: "#0f172a",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

export function EmployeeMetricsView({ data }: EmployeeMetricsViewProps) {
  // Task Status Data
  const taskStatusData = [
    { name: "Pendentes", value: data?.myTasks?.pending, color: COLORS.warning },
    { name: "Em Progresso", value: data?.myTasks?.inProgress, color: COLORS.info },
    { name: "Concluídas", value: data?.myTasks?.done, color: COLORS.success },
  ];

  // Task Priority Data
  const taskPriorityData = [
    { name: "Baixa", value: data?.myTasks?.byPriority.low },
    { name: "Média", value: data?.myTasks?.byPriority.medium },
    { name: "Alta", value: data?.myTasks?.byPriority.high },
    { name: "Urgente", value: data?.myTasks?.byPriority.urgent },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-linear-to-br from-slate-900 to-slate-700 text-white">
          <p className="text-sm text-slate-300">Minhas Tarefas</p>
          <p className="text-4xl font-bold">{data?.myTasks?.total}</p>
          <p className="text-xs text-emerald-300">{data?.myTasks?.done} concluídas</p>
        </Card>

        <Card className="bg-linear-to-br from-blue-600 to-blue-400 text-white">
          <p className="text-sm text-blue-100">Taxa de Conclusão</p>
          <p className="text-4xl font-bold">{data?.performance?.completionRate.toFixed(1)}%</p>
        </Card>

        <Card className="bg-linear-to-br from-emerald-600 to-emerald-400 text-white">
          <p className="text-sm text-emerald-100">Concluídas no Período</p>
          <p className="text-4xl font-bold">{data?.performance?.tasksCompletedInPeriod}</p>
        </Card>

        <Card className="bg-linear-to-br from-amber-600 to-amber-400 text-white">
          <p className="text-sm text-amber-100">Tempo Médio</p>
          <p className="text-4xl font-bold">{data?.performance?.averageCompletionTime.toFixed(1)}h</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Status das Minhas Tarefas">
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
                {taskStatusData?.map((entry, index) => (
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

      {/* Performance Summary */}
      <Card
        title="Minha Performance"
        description={`Período: ${formatDate(data?.period.startDate)} - ${formatDate(data?.period.endDate)}`}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Tarefas Criadas</p>
            <p className="text-2xl font-bold text-slate-900">{data?.performance?.tasksCreated}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Meu Time</p>
            <p className="text-lg font-bold text-slate-900">{data?.team.name}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Posição no Time</p>
            <p className="text-2xl font-bold text-slate-900">
              {data?.team.myRankInTeam}º / {data?.team.totalMembers}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Tarefas Atrasadas</p>
            <p className="text-2xl font-bold text-red-600">{data?.myTasks?.overdue}</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Deadlines */}
      {data?.upcomingDeadlines?.length > 0 && (
        <Card title="Próximos Prazos" description="Tarefas com prazo próximo">
          <div className="space-y-3">
            {data?.upcomingDeadlines.map((task) => (
              <Link
                key={task.taskId}
                href={`/dashboard/tasks/${task.taskId}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{task.title}</h4>
                  <p className="text-sm text-slate-600">
                    Prazo: {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Notifications Summary */}
      <Card title="Minhas Notificações">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total de Notificações</p>
            <p className="text-3xl font-bold text-slate-900">{data?.notifications.total}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Não Lidas</p>
            <p className="text-3xl font-bold text-amber-600">{data?.notifications.unread}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
