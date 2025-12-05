"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { TaskStatus } from "@/shared/types/task";
import { ITaskListParams } from "../_services/task.service";
import { useTaskList } from "../_hooks/useTaskList";
import { useUpdateTask } from "../_hooks/useUpdateTask";
import { useAuth } from "@/core/hooks/useAuth";
import { TaskBoardCard } from "./TaskBoardCard";
import { LoadingState } from "@/shared/components/LoadingState";
import { Plus } from "lucide-react";
import { statusConfig } from "../_utils/task.utils";
import { useCSVDownload } from "@/core/hooks/useCSVDownload";
import { CSVDownloadButton } from "@/shared/components/CSVDownloadButton";
import { formatDate } from "@/core/utils/formatters";
import { stripHtmlTags } from "@/core/utils/text";

const COLUMNS = [
  {
    status: "PENDING" as TaskStatus,
    title: statusConfig.PENDING.pluralLabel,
    icon: <statusConfig.PENDING.icon className="h-5 w-5" />,
    color: statusConfig.PENDING.color,
    bgColor: statusConfig.PENDING.bgColor,
  },
  {
    status: "IN_PROGRESS" as TaskStatus,
    title: statusConfig.IN_PROGRESS.pluralLabel,
    icon: <statusConfig.IN_PROGRESS.icon className="h-5 w-5" />,
    color: statusConfig.IN_PROGRESS.color,
    bgColor: statusConfig.IN_PROGRESS.bgColor,
  },
  {
    status: "COMPLETED" as TaskStatus,
    title: statusConfig.COMPLETED.pluralLabel,
    icon: <statusConfig.COMPLETED.icon className="h-5 w-5" />,
    color: statusConfig.COMPLETED.color,
    bgColor: statusConfig.COMPLETED.bgColor,
  },
];

export function TasksBoard() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { execute: updateTask } = useUpdateTask();
  const { generateCSV, isGenerating } = useCSVDownload();

  const canCreateTask = user?.role === "MANAGER" || user?.role === "ADMIN";

  const filters: ITaskListParams = {
    name: searchParams.get("name") || undefined,
    assignedToId: searchParams.get("assignedToId") || undefined,
    teamId: searchParams.get("teamId") || undefined,
    limit: 100, // Load all tasks for the board view
    priority: searchParams.get("priority") || undefined,
  };

  // Separate query for CSV export with high limit
  const filtersCsv: ITaskListParams = {
    ...filters,
    limit: 10000000,
  };

  const { data, isLoading, error, refetch } = useTaskList(filters);
  const { data: dataCsv } = useTaskList(filtersCsv);
  const tasks = data?.data ?? [];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask({ id: taskId, status: newStatus });
  };

  const handleDownloadCSV = async () => {
    if (!dataCsv?.data || dataCsv.data.length === 0) {
      return;
    }

    const csvData = dataCsv.data.map((task) => ({
      ID: task.id,
      Nome: task.name,
      Descrição: stripHtmlTags(task.description) || "",
      Status: task.status,
      Prioridade: task.priority,
      "Atribuído para": task.assignedTo?.name || "",
      Equipe: task.team?.name || "",
      "Criado por": task.createdBy?.name || "",
      "Data de vencimento": formatDate(task?.dueDate) || "",
      "Criado em": formatDate(task.createdAt) || "",
      "Atualizado em": task.updatedAt ? formatDate(task.updatedAt) : "",
    }));

    const fileName = `tarefas_${formatDate(new Date())}.csv`;
    await generateCSV({ data: csvData, filename: fileName });
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
        <div className="flex items-center gap-3">
          <CSVDownloadButton
            onClick={handleDownloadCSV}
            isLoading={isGenerating}
            disabled={!dataCsv?.data || dataCsv.data.length === 0}
          />
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
