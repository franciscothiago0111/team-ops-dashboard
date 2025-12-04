"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { TaskStatus } from "@/shared/types/task";
import { ITaskListParams } from "../_services/task.service";
import { useTaskList } from "../_hooks/useTaskList";
import { useUpdateTask } from "../_hooks/useUpdateTask";
import { useAuth } from "@/core/hooks/useAuth";
import { TaskBoardCard } from "./TaskBoardCard";
import { LoadingState } from "@/shared/components/LoadingState";

const COLUMNS: { status: TaskStatus; title: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
  {
    status: "PENDING",
    title: "Pendentes",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
  },
  {
    status: "IN_PROGRESS",
    title: "Em Progresso",
    icon: <Clock className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  {
    status: "COMPLETED",
    title: "Concluídas",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
];

export function TasksBoard() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { execute: updateTask } = useUpdateTask();

  const canCreateTask = user?.role === "MANAGER" || user?.role === "ADMIN";

  const filters: ITaskListParams = {
    name: searchParams.get("name") || undefined,
    assignedToId: searchParams.get("assignedToId") || undefined,
    teamId: searchParams.get("teamId") || undefined,
    limit: 100, // Load all tasks for the board view
    priority: searchParams.get("priority") || undefined,
  };

  const { data, isLoading, error, refetch } = useTaskList(filters);
  const tasks = data?.data ?? [];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return <LoadingState message="Carregando tarefas..." />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">Erro ao carregar tarefas.</p>
        <button
          onClick={() => void refetch()}
          className="mt-2 text-sm font-medium text-red-700 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Quadro de Tarefas</h2>
          <p className="text-sm text-slate-500">
            {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        {canCreateTask && (
          <Link
            href="/dashboard/tasks/new"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Nova tarefa
          </Link>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <div key={column.status} className="flex flex-col">
              {/* Column Header */}
              <div
                className={clsx(
                  "mb-4 flex items-center justify-between rounded-xl border p-4",
                  column.bgColor
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={column.color}>{column.icon}</div>
                  <h3 className={clsx("font-semibold", column.color)}>{column.title}</h3>
                </div>
                <span
                  className={clsx(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
                    column.color,
                    column.bgColor
                  )}
                >
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                    <p className="text-sm text-slate-400">Nenhuma tarefa</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskBoardCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      currentStatus={column.status}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
