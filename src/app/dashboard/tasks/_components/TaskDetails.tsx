"use client";

import Link from "next/link";
import { Card } from "@/core/ui/Card";
import { Button } from "@/core/ui/Button";
import { useTaskDetails } from "../_hooks/useTaskDetails";
import { useUpdateTask } from "../_hooks/useUpdateTask";
import { DashboardShell } from "../../_components/DashboardShell";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { BackButton } from "@/shared/components/BackButton";
import { RichTextDisplay } from "@/shared/components/RichTextDisplay";
import { formatDate } from "@/core/utils/formatters";
import {
  statusConfig,
  priorityConfigDetails,
  nextStatus,
  nextStatusLabelDetails,
  getDueDateInfoDetails,
} from "../_utils/task.utils";

import { useAuth } from "@/core/hooks/useAuth";
import {
  Calendar,
  User,
  Users,
  ArrowRight,
  Pencil,
  Download,
} from "lucide-react";
import clsx from "clsx";
import { usePDFDownload } from "@/core/hooks/usePDFDownload";


interface TaskDetailsProps {
  id: string;
}


export function TaskDetails({ id }: TaskDetailsProps) {
  const { data: task, isLoading, error } = useTaskDetails(id);
  const { execute: updateTask, isLoading: isUpdating } = useUpdateTask();
  const { user } = useAuth();
  const { generatePDF, isGenerating: isGeneratingPDF } = usePDFDownload();

  const canEditTask = user?.role === "MANAGER" || user?.role === "ADMIN";
  const isAssignedToCurrentUser = user?.id === task?.assignedToId;

  if (isLoading) {
    return <LoadingState message="Carregando tarefa..." />;
  }

  if (error || !task) {
    return <ErrorState message="Não foi possível carregar a tarefa." />;
  }

  const status = statusConfig[task.status];
  const priority = priorityConfigDetails[task.priority];
  const next = nextStatus[task.status];
  const dueDateInfo = getDueDateInfoDetails(task.dueDate, task.status);

  const handleStatusChange = async () => {
    if (next) {
      await updateTask({ id: task.id, status: next });
    }
  };

  const handleDownloadPDF = async () => {
    if (!task) return;

    await generatePDF({
      template: 'task-details',
      data: task,
      options: {
        filename: `task-${task.id}-${task.name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        title: `Task: ${task.name}`,
        author: user?.name || 'Team Ops Dashboard',
        subject: 'Task Details Report',
      },
    });
  };

  return (
    <DashboardShell title="Detalhes da Tarefa">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-2">


            <Button onClick={handleDownloadPDF}
              isLoading={isGeneratingPDF} leftIcon={<Download className="h-4 w-4" />}>
              Download PDF
            </Button>

            {canEditTask && (
              <Link
                href={`/dashboard/tasks/${task.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            )}
          </div>
        </div>

        {/* Main Card */}
        <Card>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                      status.bgColor,
                      status.color
                    )}
                  >
                    {status.label}
                  </span>
                  <span className={clsx("flex items-center gap-1 text-sm font-medium", priority.color)}>
                    <span>{priority.icon}</span>
                    {priority.label}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{task.name}</h1>
              </div>

              {next && (
                <Button
                  onClick={handleStatusChange}
                  isLoading={isUpdating}
                  disabled={!isAssignedToCurrentUser}
                  className="whitespace-nowrap"
                >
                  {nextStatusLabelDetails[task.status]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-slate-500">Descrição</h3>
                <RichTextDisplay content={task.description} />
              </div>
            )}

            {/* Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dueDateInfo && (
                <div
                  className={clsx(
                    "flex items-center gap-3 rounded-lg border p-4",
                    dueDateInfo.isOverdue
                      ? "border-red-200 bg-red-50"
                      : dueDateInfo.isDueToday
                        ? "border-amber-200 bg-amber-50"
                        : "border-slate-200 bg-white"
                  )}
                >
                  <Calendar
                    className={clsx(
                      "h-5 w-5",
                      dueDateInfo.isOverdue
                        ? "text-red-500"
                        : dueDateInfo.isDueToday
                          ? "text-amber-500"
                          : "text-slate-400"
                    )}
                  />
                  <div>
                    <p className="text-xs text-slate-500">Data de Entrega</p>
                    <p
                      className={clsx(
                        "font-medium",
                        dueDateInfo.isOverdue
                          ? "text-red-700"
                          : dueDateInfo.isDueToday
                            ? "text-amber-700"
                            : "text-slate-900"
                      )}
                    >
                      {dueDateInfo.formatted}
                      {dueDateInfo.isOverdue && " (atrasada)"}
                    </p>
                  </div>
                </div>
              )}

              {task.assignedTo && (
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Responsável</p>
                    <p className="font-medium text-slate-900">{task.assignedTo.name}</p>
                  </div>
                </div>
              )}

              {task.team && (
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <Users className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Time</p>
                    <p className="font-medium text-slate-900">{task.team.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Criado em</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(task.createdAt)}
                  </p>
                </div>
              </div>
            </div>


          </div>
        </Card>


      </div>
    </DashboardShell>
  );
}
