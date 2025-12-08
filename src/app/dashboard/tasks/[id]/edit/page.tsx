"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/core/ui/Card";
import { BackButton } from "@/shared/components/BackButton";
import { DashboardShell } from "../../../_components/DashboardShell";
import { useTaskDetails } from "../../_hooks/useTaskDetails";
import { useAuth } from "@/core/hooks/useAuth";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { TaskEditForm } from "../../_components/TaskEditForm";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: task, isLoading, error } = useTaskDetails(id);

  function handleSuccess() {
    router.push(`/dashboard/tasks/${id}`);
  }

  // Only MANAGER and ADMIN can edit tasks
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return (
      <DashboardShell title="Editar Tarefa">
        <div className="space-y-6">
          <BackButton />
          <ErrorState message="Você não tem permissão para editar tarefas. Apenas gerentes e administradores podem editar tarefas." />
        </div>
      </DashboardShell>
    );
  }

  if (isLoading) {
    return (
      <DashboardShell title="Editar Tarefa">
        <LoadingState message="Carregando tarefa..." />
      </DashboardShell>
    );
  }

  if (error || !task) {
    return (
      <DashboardShell title="Editar Tarefa">
        <div className="space-y-6">
          <BackButton />
          <ErrorState message="Não foi possível carregar a tarefa." />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Editar Tarefa">
      <div className="space-y-6">
        <BackButton />

        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Editar Tarefa
          </h1>

          <TaskEditForm task={task} onSuccess={handleSuccess} />
        </Card>
      </div>
    </DashboardShell>
  );
}
